/**
 * IQMath course registration.
 *
 * Bind this script to the registration spreadsheet:
 * Extensions → Apps Script, replace Code.gs with this file.
 *
 * Script properties (Project settings → Script properties):
 *   RAZORPAY_KEY_ID
 *   RAZORPAY_KEY_SECRET
 *
 * Deploy → New deployment → Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec URL into frontend/.env.local as NEXT_PUBLIC_APPS_SCRIPT_URL.
 * After every edit: Deploy → Manage deployments → pencil → Version: New version → Deploy.
 * The /exec URL keeps running the previous version until you do that.
 *
 * Run installReconcileTrigger once from the editor and approve access.
 * That check marks a row Paid if the student closes the page after paying.
 *
 * Rows are written to the tab named Registrations in this spreadsheet:
 * https://docs.google.com/spreadsheets/d/1Emnzs9rFU-pk6t0OmOyQ5IHAxD8pFFo-No6ODMSXHzo
 */

var SPREADSHEET_ID = "1Emnzs9rFU-pk6t0OmOyQ5IHAxD8pFFo-No6ODMSXHzo";
var COURSE_ID = "python-data-analytics";
var COURSE_NAME = "Python, SQL & Power BI — 2 Month Program";
var FULL_PAISE = 800000;
var FULL_RUPEES = "8000";
var COUPON_CODE = "IQDAB26";
var COUPON_PAISE = 500000;
var COUPON_RUPEES = "5000";
var SHEET_NAME = "Registrations";
var YEARS = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "Postgraduate"];
var EXPERIENCE = ["Fresher", "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
var HEADERS = [
  "timestamp",
  "registrationId",
  "name",
  "email",
  "mobile",
  "audience",
  "collegeName",
  "yearOfStudy",
  "companyName",
  "role",
  "experience",
  "courseId",
  "courseName",
  "amountInRupees",
  "status",
  "razorpayOrderId",
  "razorpayPaymentId",
  "paidAt",
  "notes"
];

function doGet() {
  return json({ ok: true, service: "iqmath-registration" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, message: "Please check the form and try again.", code: "EMPTY" });
    }
    var body = JSON.parse(e.postData.contents);
    if (body.action === "checkout") return json(handleCheckout(body));
    if (body.action === "verify") return json(handleVerify(body));
    return json({ ok: false, message: "Please check the form and try again.", code: "BAD_ACTION" });
  } catch (error) {
    console.error(error);
    return json({ ok: false, message: "Something went wrong. Please try again.", code: "SERVER_ERROR" });
  }
}

function installReconcileTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "reconcilePendingPayments") return;
  }
  ScriptApp.newTrigger("reconcilePendingPayments").timeBased().everyMinutes(5).create();
}

function reconcilePendingPayments() {
  withLock(function () {
    var sheet = getSheet();
    var rows = readRecords(sheet);
    var checked = 0;
    for (var i = rows.length - 1; i >= 0 && checked < 15; i--) {
      var row = rows[i];
      if (row.status !== "Pending" || !row.razorpayOrderId) continue;
      checked++;
      var payments = razorpay("/orders/" + encodeURIComponent(row.razorpayOrderId) + "/payments");
      var captured = findCaptured(payments.items || [], paiseForRow(row), row.razorpayOrderId);
      if (captured) {
        writeRecord(sheet, paidRecord(row, row.razorpayOrderId, captured.id));
      }
    }
  });
}

function handleCheckout(body) {
  var parsed = validateRegistration(body);
  if (!parsed.ok) return parsed;
  if (!configured()) {
    return { ok: false, message: "Registration is temporarily unavailable. Please try again shortly.", code: "NOT_CONFIGURED" };
  }

  var saved = withLock(function () {
    var sheet = getSheet();
    var rows = readRecords(sheet);
    var input = parsed.value;
    var registrationId = input.registrationId || Utilities.getUuid();

    if (input.registrationId) {
      var existing = findById(rows, input.registrationId);
      if (!existing || existing.email !== input.email || existing.courseId !== COURSE_ID) {
        return { error: { ok: false, message: "Please review your details and try again.", code: "REGISTRATION_NOT_FOUND" } };
      }
      var blocked = payBlock(existing);
      if (blocked) return { error: blocked };
      var updated = blankRecord(existing.rowNumber, existing.registrationId, input, existing.timestamp);
      writeRecord(sheet, updated);
      return { record: updated };
    }

    var latest = latestForEmail(rows, input.email);
    if (latest) {
      var latestBlocked = payBlock(latest);
      if (latestBlocked) return { error: latestBlocked };
      if (latest.status === "Pending") {
        var reused = blankRecord(latest.rowNumber, latest.registrationId, input, latest.timestamp);
        writeRecord(sheet, reused);
        return { record: reused };
      }
    }

    var created = blankRecord(0, registrationId, input, new Date().toISOString());
    var sheetNow = getSheet();
    sheetNow.appendRow(HEADERS.map(function (header) { return created[header] || ""; }));
    created.rowNumber = sheetNow.getLastRow();
    return { record: created };
  });

  if (saved.error) return saved.error;

  var order;
  try {
    order = razorpay("/orders", "post", {
      amount: paiseForRow(saved.record),
      currency: "INR",
      receipt: saved.record.registrationId,
      notes: { registrationId: saved.record.registrationId, courseId: COURSE_ID }
    });
  } catch (error) {
    console.error(error);
    withLock(function () {
      var sheet = getSheet();
      var row = findById(readRecords(sheet), saved.record.registrationId);
      if (row && row.status === "Pending") {
        row.status = "Failed";
        row.notes = "Could not create payment order";
        writeRecord(sheet, row);
      }
    });
    return { ok: false, message: "We could not start the payment. Please try again.", code: "RAZORPAY_ERROR" };
  }

  if (!order.id || Number(order.amount) !== paiseForRow(saved.record) || order.currency !== "INR") {
    return { ok: false, message: "We could not start the payment. Please try again.", code: "ORDER_INVALID" };
  }

  withLock(function () {
    var sheet = getSheet();
    var row = findById(readRecords(sheet), saved.record.registrationId);
    if (row && row.status !== "Paid") {
      row.razorpayOrderId = order.id;
      row.status = "Pending";
      writeRecord(sheet, row);
    }
  });

  return {
    ok: true,
    registrationId: saved.record.registrationId,
    orderId: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    keyId: prop("RAZORPAY_KEY_ID")
  };
}

function handleVerify(body) {
  var registrationId = String(body.registrationId || "");
  var orderId = String(body.razorpay_order_id || "");
  var paymentId = String(body.razorpay_payment_id || "");
  var signature = String(body.razorpay_signature || "");
  if (!registrationId || !orderId || !paymentId || !signature) {
    return paymentProblem();
  }
  if (!configured()) {
    return { ok: false, message: "Registration is temporarily unavailable. Please try again shortly.", code: "NOT_CONFIGURED" };
  }

  var expected = signCheckout(orderId, paymentId, prop("RAZORPAY_KEY_SECRET"));
  if (!safeEqual(expected, signature)) return paymentProblem("BAD_SIGNATURE");

  var row = withLock(function () {
    return findById(readRecords(getSheet()), registrationId);
  });
  if (!row) return paymentProblem("REGISTRATION_NOT_FOUND");
  if (row.status === "Paid") return receipt(row);

  var payment;
  try {
    payment = confirmPayment(paymentId, orderId, registrationId, paiseForRow(row));
  } catch (error) {
    if (error && error.code === "PAYMENT_PENDING_CONFIRMATION") {
      withLock(function () {
        var sheet = getSheet();
        var current = findById(readRecords(sheet), registrationId);
        if (current && current.status !== "Paid") {
          current.status = "Authorized";
          current.razorpayOrderId = orderId;
          current.razorpayPaymentId = paymentId;
          current.notes = "Payment authorized. Waiting for capture. Do not charge again.";
          writeRecord(sheet, current);
        }
      });
      return {
        ok: false,
        message: "Your payment is being confirmed. Please do not pay again. If this stays unresolved, contact IQMath with your payment reference.",
        code: "PAYMENT_PENDING_CONFIRMATION"
      };
    }
    return paymentProblem(error && error.code);
  }

  var paid = withLock(function () {
    var sheet = getSheet();
    var current = findById(readRecords(sheet), registrationId);
    if (!current) return null;
    if (current.status === "Paid") {
      if (current.razorpayPaymentId && current.razorpayPaymentId !== payment.id) {
        current.notes = (current.notes ? current.notes + " " : "") + "Additional captured payment " + payment.id + ". Review for a refund.";
        writeRecord(sheet, current);
      }
      return current;
    }
    var next = paidRecord(current, payment.order_id || orderId, payment.id);
    writeRecord(sheet, next);
    return next;
  });

  if (!paid) return paymentProblem("REGISTRATION_NOT_FOUND");
  return receipt(paid);
}

function confirmPayment(paymentId, orderId, registrationId, expectedPaise) {
  var order = razorpay("/orders/" + encodeURIComponent(orderId));
  if (Number(order.amount) !== expectedPaise || order.currency !== "INR" || noteValue(order.notes, "registrationId") !== registrationId) {
    throw { code: "AMOUNT_MISMATCH" };
  }
  var payment = razorpay("/payments/" + encodeURIComponent(paymentId));
  if (payment.order_id !== orderId || Number(payment.amount) !== expectedPaise || payment.currency !== "INR") {
    throw { code: "PAYMENT_MISMATCH" };
  }
  if (payment.status === "authorized") {
    payment = razorpay("/payments/" + encodeURIComponent(paymentId) + "/capture", "post", {
      amount: expectedPaise,
      currency: "INR"
    });
  }
  if (payment.status !== "captured" || Number(payment.amount) !== expectedPaise) {
    throw { code: "PAYMENT_PENDING_CONFIRMATION" };
  }
  return payment;
}

function findCaptured(items, expectedPaise, orderId) {
  for (var i = 0; i < items.length; i++) {
    var payment = items[i];
    if (payment.status === "captured" && Number(payment.amount) === expectedPaise && payment.currency === "INR" && payment.order_id === orderId) {
      return payment;
    }
  }
  return null;
}

function priceForCoupon(coupon) {
  var code = String(coupon || "").replace(/\s+/g, "").toUpperCase();
  if (code === COUPON_CODE) return { paise: COUPON_PAISE, rupees: COUPON_RUPEES, coupon: COUPON_CODE };
  return { paise: FULL_PAISE, rupees: FULL_RUPEES, coupon: "" };
}

function paiseForRow(row) {
  var rupees = Number(row && row.amountInRupees);
  if (rupees === 5000) return COUPON_PAISE;
  return FULL_PAISE;
}

function validateRegistration(body) {
  var errors = {};
  var name = String(body.name || "").trim().replace(/\s+/g, " ");
  var email = String(body.email || "").trim().toLowerCase();
  var mobile = normalizeMobile(String(body.mobile || ""));
  if (name.length < 2) errors.name = "Enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Enter a valid 10-digit Indian mobile number";

  var audience = body.audience;
  var value = {
    name: name,
    email: email,
    mobile: mobile,
    audience: audience,
    registrationId: body.registrationId ? String(body.registrationId) : "",
    price: priceForCoupon(body.coupon)
  };

  if (audience === "college") {
    value.collegeName = String(body.collegeName || "").trim();
    value.yearOfStudy = String(body.yearOfStudy || "");
    if (value.collegeName.length < 2) errors.collegeName = "Enter your college name";
    if (YEARS.indexOf(value.yearOfStudy) === -1) errors.yearOfStudy = "Select your year of study";
  } else if (audience === "company") {
    value.companyName = String(body.companyName || "").trim();
    value.role = String(body.role || "").trim();
    value.experience = String(body.experience || "");
    if (value.companyName.length < 2) errors.companyName = "Enter your company name";
    if (value.role.length < 2) errors.role = "Enter your role";
    if (EXPERIENCE.indexOf(value.experience) === -1) errors.experience = "Select your experience";
  } else {
    errors.audience = "Choose college or company";
  }

  if (Object.keys(errors).length) {
    return { ok: false, message: "Please check the form and try again.", code: "INVALID_FORM", fieldErrors: errors };
  }
  return { ok: true, value: value };
}

function normalizeMobile(input) {
  var digits = String(input).replace(/\D/g, "");
  if (digits.length >= 12 && digits.indexOf("91") === 0) return digits.substring(2, 12);
  if (digits.length === 11 && digits.indexOf("0") === 0) return digits.substring(1);
  return digits.substring(0, 10);
}

function blankRecord(rowNumber, registrationId, input, timestamp) {
  return {
    rowNumber: rowNumber,
    timestamp: timestamp || new Date().toISOString(),
    registrationId: registrationId,
    name: input.name,
    email: input.email,
    mobile: input.mobile,
    audience: input.audience,
    collegeName: input.audience === "college" ? input.collegeName : "",
    yearOfStudy: input.audience === "college" ? input.yearOfStudy : "",
    companyName: input.audience === "company" ? input.companyName : "",
    role: input.audience === "company" ? input.role : "",
    experience: input.audience === "company" ? input.experience : "",
    courseId: COURSE_ID,
    courseName: COURSE_NAME,
    amountInRupees: input.price.rupees,
    status: "Pending",
    razorpayOrderId: "",
    razorpayPaymentId: "",
    paidAt: "",
    notes: input.price.coupon ? "Coupon " + input.price.coupon : ""
  };
}

function paidRecord(row, orderId, paymentId) {
  row.status = "Paid";
  row.razorpayOrderId = orderId;
  row.razorpayPaymentId = paymentId;
  row.paidAt = new Date().toISOString();
  return row;
}

function receipt(row) {
  return {
    ok: true,
    registrationId: row.registrationId,
    paymentId: row.razorpayPaymentId,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    courseName: row.courseName,
    amountInRupees: Number(row.amountInRupees) || 8000
  };
}

function payBlock(row) {
  if (row.status === "Paid") {
    return { ok: false, message: "This email is already registered for this program.", code: "ALREADY_PAID" };
  }
  if (row.status === "Authorized") {
    return {
      ok: false,
      message: "A payment for this email is already being confirmed. Please do not pay again. Contact IQMath if you need help.",
      code: "PAYMENT_PENDING_CONFIRMATION"
    };
  }
  return null;
}

function paymentProblem(code) {
  return {
    ok: false,
    message: "We could not confirm this payment. If money was deducted, do not pay again. Contact IQMath with your payment reference.",
    code: code || "PAYMENT_NOT_CONFIRMED"
  };
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var named = spreadsheet.getSheetByName(SHEET_NAME);
  if (named) return ensureHeaders(named);

  var sheets = spreadsheet.getSheets();
  var first = sheets[0];
  if (sheets.length === 1 && first.getLastRow() === 0 && first.getLastColumn() === 0) {
    first.setName(SHEET_NAME);
    return ensureHeaders(first);
  }

  return ensureHeaders(spreadsheet.insertSheet(SHEET_NAME, 0));
}

function ensureHeaders(sheet) {
  var header = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (!header[0]) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(2, 5, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat("@");
  }
  return sheet;
}

function readRecords(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var records = [];
  for (var i = 0; i < values.length; i++) {
    var record = { rowNumber: i + 2 };
    for (var c = 0; c < HEADERS.length; c++) record[HEADERS[c]] = asText(values[i][c]);
    if (record.registrationId) records.push(record);
  }
  return records;
}

function writeRecord(sheet, record) {
  var row = HEADERS.map(function (header) { return record[header] || ""; });
  sheet.getRange(record.rowNumber, 1, 1, HEADERS.length).setValues([row]);
}

function findById(rows, registrationId) {
  for (var i = rows.length - 1; i >= 0; i--) {
    if (rows[i].registrationId === registrationId) return rows[i];
  }
  return null;
}

function latestForEmail(rows, email) {
  for (var i = rows.length - 1; i >= 0; i--) {
    if (rows[i].email === email && rows[i].courseId === COURSE_ID) return rows[i];
  }
  return null;
}

function withLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function configured() {
  var props = PropertiesService.getScriptProperties();
  return Boolean(props.getProperty("RAZORPAY_KEY_ID") && props.getProperty("RAZORPAY_KEY_SECRET"));
}

function prop(name) {
  var value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error("Missing " + name);
  return value;
}

function razorpay(path, method, payload) {
  var options = {
    method: method || "get",
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(prop("RAZORPAY_KEY_ID") + ":" + prop("RAZORPAY_KEY_SECRET")),
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };
  if (payload) options.payload = JSON.stringify(payload);
  var response = UrlFetchApp.fetch("https://api.razorpay.com/v1" + path, options);
  var data = JSON.parse(response.getContentText() || "{}");
  if (response.getResponseCode() >= 300) {
    console.error(path, data.error && data.error.description);
    throw { code: "RAZORPAY_ERROR" };
  }
  return data;
}

function signCheckout(orderId, paymentId, secret) {
  var bytes = Utilities.computeHmacSha256Signature(orderId + "|" + paymentId, secret);
  return bytes.map(function (byte) {
    var value = (byte < 0 ? byte + 256 : byte).toString(16);
    return value.length === 1 ? "0" + value : value;
  }).join("");
}

function safeEqual(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  var mismatch = 0;
  for (var i = 0; i < left.length; i++) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

function noteValue(notes, key) {
  if (!notes || Object.prototype.toString.call(notes) !== "[object Object]") return "";
  return typeof notes[key] === "string" ? notes[key] : "";
}

function asText(value) {
  if (value instanceof Date) return value.toISOString();
  if (value === null || value === undefined) return "";
  return String(value);
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

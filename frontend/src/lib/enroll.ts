const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

export const COURSE_ID = "python-data-analytics";
export const COURSE_NAME = "Python, SQL & Power BI — 2 Month Program";
export const COURSE_FEE_PAISE = 500_000;
export const COURSE_FEE_RUPEES = 5_000;
export const COURSE_LIST_PRICE_RUPEES = 8_000;

export const YEARS_OF_STUDY = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year",
  "Postgraduate"
] as const;

export const EXPERIENCE_LEVELS = [
  "Fresher",
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years"
] as const;

export const MODULES = [
  {
    title: "Introduction to Python",
    detail: "Syntax, data types, control flow, and writing small programs with confidence."
  },
  {
    title: "NumPy",
    detail: "Arrays and vectorized numerical work, the base for everything that follows."
  },
  {
    title: "Pandas",
    detail: "Tables, cleaning, and the day-to-day work of analysing a dataset."
  },
  {
    title: "Visualization in Python",
    detail: "Charts and comparisons with Matplotlib and Seaborn."
  },
  {
    title: "SQL",
    detail: "Querying relational data so you can pull the rows a question actually needs."
  },
  {
    title: "Excel",
    detail: "Spreadsheets for analysis, summaries, and the reports teams still live in."
  },
  {
    title: "Power BI",
    detail: "Dashboards that turn the work above into something a room can read."
  }
] as const;

export const FACTS = [
  { label: "Duration", value: "2 months" },
  { label: "Days", value: "Monday to Friday" },
  { label: "Session", value: "1 hour a day" },
  { label: "Format", value: "Live online" },
  { label: "Total", value: "45 hours" }
] as const;

export type Audience = "college" | "company";

export type EnrollForm = {
  name: string;
  email: string;
  mobile: string;
  audience: Audience;
  collegeName: string;
  yearOfStudy: string;
  companyName: string;
  role: string;
  experience: string;
};

export const EMPTY_FORM: EnrollForm = {
  name: "",
  email: "",
  mobile: "",
  audience: "college",
  collegeName: "",
  yearOfStudy: "",
  companyName: "",
  role: "",
  experience: ""
};

export function normalizeMobile(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("91")) return digits.slice(2, 12);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.slice(0, 10);
}

export function validateForm(form: EnrollForm): Partial<Record<keyof EnrollForm, string>> {
  const errors: Partial<Record<keyof EnrollForm, string>> = {};
  const name = form.name.trim().replace(/\s+/g, " ");
  if (name.length < 2 || !/\p{L}/u.test(name)) errors.name = "Enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address";
  if (!/^[6-9]\d{9}$/.test(normalizeMobile(form.mobile))) errors.mobile = "Enter a valid 10-digit Indian mobile number";

  if (form.audience === "college") {
    if (form.collegeName.trim().length < 2) errors.collegeName = "Enter your college name";
    if (!YEARS_OF_STUDY.includes(form.yearOfStudy as (typeof YEARS_OF_STUDY)[number])) {
      errors.yearOfStudy = "Select your year of study";
    }
  } else {
    if (form.companyName.trim().length < 2) errors.companyName = "Enter your company name";
    if (form.role.trim().length < 2) errors.role = "Enter your role";
    if (!EXPERIENCE_LEVELS.includes(form.experience as (typeof EXPERIENCE_LEVELS)[number])) {
      errors.experience = "Select your experience";
    }
  }

  return errors;
}

export function registrationPayload(form: EnrollForm, registrationId?: string) {
  const shared = {
    name: form.name.trim().replace(/\s+/g, " "),
    email: form.email.trim(),
    mobile: normalizeMobile(form.mobile),
    ...(registrationId ? { registrationId } : {})
  };

  if (form.audience === "college") {
    return {
      ...shared,
      audience: "college" as const,
      collegeName: form.collegeName.trim(),
      yearOfStudy: form.yearOfStudy
    };
  }

  return {
    ...shared,
    audience: "company" as const,
    companyName: form.companyName.trim(),
    role: form.role.trim(),
    experience: form.experience
  };
}

export type CheckoutResponse = {
  registrationId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type VerifiedRegistration = {
  ok: true;
  registrationId: string;
  paymentId: string;
  name: string;
  email: string;
  mobile: string;
  courseName: string;
  amountInRupees: number;
};

export class EnrollRequestError extends Error {
  fieldErrors?: Partial<Record<keyof EnrollForm, string>>;
  code?: string;
  paymentId?: string;

  constructor(message: string, fieldErrors?: Partial<Record<keyof EnrollForm, string>>, code?: string) {
    super(message);
    this.name = "EnrollRequestError";
    this.fieldErrors = fieldErrors;
    this.code = code;
  }
}

async function postAppsScript<T>(action: "checkout" | "verify", body: object): Promise<T> {
  if (!APPS_SCRIPT_URL) {
    throw new EnrollRequestError("Registration is temporarily unavailable. Please try again shortly.");
  }

  let response: Response;
  try {
    response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...body })
    });
  } catch {
    throw new EnrollRequestError("We could not reach the registration service. Check your connection and try again.");
  }

  const data = (await response.json().catch(() => null)) as {
    ok?: boolean;
    message?: string;
    code?: string;
    fieldErrors?: Partial<Record<keyof EnrollForm, string>>;
  } | null;

  if (!data || data.ok === false) {
    throw new EnrollRequestError(
      data?.message || "Something went wrong. Please try again.",
      data?.fieldErrors,
      data?.code
    );
  }

  return data as T;
}

export function createCheckout(form: EnrollForm, registrationId?: string) {
  return postAppsScript<CheckoutResponse>("checkout", registrationPayload(form, registrationId));
}

export function verifyPayment(body: {
  registrationId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return postAppsScript<VerifiedRegistration>("verify", body);
}

export function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

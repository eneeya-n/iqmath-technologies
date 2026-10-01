"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, WHATSAPP_HREF } from "@/lib/contact";
import {
  COURSE_FEE_RUPEES,
  COURSE_NAME,
  EMPTY_FORM,
  EXPERIENCE_LEVELS,
  EnrollForm,
  EnrollRequestError,
  FACTS,
  MODULES,
  VerifiedRegistration,
  YEARS_OF_STUDY,
  createCheckout,
  inr,
  normalizeMobile,
  quotedFee,
  validateForm,
  verifyPayment
} from "@/lib/enroll";

type Stage = "details" | "review" | "success";
type Phase = "idle" | "opening" | "verifying" | "result";

type PaymentDialog =
  | { status: "loading"; title: string; detail: string }
  | { status: "success"; receipt: VerifiedRegistration }
  | { status: "incomplete"; title: string; detail: string; allowRetry: boolean };

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckout = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error?: { metadata?: { payment_id?: string } } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayCheckout;
  }
}

function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new EnrollRequestError("Payment checkout could not be loaded. Please try again."));
    document.body.appendChild(script);
  });
}

export function RegisterExperience() {
  const formId = useId();
  const [form, setForm] = useState<EnrollForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof EnrollForm, string>>>({});
  const [stage, setStage] = useState<Stage>("details");
  const [phase, setPhase] = useState<Phase>("idle");
  const [notice, setNotice] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [receipt, setReceipt] = useState<VerifiedRegistration | null>(null);
  const [dialog, setDialog] = useState<PaymentDialog | null>(null);
  const [coupon, setCoupon] = useState("");
  const quote = quotedFee(coupon);
  const couponInvalid = coupon.trim().length > 0 && !quote.applied;

  useEffect(() => {
    if (!dialog) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [dialog]);

  function closeDialog() {
    if (dialog?.status === "incomplete" && !dialog.allowRetry) setNotice(dialog.detail);
    setDialog(null);
    setPhase("idle");
  }

  function update<K extends keyof EnrollForm>(key: K, value: EnrollForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function scrollToForm() {
    document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onContinue(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length > 0) return;
    setStage("review");
    scrollToForm();
  }

  async function onPay() {
    if (phase !== "idle") return;
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStage("details");
      return;
    }

    setPhase("opening");
    setNotice("");
    setDialog({
      status: "loading",
      title: "Opening secure payment",
      detail: "Your registration is being saved and Razorpay is opening. Stay on this page."
    });

    try {
      const checkout = await createCheckout(form, registrationId || undefined, coupon);
      setRegistrationId(checkout.registrationId);

      if (checkout.amount !== quote.paise || checkout.currency !== "INR" || !checkout.keyId || !checkout.orderId) {
        throw new EnrollRequestError("We could not start the payment. Please try again.");
      }

      await loadRazorpay();
      if (!window.Razorpay) throw new EnrollRequestError("Payment checkout could not be loaded. Please try again.");

      const settled = { current: false };
      const payment = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "IQMath Technologies",
        description: COURSE_NAME,
        order_id: checkout.orderId,
        notes: {
          registrationId: checkout.registrationId
        },
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: normalizeMobile(form.mobile)
        },
        theme: { color: "#1657A8" },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            if (settled.current) return;
            settled.current = true;
            setPhase("result");
            setDialog({
              status: "incomplete",
              title: "Payment window closed",
              detail:
                "The payment window was closed. If you were not charged, you can try again. If money was deducted, do not pay again — contact IQMath with your email.",
              allowRetry: true
            });
          }
        },
        handler: async (response: RazorpaySuccess) => {
          if (settled.current) return;
          settled.current = true;
          setPhase("verifying");
          setDialog({
            status: "loading",
            title: "Confirming your payment",
            detail: "Razorpay accepted the payment. We are confirming it before marking you registered."
          });
          try {
            const verified = await verifyPayment({
              registrationId: checkout.registrationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setReceipt(verified);
            setStage("success");
            setNotice("");
            setPhase("result");
            setDialog({ status: "success", receipt: verified });
            scrollToForm();
          } catch (error) {
            const message =
              error instanceof EnrollRequestError
                ? error.message
                : "We could not confirm this payment.";
            setPhase("result");
            setDialog({
              status: "incomplete",
              title: "We could not confirm this payment",
              detail: `${message} Payment reference ${response.razorpay_payment_id}. If money was deducted, do not pay again. Contact IQMath with this reference.`,
              allowRetry: false
            });
          }
        }
      });

      payment.on("payment.failed", (failure) => {
        if (settled.current) return;
        settled.current = true;
        const paymentId = failure.error?.metadata?.payment_id;
        setPhase("result");
        setDialog({
          status: "incomplete",
          title: "Payment was not completed",
          detail: paymentId
            ? `Payment was not completed. Reference ${paymentId}. If any amount was deducted, do not pay again and contact IQMath. Otherwise you can try again.`
            : "Payment was not completed. If any amount was deducted, do not pay again and contact IQMath. Otherwise you can try again.",
          allowRetry: true
        });
      });

      setDialog({
        status: "loading",
        title: "Complete payment in Razorpay",
        detail: "The Razorpay window is in front of this page. This status will update when the payment finishes."
      });
      payment.open();
    } catch (error) {
      if (error instanceof EnrollRequestError && error.fieldErrors) {
        setErrors(error.fieldErrors);
        setStage("details");
      }
      setPhase("result");
      setDialog({
        status: "incomplete",
        title: "Payment could not start",
        detail: error instanceof EnrollRequestError ? error.message : "Something went wrong. Please try again.",
        allowRetry: true
      });
    }
  }

  const busy = phase !== "idle";

  return (
    <div>
      <header className="border-b border-[#e3dbcf]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center">
            <img
              src="/assets/logos/iqmath-logo.jpeg"
              alt="IQMath Technologies"
              className="h-11 w-auto rounded-md bg-white sm:h-12"
            />
          </a>
          <p className="text-right text-[0.7rem] uppercase tracking-[0.22em] text-[#6a6258] sm:text-xs">
            Cohort registration
          </p>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_340px] lg:pt-20 lg:pb-20">
          <div>
            <p className="text-sm font-medium text-[#1657A8]">Live weekday cohort</p>
            <h1 className="mt-4 max-w-3xl text-[2.6rem] leading-[1.05] text-[#172033] sm:text-6xl [font-family:var(--font-enroll-display),Georgia,serif]">
              Python, data, and Power BI, taught one hour a day.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3e4854]">
              A two-month program from IQMath Technologies. You move from Python through NumPy, Pandas,
              charts, SQL, Excel, and Power BI in live online sessions, Monday to Friday.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#e3dbcf] pt-6 sm:grid-cols-3">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-[#6a6258]">{fact.label}</dt>
                  <dd className="mt-1 text-base text-[#172033]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="rounded-[28px] border border-[#e3dbcf] bg-white p-7 shadow-[0_20px_50px_rgba(23,32,51,0.05)]">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[#6a6258]">Fee for this cohort</p>
            <p className="mt-5 text-5xl leading-none text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
              {inr(COURSE_FEE_RUPEES)}
            </p>
            <ul className="mt-6 space-y-2 border-t border-[#efe8dc] pt-5 text-sm leading-relaxed text-[#3e4854]">
              <li>All seven modules in one registration</li>
              <li>1 hour a day, Monday to Friday</li>
              <li>45 hours across 2 months</li>
            </ul>
            <a
              href="#enroll"
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1657A8] px-5 text-sm font-medium text-white transition hover:bg-[#124886]"
            >
              Continue to registration
            </a>
          </aside>
        </section>

        <section className="border-y border-[#e3dbcf] bg-[#fbf8f2]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#1657A8]">Curriculum</p>
              <h2 className="mt-3 text-4xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
                Seven modules, in this order.
              </h2>
            </div>
            <ol className="mt-10 divide-y divide-[#e7e0d4] border-y border-[#e7e0d4]">
              {MODULES.map((module, index) => (
                <li key={module.title} className="grid gap-2 py-5 sm:grid-cols-[4.5rem_minmax(0,16rem)_1fr] sm:items-baseline sm:gap-6">
                  <span className="text-sm tabular-nums text-[#8d857b]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg text-[#172033]">{module.title}</h3>
                  <p className="text-sm leading-relaxed text-[#4d5864]">{module.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="enroll" className="scroll-mt-6">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-20">
            <div>
              <p className="text-sm font-medium text-[#1657A8]">Registration</p>
              <h2 className="mt-3 text-4xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
                Your details, then payment.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4d5864]">
                Fill in the form, review it, and pay {inr(COURSE_FEE_RUPEES)} through Razorpay. You are registered only after the payment is confirmed.
              </p>

              <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Registration steps">
                <Step index={1} label="Details" active={stage === "details"} done={stage !== "details"} />
                <Step index={2} label="Review" active={stage === "review"} done={stage === "success"} />
                <Step index={3} label="Payment" active={stage === "success" || phase !== "idle"} done={stage === "success"} />
              </ol>

              {notice ? (
                <p role="alert" className="mt-6 rounded-2xl border border-[#ead8b0] bg-[#fff8ec] px-4 py-3 text-sm leading-relaxed text-[#5c4314]">
                  {notice}
                </p>
              ) : null}

              {stage === "details" ? (
                <form id={formId} className="mt-8 space-y-6" onSubmit={onContinue} noValidate>
                  <Field
                    label="Full name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    error={errors.name}
                    onChange={(value) => update("name", value)}
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      error={errors.email}
                      onChange={(value) => update("email", value)}
                    />
                    <MobileField
                      value={form.mobile}
                      error={errors.mobile}
                      onChange={(value) => update("mobile", normalizeMobile(value))}
                    />
                  </div>

                  <fieldset>
                    <legend className="text-sm font-medium text-[#172033]">I am registering as</legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["college", "College student"],
                          ["company", "Working at a company"]
                        ] as const
                      ).map(([value, label]) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                            form.audience === value
                              ? "border-[#1657A8] bg-[#f3f7fc] text-[#172033]"
                              : "border-[#e3dbcf] bg-white text-[#3e4854]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="audience"
                            value={value}
                            checked={form.audience === value}
                            onChange={() => update("audience", value)}
                            className="accent-[#1657A8]"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {form.audience === "college" ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="College name"
                        name="collegeName"
                        autoComplete="organization"
                        value={form.collegeName}
                        error={errors.collegeName}
                        onChange={(value) => update("collegeName", value)}
                      />
                      <SelectField
                        label="Year of study"
                        name="yearOfStudy"
                        value={form.yearOfStudy}
                        error={errors.yearOfStudy}
                        placeholder="Select year"
                        options={YEARS_OF_STUDY}
                        onChange={(value) => update("yearOfStudy", value)}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="Company name"
                        name="companyName"
                        autoComplete="organization"
                        value={form.companyName}
                        error={errors.companyName}
                        onChange={(value) => update("companyName", value)}
                      />
                      <Field
                        label="Role"
                        name="role"
                        autoComplete="organization-title"
                        value={form.role}
                        error={errors.role}
                        onChange={(value) => update("role", value)}
                      />
                      <SelectField
                        label="Experience"
                        name="experience"
                        value={form.experience}
                        error={errors.experience}
                        placeholder="Select experience"
                        options={EXPERIENCE_LEVELS}
                        onChange={(value) => update("experience", value)}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#1657A8] px-7 text-sm font-medium text-white transition hover:bg-[#124886]"
                  >
                    Review details
                  </button>
                </form>
              ) : null}

              {stage === "review" ? (
                <div className="mt-8 rounded-[28px] border border-[#e3dbcf] bg-white p-6 sm:p-8">
                  <h3 className="text-2xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
                    Check this before you pay
                  </h3>
                  <dl className="mt-6 divide-y divide-[#efe8dc]">
                    <ReviewRow label="Name" value={form.name.trim()} />
                    <ReviewRow label="Email" value={form.email.trim()} />
                    <ReviewRow label="Mobile" value={`+91 ${normalizeMobile(form.mobile)}`} />
                    {form.audience === "college" ? (
                      <>
                        <ReviewRow label="College" value={form.collegeName.trim()} />
                        <ReviewRow label="Year of study" value={form.yearOfStudy} />
                      </>
                    ) : (
                      <>
                        <ReviewRow label="Company" value={form.companyName.trim()} />
                        <ReviewRow label="Role" value={form.role.trim()} />
                        <ReviewRow label="Experience" value={form.experience} />
                      </>
                    )}
                    <ReviewRow label="Program" value={COURSE_NAME} />
                    <ReviewRow label="Program fee" value={inr(COURSE_FEE_RUPEES)} />
                    <ReviewRow label="Amount due" value={inr(quote.rupees)} />
                  </dl>
                  <label className="mt-6 block" htmlFor="coupon-field">
                    <span className="text-sm font-medium text-[#172033]">Coupon</span>
                    <input
                      id="coupon-field"
                      name="coupon"
                      value={coupon}
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="Coupon code"
                      aria-invalid={couponInvalid}
                      aria-describedby={quote.applied || couponInvalid ? "coupon-help" : undefined}
                      onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                      className="mt-2 h-12 w-full rounded-2xl border border-[#e3dbcf] bg-white px-4 text-base tracking-[0.08em] text-[#172033] outline-none ring-[#1657A8] placeholder:tracking-normal placeholder:text-[#b0a898] focus:ring-2"
                    />
                    {quote.applied || couponInvalid ? (
                      <span id="coupon-help" className={`mt-2 block text-sm ${quote.applied ? "text-[#2f6b28]" : "text-[#9b2c2c]"}`}>
                        {quote.applied
                          ? `Coupon applied. You pay ${inr(quote.rupees)}.`
                          : "That coupon is not valid."}
                      </span>
                    ) : null}
                  </label>
                  <p className="mt-6 text-sm leading-relaxed text-[#4d5864]">
                    Razorpay opens next. The charge is {inr(quote.rupees)}. Your place is confirmed only after that payment is verified.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={onPay}
                      disabled={busy}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[#1657A8] px-7 text-sm font-medium text-white transition hover:bg-[#124886] disabled:cursor-wait disabled:opacity-70"
                    >
                      {dialog?.status === "loading"
                        ? dialog.title.startsWith("Confirming")
                          ? "Confirming payment…"
                          : dialog.title.startsWith("Complete")
                            ? "Waiting for payment…"
                            : "Opening secure payment…"
                        : `Pay ${inr(quote.rupees)}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (busy) return;
                        setStage("details");
                        setNotice("");
                      }}
                      disabled={busy}
                      className="inline-flex h-12 items-center justify-center rounded-full border border-[#d9d0c3] px-6 text-sm text-[#172033] disabled:opacity-50"
                    >
                      Edit details
                    </button>
                  </div>
                </div>
              ) : null}

              {stage === "success" && receipt ? (
                <div className="mt-8 rounded-[28px] border border-[#d7e7cf] bg-white p-6 sm:p-8">
                  <p className="text-sm font-medium text-[#2f6b28]">Payment confirmed</p>
                  <h3 className="mt-2 text-4xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
                    You are registered, {receipt.name.split(" ")[0]}.
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#3e4854]">
                    {receipt.courseName} is confirmed for {receipt.email}. Keep the payment reference below.
                  </p>
                  <dl className="mt-6 divide-y divide-[#efe8dc]">
                    <ReviewRow label="Name" value={receipt.name} />
                    <ReviewRow label="Email" value={receipt.email} />
                    <ReviewRow label="Mobile" value={`+91 ${receipt.mobile}`} />
                    <ReviewRow label="Amount paid" value={inr(receipt.amountInRupees)} />
                    <ReviewRow label="Payment reference" value={receipt.paymentId} />
                  </dl>
                </div>
              ) : null}
            </div>

            <aside className="h-fit rounded-[28px] border border-[#e3dbcf] bg-white p-6 lg:sticky lg:top-6">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[#6a6258]">What you are paying for</p>
              <p className="mt-4 text-xl leading-snug text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
                {COURSE_NAME}
              </p>
              <p className="mt-4 text-3xl text-[#172033]">{inr(COURSE_FEE_RUPEES)}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#4d5864]">
                Online, Monday to Friday, one hour a day, for two months. 45 hours in total.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e3dbcf]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[#5c6874] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>IQMath Technologies</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <a className="underline decoration-[#d7cdb8] underline-offset-4" href={CONTACT_PHONE_HREF}>
              {CONTACT_PHONE}
            </a>
            <a className="underline decoration-[#d7cdb8] underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <a className="underline decoration-[#d7cdb8] underline-offset-4" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </div>
      </footer>

      {dialog ? <PaymentStatusDialog dialog={dialog} onClose={closeDialog} /> : null}
    </div>
  );
}

function PaymentStatusDialog({ dialog, onClose }: { dialog: PaymentDialog; onClose: () => void }) {
  const titleId = useId();
  const loading = dialog.status === "loading";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center px-4 py-6 sm:items-center">
      <div className="absolute inset-0 bg-[#172033]/50 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={loading}
        className="relative w-full max-w-lg rounded-[28px] border border-[#e3dbcf] bg-[#fbf8f2] p-6 shadow-[0_24px_80px_rgba(23,32,51,0.2)] sm:p-8"
      >
        {loading ? (
          <>
            <span
              className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#d7cdb8] border-t-[#1657A8]"
              aria-hidden
            />
            <h3 id={titleId} className="mt-5 text-3xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
              {dialog.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#3e4854]">{dialog.detail}</p>
          </>
        ) : null}

        {dialog.status === "success" ? (
          <>
            <p className="text-sm font-medium text-[#2f6b28]">Payment confirmed</p>
            <h3 id={titleId} className="mt-2 text-3xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
              You are registered, {dialog.receipt.name.split(" ")[0]}.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#3e4854]">
              {dialog.receipt.courseName} is confirmed for {dialog.receipt.email}. Keep the payment reference below.
            </p>
            <dl className="mt-5 divide-y divide-[#efe8dc]">
              <ReviewRow label="Name" value={dialog.receipt.name} />
              <ReviewRow label="Email" value={dialog.receipt.email} />
              <ReviewRow label="Mobile" value={`+91 ${dialog.receipt.mobile}`} />
              <ReviewRow label="Amount paid" value={inr(dialog.receipt.amountInRupees)} />
              <ReviewRow label="Payment reference" value={dialog.receipt.paymentId} />
            </dl>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#1657A8] px-7 text-sm font-medium text-white transition hover:bg-[#124886]"
            >
              Done
            </button>
          </>
        ) : null}

        {dialog.status === "incomplete" ? (
          <>
            <p className="text-sm font-medium text-[#8a5a12]">Payment status</p>
            <h3 id={titleId} className="mt-2 text-3xl text-[#172033] [font-family:var(--font-enroll-display),Georgia,serif]">
              {dialog.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#3e4854]">{dialog.detail}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {dialog.allowRetry ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#1657A8] px-7 text-sm font-medium text-white transition hover:bg-[#124886]"
                >
                  Try again
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#1657A8] px-7 text-sm font-medium text-white transition hover:bg-[#124886]"
                >
                  Close
                </button>
              )}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#d9d0c3] px-6 text-sm text-[#172033]"
              >
                Contact IQMath
              </a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Step({ index, label, active, done }: { index: number; label: string; active: boolean; done: boolean }) {
  return (
    <li className={active ? "text-[#1657A8]" : done ? "text-[#2f6b28]" : "text-[#8d857b]"}>
      <span className="mr-2 tabular-nums">0{index}</span>
      {label}
    </li>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm text-[#6a6258]">{label}</dt>
      <dd className="text-sm text-[#172033] break-all">{value}</dd>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  autoComplete
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  const id = `${name}-field`;
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium text-[#172033]">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[#e3dbcf] bg-white px-4 text-base text-[#172033] outline-none ring-[#1657A8] placeholder:text-[#b0a898] focus:ring-2"
      />
      {error ? (
        <span id={`${id}-error`} className="mt-2 block text-sm text-[#9b2c2c]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function MobileField({
  value,
  error,
  onChange
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block" htmlFor="mobile-field">
      <span className="text-sm font-medium text-[#172033]">Mobile</span>
      <span className="mt-2 flex h-12 overflow-hidden rounded-2xl border border-[#e3dbcf] bg-white ring-[#1657A8] focus-within:ring-2">
        <span className="flex items-center border-r border-[#e3dbcf] px-3 text-sm text-[#5c6874]">+91</span>
        <input
          id="mobile-field"
          name="mobile"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "mobile-field-error" : undefined}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent px-3 text-base text-[#172033] outline-none"
        />
      </span>
      {error ? (
        <span id="mobile-field-error" className="mt-2 block text-sm text-[#9b2c2c]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  error,
  placeholder,
  options,
  onChange
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const id = `${name}-field`;
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium text-[#172033]">{label}</span>
      <select
        id={id}
        name={name}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[#e3dbcf] bg-white px-4 text-base text-[#172033] outline-none ring-[#1657A8] focus:ring-2"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span id={`${id}-error`} className="mt-2 block text-sm text-[#9b2c2c]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

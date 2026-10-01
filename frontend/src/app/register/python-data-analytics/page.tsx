import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { RegisterExperience } from "@/components/enroll/register-experience";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-enroll-display"
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-enroll-sans"
});

export const metadata: Metadata = {
  title: "Register · Python, SQL & Power BI | IQMath Technologies",
  description:
    "Register for IQMath Technologies' 2-month Python, SQL and Power BI program. Monday to Friday, 1 hour a day, 45 hours. Fee ₹8,000."
};

export default function PythonDataAnalyticsRegistrationPage() {
  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-screen bg-[#f4f0e8] text-[#1b2430] [font-family:var(--font-enroll-sans),ui-sans-serif,system-ui,sans-serif]`}
    >
      <RegisterExperience />
    </div>
  );
}

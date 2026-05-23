import type { Metadata } from "next";
import { ContactPageContent } from "@/components/sections/contact-page";

export const metadata: Metadata = {
  title: "Contact IQMath Technologies",
  description: "Reach IQMath Technologies at contact@iqmath.in or +91 9360960219. WhatsApp and email enquiries welcome."
};

export default function ContactPage() {
  return <ContactPageContent />;
}

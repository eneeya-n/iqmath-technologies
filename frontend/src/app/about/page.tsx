import type { Metadata } from "next";
import { AboutPageContent } from "@/components/sections/about-page";

export const metadata: Metadata = {
  title: "About IQMath Technologies | Web, App, EdTech & Training",
  description:
    "IQMath builds custom websites and apps, AI-powered EdTech products, and training programs across India, Malaysia, USA, and Australia."
};

export default function AboutPage() {
  return <AboutPageContent />;
}

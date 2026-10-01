import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "katex/dist/katex.min.css";
import { SiteFrame } from "@/components/layout/site-frame";

export const metadata: Metadata = {
  title: "IQMath Technologies | Web, App, EdTech & Training",
  description:
    "Enterprise website and app development, AI-powered EdTech products, and outcome-driven training programs across India, Malaysia, USA, and Australia."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="enroll-theme" strategy="beforeInteractive">
          {`if(location.pathname.indexOf("/register")===0){document.documentElement.classList.add("enroll-light")}`}
        </Script>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}

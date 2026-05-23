import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";

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
    <html lang="en">
      <body>
        <ScrollProgress />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { WHATSAPP_HREF } from "@/lib/contact";

const links = [
  { href: "/#about", label: "About IQMath" },
  { href: "/#products", label: "Products" },
  { href: "/training-programs", label: "Training" },
  { href: "/admin-dashboard", label: "Admin" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-3 md:py-4">
        <Link href="/" className="min-w-0 shrink-0 text-base font-semibold text-white md:text-lg">
          IQMath <span className="text-cyan-300">Technologies</span>
        </Link>
        <div className="order-3 flex w-full min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-white/5 pt-3 md:order-none md:min-w-0 md:w-auto md:flex-1 md:justify-end md:border-0 md:pt-0 lg:gap-x-4">
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 md:justify-end lg:gap-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-xs text-slate-200 transition hover:text-cyan-300 sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,.12)] transition hover:border-emerald-400/55 hover:bg-emerald-500/20 sm:text-sm"
          >
            <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
            Reach Out
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  WHATSAPP_HREF
} from "@/lib/contact";

type ContactCtaProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function ContactCta({
  title = "Let's start a conversation",
  description = "Reach out for website and app development, EdTech products, training programs, or partnerships.",
  className
}: ContactCtaProps) {
  return (
    <Card
      className={`relative overflow-hidden border-cyan-300/20 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-950 p-8 md:p-12 ${className ?? ""}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Get in touch</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-3.5 text-sm font-medium text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,.12)] transition hover:border-emerald-400/50 hover:bg-emerald-500/20"
          >
            <WhatsAppIcon className="h-5 w-5 text-emerald-400 transition group-hover:scale-110" />
            Reach out on WhatsApp
          </a>
          <Button asChild variant="outline" size="lg" className="h-auto px-6 py-3.5">
            <a href={CONTACT_PHONE_HREF}>
              <Phone className="mr-2 h-4 w-4" />
              {CONTACT_PHONE}
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-8 inline-flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 sm:flex-row sm:gap-4"
        >
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Mail className="h-4 w-4 text-cyan-300" />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-white transition hover:text-cyan-200"
            >
              {CONTACT_EMAIL}
            </a>
          </span>
          <span className="hidden text-slate-600 sm:inline" aria-hidden="true">
            |
          </span>
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Phone className="h-4 w-4 text-cyan-300" />
            <a href={CONTACT_PHONE_HREF} className="font-medium text-white transition hover:text-cyan-200">
              {CONTACT_PHONE}
            </a>
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,.18),transparent_70%)]"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,.12),transparent_70%)]"
      />
    </Card>
  );
}

"use client";

import { motion } from "framer-motion";
import { Globe2, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactCta } from "@/components/shared/contact-cta";
import { Card } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  WHATSAPP_HREF
} from "@/lib/contact";

const channels = [
  {
    title: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    description: "For proposals, partnerships, and general enquiries.",
    icon: Mail
  },
  {
    title: "Phone",
    value: CONTACT_PHONE,
    href: CONTACT_PHONE_HREF,
    description: "Speak directly with our team during business hours.",
    icon: Phone
  },
  {
    title: "WhatsApp",
    value: CONTACT_PHONE,
    href: WHATSAPP_HREF,
    description: "Fastest way to reach us — share briefs, links, and requirements.",
    icon: MessageCircle,
    whatsapp: true
  }
];

export function ContactPageContent() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,.08),transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Contact</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            A direct line to the IQMath team
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            IQMath is a full-service technology partner — we build websites and apps, deliver EdTech
            products, and run training programs. Tell us what you need and we will respond with clarity
            and speed.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((channel, idx) => (
            <motion.a
              key={channel.title}
              href={channel.href}
              target={channel.title === "WhatsApp" ? "_blank" : undefined}
              rel={channel.title === "WhatsApp" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="group block h-full"
            >
              <Card className="flex h-full flex-col border-cyan-300/15 bg-slate-900/60 transition hover:border-cyan-300/35 hover:bg-slate-900/80">
                <div className="flex items-center justify-between">
                  {channel.whatsapp ? (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-400">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-500/10 text-cyan-300">
                      <channel.icon className="h-5 w-5" />
                    </span>
                  )}
                </div>
                <h2 className="mt-5 text-lg font-semibold text-white">{channel.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{channel.description}</p>
                <p className="mt-4 text-base font-medium text-cyan-100 transition group-hover:text-white">
                  {channel.value}
                </p>
              </Card>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <Card className="flex items-start gap-4 border-cyan-300/15 bg-gradient-to-r from-slate-900/70 to-slate-950/50">
          <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
          <div>
            <h3 className="font-semibold text-white">Global operations</h3>
            <p className="mt-1 text-sm text-slate-300">
              India · Malaysia · USA · Australia — serving institutions, corporates, and product teams
              worldwide.
            </p>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-4">
        <ContactCta />
      </section>
    </main>
  );
}

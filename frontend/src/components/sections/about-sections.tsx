"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, Layers, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LINKEDIN_URL } from "@/lib/contact";

export const values = [
  {
    title: "Build for enterprise",
    description:
      "Secure, scalable web and mobile platforms engineered for institutions, corporates, and global teams.",
    icon: ShieldCheck
  },
  {
    title: "Learn by doing",
    description:
      "Training programs tied to real product outcomes, live projects, and measurable skill progression.",
    icon: Layers
  },
  {
    title: "Measured impact",
    description:
      "Analytics, certifications, and ROI-focused delivery across development, products, and training.",
    icon: MonitorSmartphone
  }
];

export const milestones = [
  {
    year: "2020–2021",
    items: [
      "IQMath Technologies founded with a focus on industry-aligned training across Southern India",
      "Early delivery for 500+ learners across AI, web development, and placement readiness"
    ]
  },
  {
    year: "2022",
    items: [
      "Partnered with 50+ colleges for campus training and talent development programs",
      "Launched corporate upskilling tracks for digital productivity and coding standards"
    ]
  },
  {
    year: "2023",
    items: [
      "Built the EdTech product suite: LMS, coding assessments, AI proctoring, and AI ToC generator",
      "Expanded mentor network to 50+ experts across AI, web, and data science"
    ]
  },
  {
    year: "2024",
    items: [
      "Reached 5,000+ learners trained year-on-year across India and Malaysia",
      "Delivered enterprise web platforms for certification academies, AI cohorts, and marketplaces"
    ]
  },
  {
    year: "2025",
    items: [
      "Startup India and StartupTN recognition",
      "Scaled enterprise web and app development practice across Malaysia, USA, and Australia"
    ]
  }
];

export const devCapabilities = [
  "Custom web applications (Next.js, React, Node)",
  "Mobile-ready and responsive enterprise UX",
  "LMS, assessment, and proctoring platforms",
  "AI-integrated dashboards and admin portals",
  "Multi-region deployments (IN, MY, US, AU)"
];

export const featuredBuilds = [
  { name: "NExperts Academy", region: "Malaysia" },
  { name: "NExperts AI", region: "Malaysia" },
  { name: "Book My Tickets", region: "United States" }
];

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export function AboutIntro({ compact = false }: { compact?: boolean }) {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl"
      >
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">About IQMath Technologies</p>
        <h2
          className={`mt-4 max-w-4xl font-bold leading-tight text-white ${
            compact ? "text-3xl md:text-4xl lg:text-5xl" : "text-4xl md:text-5xl lg:text-6xl"
          }`}
        >
          We build websites, apps, education platforms, and deliver enterprise training
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
          IQMath Technologies is a full-service technology partner — not just an EdTech vendor. We
          develop custom websites and mobile applications, build AI-powered learning products, and
          run training programs for students, corporates, and colleges — with scale, security, and
          measurable impact across India, Malaysia, USA, and Australia.
        </p>
      </motion.div>
    </section>
  );
}

export function AboutRecognition() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <SectionHeading eyebrow="Recognition & HQ" title="Backed by recognition. Built for global delivery." />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        {[
          "Startup India Recognized",
          "StartupTN Registered",
          "Global operations: India · Malaysia · USA · Australia"
        ].map((item) => (
          <Card key={item} className="flex items-center gap-3 border-cyan-300/20 text-slate-200">
            <Globe2 className="h-5 w-5 shrink-0 text-cyan-300" />
            {item}
          </Card>
        ))}
      </motion.div>
    </section>
  );
}

export function AboutValues() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <SectionHeading eyebrow="What we stand for" title="Principles that guide every product and engagement" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {values.map((value, idx) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
          >
            <Card className="h-full border-cyan-300/15 bg-slate-900/60">
              <value.icon className="h-8 w-8 text-cyan-300" />
              <h3 className="mt-4 text-xl font-semibold text-white">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AboutTimeline() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative border-l border-cyan-300/25 pl-8">
        {milestones.map((milestone, idx) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="relative pb-10 last:pb-0"
          >
            <span className="absolute -left-[2.55rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </span>
            <p className="text-lg font-semibold text-cyan-200">{milestone.year}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {milestone.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-cyan-400">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AboutEnterpriseDev() {
  return (
    <section className="relative isolate overflow-hidden py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-6"
      >
        <SectionHeading
          eyebrow="Enterprise web & app development"
          title="Custom websites and apps — alongside our products and training"
          description="Web and mobile development is a core part of what we do. IQMath delivers end-to-end website and application builds for clients worldwide — from SaaS dashboards and marketplaces to learning platforms, certification hubs, and AI-powered products."
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10 grid gap-8 lg:grid-cols-2"
        >
          <Card className="border-cyan-300/20 bg-gradient-to-br from-slate-900/80 to-slate-950/40">
            <h3 className="text-xl font-semibold text-white">What we build</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {devCapabilities.map((cap) => (
                <li key={cap} className="flex gap-2">
                  <span className="text-cyan-400">-</span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-cyan-300/20 bg-gradient-to-br from-slate-900/80 to-slate-950/40">
            <h3 className="text-xl font-semibold text-white">Featured client builds</h3>
            <ul className="mt-5 space-y-4">
              {featuredBuilds.map((build) => (
                <li
                  key={build.name}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200"
                >
                  <p className="font-medium text-white">{build.name}</p>
                  <p className="text-xs text-slate-400">{build.region}</p>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function AboutCareers() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <SectionHeading
        eyebrow="Careers"
        title="Join us — we're building websites, apps, EdTech products, and training at scale"
        description="If you're passionate about product engineering, AI, learning design, or client delivery, we'd love to hear from you."
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <Button asChild variant="outline">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Connect on LinkedIn
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </motion.div>
    </section>
  );
}

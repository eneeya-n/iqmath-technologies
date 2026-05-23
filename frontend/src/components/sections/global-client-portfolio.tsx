"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Region = "MY" | "US" | "IN";

type ClientProject = {
  id: string;
  name: string;
  region: Region;
  regionLabel: string;
  headline: string;
  description: string;
  highlights: [string, string, string];
  logoSrc: string;
  logoAlt?: string;
  logoClassName?: string;
};

const regionStyles: Record<
  Region,
  { pill: string; glow: string; bar: string }
> = {
  MY: {
    pill: "border-emerald-400/35 bg-emerald-500/10 text-emerald-200",
    glow: "shadow-[0_0_0_1px_rgba(16,185,129,.22),0_24px_80px_-32px_rgba(16,185,129,.45)]",
    bar: "from-emerald-400/80 via-cyan-300/40 to-transparent"
  },
  US: {
    pill: "border-indigo-400/35 bg-indigo-500/10 text-indigo-100",
    glow: "shadow-[0_0_0_1px_rgba(99,102,241,.22),0_24px_80px_-32px_rgba(99,102,241,.45)]",
    bar: "from-indigo-400/80 via-violet-300/40 to-transparent"
  },
  IN: {
    pill: "border-amber-400/35 bg-amber-500/10 text-amber-100",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,.22),0_24px_80px_-32px_rgba(251,191,36,.35)]",
    bar: "from-amber-400/80 via-rose-300/35 to-transparent"
  }
};

const projects: ClientProject[] = [
  {
    id: "nexperts-academy",
    name: "NExperts Academy",
    region: "MY",
    regionLabel: "Malaysia",
    headline: "Enterprise IT certification hub with exam-grade rigor",
    description:
      "A flagship learning experience for banking, telco, and public-sector teams: 120+ vendor-aligned certification tracks, mentor-led labs, and analytics-backed readiness — engineered for high first-attempt pass rates and cohort clarity.",
    highlights: ["Vendor-aligned pathways", "Mentor-led mock cycles", "Enterprise cohort UX"],
    logoSrc: "/assets/clients/nexperts-logo.png",
    logoAlt: "NExperts Academy logo"
  },
  {
    id: "nexperts-ai",
    name: "NExperts AI",
    region: "MY",
    regionLabel: "Malaysia",
    headline: "Live Agentic AI engineering programmes with interactive labs",
    description:
      "A premium programme hub for multi-agent systems, RAG, LangGraph orchestration, and production deployment patterns — complete with live mesh demos, structured curriculum storytelling, and conversion-ready cohort funnels.",
    highlights: ["Interactive agent console", "Curriculum as a product", "Cohort-ready checkout"],
    logoSrc: "/assets/clients/nexperts-logo.png",
    logoAlt: "NExperts AI logo"
  },
  {
    id: "nas-academy",
    name: "Nas Academy",
    region: "MY",
    regionLabel: "Malaysia",
    headline: "Global AI-forward business school experience, tuned for operators",
    description:
      "High-velocity education UX for entrepreneurs: daily live programming, community proof, and commerce-adjacent storytelling — built to scale trust, retention, and measurable outcomes across a worldwide learner base.",
    highlights: ["Live learning rhythm", "Community social proof", "Offer & tier clarity"],
    logoSrc: "/assets/clients/nas%20academy.jpeg",
    logoAlt: "Nas Academy logo"
  },
  {
    id: "book-my-tickets",
    name: "Book My Tickets",
    region: "US",
    regionLabel: "United States",
    headline: "City-scale discovery for events, deals, and creators",
    description:
      "A consumer marketplace surface for hyperlocal experiences — search, categories, featured rails, and creator profiles — engineered for fast discovery, trust signals, and friction-aware sign-in journeys.",
    highlights: ["Geo-aware discovery", "Featured content rails", "Creator economy hooks"],
    logoSrc: "/assets/clients/Book%20My%20Tickets.jpeg",
    logoAlt: "Book My Tickets logo"
  },
  {
    id: "big-basky",
    name: "Big Basky",
    region: "US",
    regionLabel: "United States",
    headline: "Tour-grade artist brand site with ticketing and tour storytelling",
    description:
      "A bold entertainment brand destination for live Tamil stand-up — tour dates, press voice, and booking flows wrapped in high-energy editorial design that converts fans into ticket buyers and mailing-list advocates.",
    highlights: ["Tour & booking UX", "Editorial brand motion", "High-trust contact funnels"],
    logoSrc: "/assets/clients/Book%20My%20Tickets.jpeg",
    logoAlt: "Big Basky — Book My Tickets family branding"
  },
  {
    id: "cloud-vaathi-lms",
    name: "Cloud Vaathi LMS",
    region: "IN",
    regionLabel: "India",
    headline: "Always-on academy for cloud and modern skills",
    description:
      "A learner-first LMS with course catalogues, progress clarity, and outcomes-oriented copy — designed for completion, community support, and credible placement narratives that mirror how professionals actually upskill.",
    highlights: ["Course catalogue UX", "Completion-focused IA", "Career proof points"],
    logoSrc: "/assets/clients/Cloud%20Vaathi.jpeg",
    logoAlt: "Cloud Vaathi logo"
  },
  {
    id: "cloud-vaathi-events",
    name: "Cloud Vaathi Events",
    region: "IN",
    regionLabel: "India",
    headline: "Live cohorts, workshops, and conference-grade event marketing",
    description:
      "A practitioner-led events platform for cloud, DevOps, and AI infrastructure — seat management, cohort timelines, and credibility metrics surfaced upfront so engineers can commit with confidence.",
    highlights: ["Cohort merchandising", "Workshop & summit IA", "Trust metrics upfront"],
    logoSrc: "/assets/clients/Cloud%20Vaathi.jpeg",
    logoAlt: "Cloud Vaathi logo"
  },
  {
    id: "pyxis-mcg",
    name: "PYXIS Management Consulting Group",
    region: "IN",
    regionLabel: "India",
    headline: "Consulting-grade digital presence for modernization programmes",
    description:
      "A credibility-forward corporate site for program management, IV&V, instructional design, and system migration practices — structured for public-sector buyers, partner ecosystems, and complex service portfolios.",
    highlights: ["Service architecture clarity", "Leadership & team depth", "Sector-specific trust"],
    logoSrc: "/assets/clients/pyxis.png",
    logoAlt: "PYXIS Management Consulting Group logo",
    logoClassName: "brightness-110 contrast-105"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};

function RegionBadge({ region, label }: { region: Region; label: string }) {
  return (
    <span
      data-region={region}
      className={cn(
        "relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-amber-300/55",
        "bg-gradient-to-r from-amber-950/95 via-yellow-900/75 to-amber-950/95 px-3 py-1",
        "text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(254,249,195,0.12)]",
        "animate-badge-glow"
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-badge-sheen bg-gradient-to-r from-transparent via-yellow-100/40 to-transparent"
      />
      <Globe2
        className="relative z-10 h-3 w-3 text-amber-200 drop-shadow-[0_0_8px_rgba(253,224,71,0.85)]"
        aria-hidden
      />
      <span
        className="relative z-10 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-200 bg-[length:200%_100%] bg-clip-text text-transparent animate-badge-text-shine"
      >
        {label}
      </span>
    </span>
  );
}

function ProjectCard({ project }: { project: ClientProject }) {
  const s = regionStyles[project.region];
  return (
    <motion.div variants={item} className="h-full min-w-0">
      <Card
        className={cn(
          "group relative flex h-full min-w-0 flex-col overflow-hidden border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-0 transition duration-500 hover:border-cyan-300/25",
          s.glow
        )}
      >
        <div className={cn("h-1 w-full bg-gradient-to-r", s.bar)} />
        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <div className="min-w-0 shrink">
              <RegionBadge region={project.region} label={project.regionLabel} />
            </div>
          </div>

          <div className="mt-4 flex min-w-0 items-center gap-3">
            <div className="relative flex h-[52px] w-[88px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 p-2 sm:h-14 sm:w-[104px]">
              <Image
                src={project.logoSrc}
                alt={project.logoAlt ?? project.name}
                width={200}
                height={80}
                className={cn(
                  "max-h-10 w-auto object-contain object-center sm:max-h-11",
                  project.logoClassName
                )}
                unoptimized
              />
            </div>
            <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug tracking-tight text-white sm:text-lg">
              {project.name}
            </h3>
          </div>

          <p className="mt-4 text-sm font-medium text-cyan-100/90">{project.headline}</p>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="max-w-full break-words rounded-md border border-white/10 bg-slate-950/40 px-2 py-1 text-[11px] font-medium leading-snug text-slate-200"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}

export function GlobalClientPortfolio() {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[min(1200px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,.14),transparent_72%)]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] translate-x-1/3 translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,.12),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Global delivery footprint
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Flagship platforms we engineered for teams across Malaysia, the United States, and India.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
            Each build pairs enterprise-grade reliability with cinematic product storytelling — from certification
            academies and AI cohorts to marketplaces, LMS ecosystems, and consulting brands that win trust at first
            glance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {[
            { k: "3", t: "Regions shipped", s: "Malaysia · United States · India" },
            { k: "8+", t: "Live programmes & products", s: "Academy, AI, commerce, LMS, events, consulting" },
            { k: "24/7", t: "Production mindset", s: "Performance, clarity, and conversion by design" }
          ].map((stat) => (
            <Card
              key={stat.k}
              className="border-cyan-300/15 bg-gradient-to-br from-slate-900/80 to-slate-950/40 p-5"
            >
              <p className="text-3xl font-semibold text-white">{stat.k}</p>
              <p className="mt-1 text-sm font-medium text-cyan-100">{stat.t}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.s}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-10 text-center text-sm text-slate-400"
        >
          Descriptions reflect each brand&apos;s positioning and the platforms IQMath engineered for
          their teams.
        </motion.p>
      </div>
    </section>
  );
}

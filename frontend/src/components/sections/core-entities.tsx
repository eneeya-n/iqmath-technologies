"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const entities = [
  {
    title: "Web & App Development",
    subtitle: "Custom websites and mobile-ready applications for enterprises and global brands.",
    image: "/assets/highlights/web-development.jpg",
    imageAlt: "Professional software development workspace with laptop and code",
    points: ["Next.js & React builds", "Mobile-responsive UX", "SaaS & dashboards", "Multi-region delivery"]
  },
  {
    title: "Products",
    subtitle: "AI-powered EdTech SaaS suite for global institutions.",
    image: "/assets/highlights/edtech-products.jpg",
    imageAlt: "Enterprise analytics dashboard and product interface",
    points: ["Ticketing sites", "LMS for institutions", "Booking platforms", "AI-powered bots", "AI solutions"]
  },
  {
    title: "Training Programs",
    subtitle: "Outcome-driven upskilling for students, corporates, and colleges.",
    image: "/assets/highlights/training-professional.jpg",
    imageAlt: "Professional corporate training and workshop session",
    points: ["Student Training", "Corporate Training", "College Programs", "India + Malaysia"]
  }
];

export function CoreEntitiesHighlight() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Three Core Verticals</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Development, products, and training — all under IQMath
        </h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          Whether you need a website or app built, an EdTech platform deployed, or a training program
          delivered — we cover all three.
        </p>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-3">
        {entities.map((entity, idx) => (
          <motion.div
            key={entity.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.1 }}
          >
            <Card className="group h-full overflow-hidden border-cyan-300/20 bg-slate-900/60 p-0 transition hover:border-cyan-300/40">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={entity.image}
                  alt={entity.imageAlt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/90">
                    {entity.title}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{entity.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{entity.subtitle}</p>
                <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-200">
                  {entity.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-cyan-400">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

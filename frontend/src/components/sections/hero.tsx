"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import anime from "animejs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThreeGlobe } from "@/components/sections/three-globe";
import { PlayfulGreeting } from "@/components/sections/playful-greeting";
import { FormulaBurst } from "@/components/sections/formula-burst";

const services = ["Web & App Development", "EdTech Products", "Training Programs"];

export function Hero() {
  const typingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typingRef.current) return;
    anime({
      targets: typingRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutExpo",
      duration: 900
    });
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="inline-block rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-1 text-xs text-cyan-200">
            Startup India Recognized | StartupTN Registered
          </p>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
              >
                {service}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            <span
              ref={typingRef}
              className="inline-block bg-gradient-to-r from-lime-300 via-green-300 to-emerald-300 bg-clip-text text-transparent"
            >
              Websites, apps, education platforms, and training — built for enterprise.
            </span>
          </h1>
          <p className="max-w-xl text-slate-300">
            IQMath Technologies is not only an EdTech company. We design and ship custom websites and
            mobile apps, build AI-powered learning products, and run outcome-driven training programs
            for India, Malaysia, USA, and Australia.
          </p>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-stretch">
            <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
              <Link href="/#products">Explore Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full shrink-0 sm:w-auto">
              <Link href="/contact">Discuss a Project</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative animate-float"
        >
          <PlayfulGreeting />
          <FormulaBurst />
          <ThreeGlobe />
        </motion.div>
      </div>
    </section>
  );
}

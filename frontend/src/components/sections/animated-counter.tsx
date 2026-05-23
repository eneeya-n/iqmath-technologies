"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CounterProps = {
  label: string;
  end: number;
  suffix?: string;
};

function Counter({ label, end, suffix = "+" }: CounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-xl"
    >
      <p className="text-3xl font-bold text-cyan-300">
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </motion.div>
  );
}

export function AnimatedStats() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
      <Counter label="Students Trained" end={5000} />
      <Counter label="Mentors Associated" end={50} />
      <Counter label="Corporate Trainings" end={10} />
      <Counter label="Colleges Associated" end={50} />
    </section>
  );
}

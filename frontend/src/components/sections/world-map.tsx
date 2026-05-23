"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const countries = [
  { name: "India", users: 2400 },
  { name: "Malaysia", users: 900 },
  { name: "USA", users: 1100 },
  { name: "Australia", users: 700 }
];

export function WorldClientMap() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-white">Global Client Network</h2>
        <p className="text-slate-300">Live usage map with glowing product activity nodes.</p>
      </div>
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(34,211,238,.15),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,.2),transparent_42%)]" />
        <div className="relative grid gap-4 md:grid-cols-2">
          {countries.map((country, idx) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-cyan-300/25 bg-slate-900/60 p-4"
            >
              <p className="text-lg font-medium text-cyan-200">{country.name}</p>
              <p className="text-slate-300">{country.users.toLocaleString()} active learners</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </section>
  );
}

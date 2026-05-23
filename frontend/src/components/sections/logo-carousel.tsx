"use client";

import { useMemo } from "react";
import Image from "next/image";

type LogoFile = {
  src: string;
  label: string;
};

export function LogoCarousel() {
  const logos: LogoFile[] = useMemo(
    () => [
      { src: "/assets/logos/iqmath-logo.jpeg", label: "IQMath" },
      { src: "/assets/logos/logo-1.jpeg", label: "Partner 1" },
      { src: "/assets/logos/logo-2.jpeg", label: "Partner 2" },
      { src: "/assets/logos/logo-3.jpeg", label: "Partner 3" },
      { src: "/assets/logos/logo-4.jpg", label: "Partner 4" }
    ],
    []
  );

  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-6 py-12">
      <h2 className="text-2xl font-semibold text-white">Trusted by Colleges and Enterprises</h2>
      <div className="mt-6 flex animate-[scroll_18s_linear_infinite] gap-8">
        {[...logos, ...logos].map((logo, idx) => (
          <div
            key={`${logo.label}-${idx}`}
            className="flex min-w-[190px] items-center justify-center rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-lg"
          >
            <Image
              src={logo.src}
              alt={logo.label}
              width={140}
              height={70}
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

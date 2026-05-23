"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const next = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, next)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-2 bg-slate-950/70 backdrop-blur">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-lime-300 to-emerald-400 shadow-[0_0_16px_rgba(74,222,128,.85)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
      <div className="pointer-events-none absolute right-3 top-2 text-[10px] font-semibold tracking-widest text-cyan-200">
        {Math.round(progress)}%
      </div>
    </div>
  );
}

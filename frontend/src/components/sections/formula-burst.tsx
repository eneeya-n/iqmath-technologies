"use client";

import { useEffect, useRef, useState } from "react";

const formulas = [
  "ŷ = wᵀx + b",
  "L = (1/n) Σ (y − ŷ)²",
  "θ = θ − α∇J(θ)",
  "P(y|x) = softmax(Wx + b)",
  "σ(z) = 1 / (1 + e⁻ᶻ)",
  "hθ(x) = g(θᵀx)"
];

export function FormulaBurst() {
  const [currentText, setCurrentText] = useState("");
  const [visible, setVisible] = useState(false);
  const timeoutRefs = useRef<number[]>([]);
  const intervalRef = useRef<number>();
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const schedule = (cb: () => void, ms: number) => {
      const id = window.setTimeout(cb, ms);
      timeoutRefs.current.push(id);
    };

    const typeFormula = (formula: string, onDone: () => void) => {
      let i = 0;
      setCurrentText("");
      setVisible(true);
      intervalRef.current = window.setInterval(() => {
        if (cancelledRef.current) return;
        i += 1;
        setCurrentText(formula.slice(0, i));
        if (i >= formula.length && intervalRef.current) {
          window.clearInterval(intervalRef.current);
          onDone();
        }
      }, 80);
    };

    const runCycle = (index: number) => {
      const formula = formulas[index];
      if (cancelledRef.current) return;

      typeFormula(formula, () => {
        // Keep the full formula visible for 10 seconds.
        schedule(() => {
          setVisible(false);
          // After fade-out, trigger chain flash and then continue.
          schedule(() => {
            window.dispatchEvent(new CustomEvent("iqmath:globe-chain-flash"));
            schedule(() => {
              if (!cancelledRef.current) runCycle((index + 1) % formulas.length);
            }, 1000);
          }, 550);
        }, 10000);
      });
    };

    const onWelcomeGone = () => {
      if (cancelledRef.current) return;
      schedule(() => runCycle(0), 1000);
    };
    window.addEventListener("iqmath:welcome-disappeared", onWelcomeGone);

    return () => {
      cancelledRef.current = true;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      timeoutRefs.current.forEach((id) => window.clearTimeout(id));
      timeoutRefs.current = [];
      window.removeEventListener("iqmath:welcome-disappeared", onWelcomeGone);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      <div className="absolute left-1/2 top-full mt-[78px] -translate-x-1/2">
        <div
          className={`flex min-h-[56px] w-[260px] items-center justify-center px-4 text-center transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p
            className="whitespace-nowrap text-[22px] font-semibold leading-none md:text-[24px]"
            style={{ color: "#00ff66", textShadow: "0 0 8px #00ff66" }}
          >
            {currentText}
            <span className="ml-1 inline-block animate-pulse">|</span>
          </p>
        </div>
      </div>
    </div>
  );
}

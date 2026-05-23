"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import Image from "next/image";

export function PlayfulGreeting() {
  const [visible, setVisible] = useState(true);
  const [typedWelcome, setTypedWelcome] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const secondCharacterRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number>();
  const typingIntervalRef = useRef<number>();

  useEffect(() => {
    if (
      !rootRef.current ||
      !portalRef.current ||
      !bubbleRef.current ||
      !characterRef.current ||
      !welcomeRef.current ||
      !secondCharacterRef.current
    ) {
      return;
    }

    setTypedWelcome("");

    const timeline = anime.timeline({
      autoplay: true,
      easing: "easeOutCubic",
      complete: () => setVisible(false)
    });

    timeline
      .add({
        targets: portalRef.current,
        opacity: [0, 1, 0.2],
        scale: [0.6, 1.15, 0.9],
        duration: 760,
        easing: "easeOutQuad"
      })
      .add(
        {
        targets: rootRef.current,
        translateY: [68, -56],
        opacity: [0, 1],
        scale: [0.35, 1],
        duration: 760,
        easing: "easeOutBack"
      },
      0
      )
      .add(
        {
          targets: bubbleRef.current,
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
          easing: "easeOutSine"
        },
        420
      )
      .add(
        {
          targets: characterRef.current,
          keyframes: [
            { translateX: -8, rotate: -5 },
            { translateX: 10, rotate: 6 },
            { translateX: -6, rotate: -4 },
            { translateX: 8, rotate: 5 },
            { translateX: 0, rotate: 0 }
          ],
          duration: 1100,
          easing: "easeInOutSine"
        },
        820
      )
      .add(
        {
          targets: welcomeRef.current,
          opacity: [0, 1],
          translateY: [14, -2],
          scale: [0.9, 1],
          duration: 520,
          easing: "easeOutSine"
        },
        2100
      )
      .add(
        {
          targets: secondCharacterRef.current,
          keyframes: [
            { translateX: -7, rotate: -4 },
            { translateX: 8, rotate: 5 },
            { translateX: -5, rotate: -3 },
            { translateX: 0, rotate: 0 }
          ],
          duration: 950,
          easing: "easeInOutSine"
        },
        2300
      )
      .add(
        {
          targets: rootRef.current,
          translateX: [0, 190],
          translateY: [-56, -215],
          scale: [1, 0.8],
          opacity: [1, 0],
          duration: 900,
          easing: "easeInQuad"
        },
        1450
      )
      .add(
        {
          targets: welcomeRef.current,
          keyframes: [
            { translateX: -5, rotate: -1.2 },
            { translateX: 4, rotate: 1 },
            { translateX: -2, rotate: -0.8 },
            { translateX: 0, rotate: 0 }
          ],
          duration: 900,
          easing: "easeInOutSine"
        },
        2500
      )
      .add(
        {
          targets: welcomeRef.current,
          opacity: [1, 0],
          translateY: [-2, -42],
          scale: [1, 0.92],
          duration: 900,
          easing: "easeInQuad"
        },
        14500
      );

    const floatWelcome = anime({
      targets: [welcomeRef.current, secondCharacterRef.current],
      translateY: [0, -5],
      direction: "alternate",
      duration: 1700,
      easing: "easeInOutSine",
      loop: true
    });

    const fullText = "Welcome to IQMath";
    typingTimeoutRef.current = window.setTimeout(() => {
      let index = 0;
      typingIntervalRef.current = window.setInterval(() => {
        index += 1;
        setTypedWelcome(fullText.slice(0, index));
        if (index >= fullText.length && typingIntervalRef.current) {
          window.clearInterval(typingIntervalRef.current);
        }
      }, 72);
    }, 2280);

    const safetyTimer = window.setTimeout(() => setVisible(false), 16000);
    const formulaStartEvent = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("iqmath:welcome-disappeared"));
    }, 15500);
    return () => {
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
      if (typingIntervalRef.current) window.clearInterval(typingIntervalRef.current);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(formulaStartEvent);
      timeline.pause();
      floatWelcome.pause();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      <div className="absolute left-1/2 top-1/2">
        <div
          ref={portalRef}
          className="absolute -left-10 top-5 h-7 w-20 rounded-full border border-cyan-200/35 bg-cyan-300/20 opacity-0 blur-[1px] shadow-[0_0_22px_rgba(34,211,238,.8)]"
        />
        <div
          ref={rootRef}
          className="absolute -left-10 -top-10 flex items-end gap-2 opacity-0"
          style={{ filter: "drop-shadow(0 10px 24px rgba(34,211,238,.35))" }}
        >
          <div
            ref={bubbleRef}
            className="mb-12 rounded-2xl border border-red-300/60 bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-300 opacity-0 backdrop-blur-md"
          >
            Hi
          </div>
          <div
            ref={characterRef}
            className="relative h-[124px] w-[124px] rounded-full border border-cyan-200/45 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,.55)]"
          >
            <Image
              src="/assets/characters/hoodie-hello.png"
              alt="Playful greeting character"
              fill
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>
        </div>
        <div
          ref={welcomeRef}
          className="absolute -left-24 top-20 w-52 overflow-hidden rounded-2xl border border-cyan-200/35 bg-slate-900/55 p-2 opacity-0 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,.4)]"
        >
          <div className="relative h-24 w-full overflow-hidden rounded-xl">
            <Image
              src="/assets/characters/welcome-iqmath.png"
              alt="Welcome visual"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-lime-300/35 bg-lime-400/10 p-2">
            <div
              ref={secondCharacterRef}
              className="relative h-8 w-8 overflow-hidden rounded-full border border-lime-300/40 bg-lime-300/15"
            >
              <Image
                src="/assets/characters/hoodie-hello.png"
                alt="Secondary greeting character"
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>
            <p className="text-xs font-extrabold tracking-wide text-lime-300">
              {typedWelcome}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

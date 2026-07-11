"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { useScrollFx, sectionColor } from "@/lib/scroll-fx";

/**
 * Color of the thread across the whole page, interpolated between the
 * measured start-fraction of each section so it always lines up with where
 * that section actually is, regardless of how long any one section is.
 */
function threadColor(p: number, fractions: number[]) {
  const [r, g, b] = sectionColor(p, fractions);
  return `${r}, ${g}, ${b}`;
}

const CHAPTERS = [
  { id: "hero", label: "01" },
  { id: "architecture", label: "02" },
  { id: "experience", label: "03" },
  { id: "projects", label: "05" },
  { id: "contact", label: "06" },
];

/**
 * A single light pulse that travels the full height of the page as you
 * scroll, tying every section's background decoration into one continuous
 * cinematic thread instead of isolated per-section effects.
 */
export default function ScrollThread() {
  const rm = !!useReducedMotion();
  const { progress, speed, sectionFractions: fractions } = useScrollFx();
  const pulseRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fractionsRef = useRef<number[]>(fractions);

  useEffect(() => {
    fractionsRef.current = fractions;
  }, [fractions]);

  useMotionValueEvent(progress, "change", (p) => {
    const rgb = threadColor(p, fractionsRef.current);
    if (pulseRef.current) {
      pulseRef.current.style.top = `${p * 100}%`;
      pulseRef.current.style.background = `rgb(${rgb})`;
      pulseRef.current.style.boxShadow = `0 0 8px 2px rgba(${rgb},0.85), 0 0 26px 8px rgba(${rgb},0.35)`;
    }
    if (trailRef.current) {
      trailRef.current.style.top = `${p * 100}%`;
      trailRef.current.style.background = `linear-gradient(to top, rgba(${rgb},0.6), rgba(${rgb},0))`;
    }
    dotRefs.current.forEach((el, i) => {
      if (!el) return;
      const frac = fractionsRef.current[i] ?? 0;
      const lit = p >= frac - 0.01;
      el.style.background = lit ? `rgba(${rgb}, 0.95)` : "rgba(255,255,255,0.14)";
      el.style.boxShadow = lit ? `0 0 10px 2px rgba(${rgb},0.6)` : "none";
      const label = labelRefs.current[i];
      if (label) label.style.color = lit ? `rgba(${rgb}, 0.95)` : "rgba(255,255,255,0.32)";
    });
  });

  const pulseScale = useTransform(speed, (s) => 1 + s * 0.9);

  return (
    <div
      className="fixed top-0 bottom-0 left-6 z-30 hidden lg:flex flex-col items-center pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="relative h-full w-px"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.14) 8%, rgba(255,255,255,0.14) 92%, transparent)" }}
      >
        <div
          ref={trailRef}
          className="absolute"
          style={{ left: -1.5, width: 3, top: 0, height: 140, transform: "translate(-1px, -100%)", filter: "blur(2px)", opacity: 0.75 }}
        />
        <motion.div
          ref={pulseRef}
          className="absolute rounded-full"
          style={{ left: "50%", top: 0, width: 7, height: 7, x: "-50%", y: "-50%", scale: rm ? 1 : pulseScale }}
        />

        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            className="absolute flex items-center gap-2.5"
            style={{ left: 0, top: `${fractions[i] * 100}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              ref={(el) => { dotRefs.current[i] = el; }}
              className="rounded-full"
              style={{ width: 6, height: 6, background: "rgba(255,255,255,0.14)", transition: "background 0.5s ease, box-shadow 0.5s ease" }}
            />
            <span
              ref={(el) => { labelRefs.current[i] = el; }}
              className="text-[10px] tracking-widest"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.32)", transition: "color 0.5s ease" }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

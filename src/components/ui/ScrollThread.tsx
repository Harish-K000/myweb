"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { useScrollFx } from "@/lib/scroll-fx";

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * Color of the thread across the whole page — the same research → build →
 * ship language used in the Experience section, extended with a "signal"
 * white at the very end where the story lands on Contact.
 */
function threadColor(p: number) {
  const idea = 1 - smoothstep(0, 0.3, p);
  const build = Math.max(0, 1 - Math.abs(p - 0.42) / 0.22);
  const ship = Math.max(0, 1 - Math.abs(p - 0.68) / 0.2);
  const signal = smoothstep(0.86, 1, p);
  const blue = [110, 160, 235];
  const amber = [205, 160, 90];
  const green = [95, 175, 130];
  const white = [235, 240, 248];
  const graphite = [170, 175, 182];
  const wSum = idea + build + ship + signal;
  const base = Math.max(0, 1 - wSum);
  let r = graphite[0] * base, g = graphite[1] * base, b = graphite[2] * base;
  r += blue[0] * idea + amber[0] * build + green[0] * ship + white[0] * signal;
  g += blue[1] * idea + amber[1] * build + green[1] * ship + white[1] * signal;
  b += blue[2] * idea + amber[2] * build + green[2] * ship + white[2] * signal;
  return `${r | 0}, ${g | 0}, ${b | 0}`;
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
  const { progress, speed } = useScrollFx();
  const pulseRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fractionsRef = useRef<number[]>(CHAPTERS.map(() => 0));
  const [fractions, setFractions] = useState<number[]>(() => CHAPTERS.map(() => 0));

  useEffect(() => {
    const measure = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      const next = CHAPTERS.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        return Math.max(0, Math.min(1, el.offsetTop / docH));
      });
      fractionsRef.current = next;
      setFractions(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    const rgb = threadColor(p);
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

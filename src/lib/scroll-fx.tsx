"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";

/** Top-level page sections every scroll-driven background reads its position from. */
export const SECTION_IDS = ["hero", "architecture", "experience", "projects", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

interface ScrollFxValue {
  /** 0 → 1 across the whole document — the shared clock every section's decoration reads from. */
  progress: MotionValue<number>;
  /** Smoothed scroll velocity in px/s (signed — positive scrolling down). */
  velocity: MotionValue<number>;
  /** Smoothed, normalized 0 → 1 scroll speed (unsigned), for driving effect intensity. */
  speed: MotionValue<number>;
  /**
   * Measured 0 → 1 document-scroll fraction at which each SECTION_IDS entry
   * begins. Re-measured on resize. This is the single source of truth for
   * "which section is the page at" — everything that used to hardcode scroll
   * breakpoints (chapter dots, thread color, background layout) should read
   * from this instead so they stay correct as section lengths change.
   */
  sectionFractions: number[];
}

const ScrollFxContext = createContext<ScrollFxValue | null>(null);

function useMeasuredSectionFractions(): number[] {
  const [fractions, setFractions] = useState<number[]>(() => SECTION_IDS.map(() => 0));

  useEffect(() => {
    const measure = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      setFractions(
        SECTION_IDS.map((id) => {
          const el = document.getElementById(id);
          if (!el) return 0;
          return Math.max(0, Math.min(1, el.offsetTop / docH));
        })
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return fractions;
}

/**
 * Wraps the homepage once and hands every section the same scroll clock, so
 * background decoration reads as one continuous cinematic system instead of
 * per-section widgets that happen to share a page.
 */
export function ScrollFxProvider({ children }: { children: React.ReactNode }) {
  const { scrollYProgress, scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const velocity = useSpring(rawVelocity, { stiffness: 110, damping: 28, mass: 0.4 });
  const speed = useTransform(velocity, (v) => Math.min(1, Math.abs(v) / 2400));
  const sectionFractions = useMeasuredSectionFractions();

  const value = useMemo(
    () => ({ progress: scrollYProgress, velocity, speed, sectionFractions }),
    [scrollYProgress, velocity, speed, sectionFractions]
  );

  return <ScrollFxContext.Provider value={value}>{children}</ScrollFxContext.Provider>;
}

export function useScrollFx() {
  const ctx = useContext(ScrollFxContext);
  if (!ctx) throw new Error("useScrollFx must be used within a ScrollFxProvider");
  return ctx;
}

/* ─────────────────────────────────────────────
   SHARED SECTION COLOR STORY
   One anchor color per SECTION_IDS entry — the research → build → ship →
   signal narrative. Every background element that wants to feel like part
   of the same "story" (thread, ambient glow, network pulses) reads off
   this instead of hand-tuning its own breakpoints.
   ───────────────────────────────────────────── */
export const SECTION_COLORS: readonly (readonly [number, number, number])[] = [
  [110, 160, 235], // hero         — idea / blue
  [110, 160, 235], // architecture — still idea/build
  [205, 160, 90],  // experience   — build / amber
  [95, 175, 130],  // projects     — ship / green
  [235, 240, 248], // contact      — signal / white
];

function smoothstep01(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, b === a ? 1 : (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * RGB color for scroll fraction `p`, interpolated between SECTION_COLORS
 * anchored at the measured start of each section (`fractions`), so it
 * always lines up with where that section actually is on the page.
 */
export function sectionColor(p: number, fractions: number[]): readonly [number, number, number] {
  if (fractions.length === 0 || fractions.every((f) => f === 0)) return SECTION_COLORS[0];
  if (p <= fractions[0]) return SECTION_COLORS[0];
  for (let i = 0; i < fractions.length - 1; i++) {
    if (p <= fractions[i + 1]) {
      const t = smoothstep01(fractions[i], fractions[i + 1], p);
      const [r0, g0, b0] = SECTION_COLORS[i];
      const [r1, g1, b1] = SECTION_COLORS[i + 1];
      return [lerp(r0, r1, t) | 0, lerp(g0, g1, t) | 0, lerp(b0, b1, t) | 0];
    }
  }
  return SECTION_COLORS[SECTION_COLORS.length - 1];
}

/** Which section fraction `p` currently falls in, as a continuous index
 *  (2.4 = 40% of the way from section 2 to section 3). Used to blend
 *  section-specific background layouts smoothly. */
export function sectionBlendIndex(p: number, fractions: number[]): number {
  if (fractions.length === 0 || fractions.every((f) => f === 0)) return 0;
  if (p <= fractions[0]) return 0;
  for (let i = 0; i < fractions.length - 1; i++) {
    if (p <= fractions[i + 1]) {
      const t = smoothstep01(fractions[i], fractions[i + 1], p);
      return i + t;
    }
  }
  return fractions.length - 1;
}

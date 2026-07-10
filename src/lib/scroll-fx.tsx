"use client";

import { createContext, useContext, useMemo } from "react";
import { useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";

interface ScrollFxValue {
  /** 0 → 1 across the whole document — the shared clock every section's decoration reads from. */
  progress: MotionValue<number>;
  /** Smoothed scroll velocity in px/s (signed — positive scrolling down). */
  velocity: MotionValue<number>;
  /** Smoothed, normalized 0 → 1 scroll speed (unsigned), for driving effect intensity. */
  speed: MotionValue<number>;
}

const ScrollFxContext = createContext<ScrollFxValue | null>(null);

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

  const value = useMemo(
    () => ({ progress: scrollYProgress, velocity, speed }),
    [scrollYProgress, velocity, speed]
  );

  return <ScrollFxContext.Provider value={value}>{children}</ScrollFxContext.Provider>;
}

export function useScrollFx() {
  const ctx = useContext(ScrollFxContext);
  if (!ctx) throw new Error("useScrollFx must be used within a ScrollFxProvider");
  return ctx;
}

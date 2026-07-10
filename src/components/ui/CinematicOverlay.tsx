"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useScrollFx } from "@/lib/scroll-fx";

/**
 * A fixed, non-interactive layer that reacts to scroll velocity — deepening
 * the vignette and adding a faint chromatic streak when the page is moving
 * fast, plus a constant film-grain texture underneath everything.
 */
export default function CinematicOverlay() {
  const rm = !!useReducedMotion();
  const { velocity, speed } = useScrollFx();

  const fastVignette = useTransform(speed, (s) => s * 0.4);
  const streakOpacity = useTransform(speed, (s) => s * 0.35);
  const streakX = useTransform(velocity, (v) => Math.max(-12, Math.min(12, v / 200)));
  const streakXNeg = useTransform(streakX, (x) => -x);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 35 }} aria-hidden="true">
      {/* Base vignette — always on, subtle */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 100%)" }}
      />

      {!rm && (
        <>
          {/* Extra vignette that deepens with scroll speed */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: fastVignette,
              background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* Faint chromatic streak — a cyan/red split that appears on fast scroll and settles when still */}
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{
              opacity: streakOpacity,
              x: streakX,
              background: "radial-gradient(ellipse 60% 90% at 26% 50%, rgba(90,160,255,0.4) 0%, rgba(90,160,255,0) 48%)",
            }}
          />
          <motion.div
            className="absolute inset-0 mix-blend-screen"
            style={{
              opacity: streakOpacity,
              x: streakXNeg,
              background: "radial-gradient(ellipse 60% 90% at 74% 50%, rgba(255,110,110,0.28) 0%, rgba(255,110,110,0) 48%)",
            }}
          />
        </>
      )}

      {/* Film grain */}
      <div
        className={`absolute inset-0 cinematic-grain${rm ? "" : " cinematic-grain-animate"}`}
        style={{ opacity: 0.045 }}
      />
    </div>
  );
}

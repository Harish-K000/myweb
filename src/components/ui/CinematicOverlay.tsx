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
  const { speed } = useScrollFx();

  const fastVignette = useTransform(speed, (s) => s * 0.4);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 35 }} aria-hidden="true">
      {/* Base vignette — always on, subtle */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 100%)" }}
      />

      {!rm && (
        /* Extra vignette that deepens with scroll speed — the chromatic
           streak that used to live here was dropped once the Living
           Blueprint background layers gave fast scroll its own motion cue. */
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: fastVignette,
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      )}

      {/* Film grain */}
      <div
        className={`absolute inset-0 cinematic-grain${rm ? "" : " cinematic-grain-animate"}`}
        style={{ opacity: 0.045 }}
      />
    </div>
  );
}

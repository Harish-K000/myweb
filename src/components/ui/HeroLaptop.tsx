"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────
   TIMELINE MATH
   Ported from a scroll-scrubbed "Helix OS" laptop
   animation — here driven by a self-looping clock
   instead of scroll position.
   ───────────────────────────────────────────── */
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function smoothstep(a: number, b: number, x: number) {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function trapezoid(p: number, a: number, b: number, c: number, d: number) {
  return Math.min(smoothstep(a, b, p), 1 - smoothstep(c, d, p));
}

const OPEN_MS = 8000;
const HOLD_OPEN_MS = 2200;
const CLOSE_MS = 3200;
const HOLD_CLOSED_MS = 1000;
const CYCLE_MS = OPEN_MS + HOLD_OPEN_MS + CLOSE_MS + HOLD_CLOSED_MS;

function cycleProgress(elapsed: number) {
  const t = elapsed % CYCLE_MS;
  if (t < OPEN_MS) return smoothstep(0, OPEN_MS, t);
  if (t < OPEN_MS + HOLD_OPEN_MS) return 1;
  if (t < OPEN_MS + HOLD_OPEN_MS + CLOSE_MS) {
    return 1 - smoothstep(0, CLOSE_MS, t - OPEN_MS - HOLD_OPEN_MS);
  }
  return 0;
}

function computeVisual(p: number) {
  const camRotX = lerp(78, 76, smoothstep(0, 0.2, p));
  let camScale = lerp(0.82, 1.0, smoothstep(0, 0.18, p));
  camScale = lerp(camScale, 1.2, smoothstep(0.42, 1.0, p));
  let camY = lerp(0, -4, smoothstep(0.3, 0.55, p));
  camY = lerp(camY, -9, smoothstep(0.6, 1.0, p));

  const worldTransform = `rotateX(${camRotX}deg) scale3d(${camScale}, ${camScale}, ${camScale}) translateY(${camY}cqw)`;

  const lidAngle = lerp(0, 100, smoothstep(0.06, 0.36, p));
  const totalTilt = ((camRotX + lidAngle) * Math.PI) / 180;
  const faceC = Math.cos(totalTilt);
  const outerOpacity = 1 / (1 + Math.exp(-22 * faceC));
  const screenOpacity = 1 - outerOpacity;
  const outerZ = faceC > 0 ? 2 : 1;
  const screenZ = faceC > 0 ? 1 : 2;

  const keyboardGlowOpacity = smoothstep(0.18, 0.34, p);
  const screenWakeOpacity = smoothstep(0.28, 0.42, p);
  const deskGlowOpacity = 0.08 + 0.1 * screenWakeOpacity;
  const contactShadowOpacity = 0.42 + 0.2 * smoothstep(0, 0.2, p);
  const propsOpacity = 0.4 * (1 - smoothstep(0.32, 0.48, p));

  const bootOpacity = trapezoid(p, 0.4, 0.44, 0.5, 0.54);
  const archOpacity = trapezoid(p, 0.5, 0.54, 0.6, 0.64);
  const codeOpacity = trapezoid(p, 0.6, 0.64, 0.7, 0.74);
  const apiOpacity = trapezoid(p, 0.7, 0.74, 0.84, 0.88);
  const dashOpacity = smoothstep(0.84, 0.9, p);

  const captions = [
    { text: "It starts with an idea.", w: trapezoid(p, -0.01, 0.0, 0.06, 0.1) },
    { text: "Helix OS.", w: bootOpacity },
    { text: "Architecture takes shape.", w: archOpacity },
    { text: "Code becomes product.", w: codeOpacity },
    { text: "Systems connect.", w: apiOpacity },
    { text: "Production ready.", w: dashOpacity },
  ];
  let caption = captions[0];
  for (const c of captions) if (c.w > caption.w) caption = c;

  return {
    worldTransform,
    lidAngle,
    outerOpacity,
    screenOpacity,
    outerZ,
    screenZ,
    keyboardGlowOpacity,
    screenWakeOpacity,
    deskGlowOpacity,
    contactShadowOpacity,
    propsOpacity,
    bootOpacity,
    archOpacity,
    codeOpacity,
    apiOpacity,
    dashOpacity,
    captionText: caption.text,
    captionOpacity: caption.w,
    captionShift: (1 - caption.w) * 6,
  };
}

/* ─────────────────────────────────────────────
   HERO LAPTOP
   Self-looping 3D CSS laptop: opens, boots
   "Helix OS", and cycles through architecture,
   code, API-flow and dashboard scenes.
   ───────────────────────────────────────────── */
export default function HeroLaptop({ scrollY }: { scrollY: MotionValue<number> }) {
  const rm = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "-10% 0px -10% 0px" });
  const [progress, setProgress] = useState(rm ? 0.92 : 0);

  useEffect(() => {
    if (rm) return;
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setProgress(cycleProgress(now - start));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rm, inView]);

  const v = computeVisual(progress);

  /* Badge parallax — each badge at a distinct scroll speed to simulate Z depth. */
  const b0y = useTransform(scrollY, [0, 500], [0, rm ? 0 : -60]);
  const b1y = useTransform(scrollY, [0, 500], [0, rm ? 0 : -90]);
  const b2y = useTransform(scrollY, [0, 500], [0, rm ? 0 : -72]);
  const b3y = useTransform(scrollY, [0, 500], [0, rm ? 0 : -50]);
  const b4y = useTransform(scrollY, [0, 500], [0, rm ? 0 : -82]);
  const b5y = useTransform(scrollY, [0, 500], [0, rm ? 0 : -66]);
  const bs0 = useSpring(b0y, { stiffness: 75, damping: 26 });
  const bs1 = useSpring(b1y, { stiffness: 62, damping: 22 });
  const bs2 = useSpring(b2y, { stiffness: 70, damping: 24 });
  const bs3 = useSpring(b3y, { stiffness: 58, damping: 20 });
  const bs4 = useSpring(b4y, { stiffness: 72, damping: 24 });
  const bs5 = useSpring(b5y, { stiffness: 64, damping: 22 });
  const badgeYs = [bs0, bs1, bs2, bs3, bs4, bs5];

  const badges = [
    { label: "React", x: "-62%", y: "12%", delay: 0.1, float: "float-slow" },
    { label: "TypeScript", x: "104%", y: "8%", delay: 0.2, float: "float-medium" },
    { label: "Python", x: "-55%", y: "64%", delay: 0.35, float: "float-fast" },
    { label: "Azure", x: "108%", y: "58%", delay: 0.15, float: "float-slow" },
    { label: "Docker", x: "-40%", y: "105%", delay: 0.25, float: "float-medium" },
    { label: "Spring Boot", x: "90%", y: "100%", delay: 0.3, float: "float-fast" },
  ] as const;

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div ref={wrapRef} className="relative w-full max-w-[560px] mx-auto select-none" style={{ aspectRatio: "4/3" }}>
      {badges.map(({ label, x, y, delay, float: floatClass }, idx) => (
        <motion.div
          key={label}
          className={`absolute ${floatClass}`}
          style={{ left: x, top: y, y: badgeYs[idx] }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay, ease }}
        >
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hover)", color: "var(--text-2)" }}
          >
            {label}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.3, ease }}
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hover)",
          containerType: "inline-size",
        }}
      >
        {/* Corner status readout */}
        <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
          <span className={v.dashOpacity > 0.5 ? "status-dot" : "status-dot-amber"} />
          <span
            className="text-[11px] tracking-wide"
            style={{ color: v.dashOpacity > 0.5 ? "var(--green)" : "var(--amber)", fontFamily: "var(--font-mono)" }}
          >
            {v.dashOpacity > 0.5 ? "ONLINE" : "BOOTING"}
          </span>
        </div>

        {/* 3D scene */}
        <div
          className="absolute inset-0"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "170cqw",
            perspectiveOrigin: "50% 42%",
          }}
        >
          <div style={{ transformStyle: "preserve-3d", transform: v.worldTransform, width: 1, height: 1 }}>
            <div style={{ position: "absolute", transformStyle: "preserve-3d" }}>
              {/* Desk surface */}
              <div
                style={{
                  position: "absolute",
                  left: "-30cqw",
                  top: "-17cqw",
                  width: "60cqw",
                  height: "34cqw",
                  borderRadius: "1.4cqw",
                  background: "linear-gradient(200deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025) 55%, rgba(255,255,255,0.015) 100%)",
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.08) inset, 0 0.4cqw 1cqw rgba(90,150,255,${v.deskGlowOpacity})`,
                }}
              />
              {/* Contact shadow */}
              <div
                style={{
                  position: "absolute",
                  left: "-15cqw",
                  top: "-8cqw",
                  width: "30cqw",
                  height: "16cqw",
                  borderRadius: "50%",
                  background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0) 72%)",
                  filter: "blur(0.7cqw)",
                  opacity: v.contactShadowOpacity,
                }}
              />

              {/* Laptop group */}
              <div style={{ position: "absolute", left: 0, top: "-1cqw", transformStyle: "preserve-3d" }}>
                {/* Base / keyboard deck */}
                <div
                  style={{
                    position: "absolute",
                    left: "-14.5cqw",
                    top: "-9cqw",
                    width: "29cqw",
                    height: "18.2cqw",
                    borderRadius: "0.9cqw",
                    transform: "translateZ(0.5cqw)",
                    background: "linear-gradient(200deg, #4c4c53, #313136 55%, #202024)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset, 0 0.3cqw 0.6cqw rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "1.6cqw",
                      transform: "translateX(-50%)",
                      width: "9cqw",
                      height: "6cqw",
                      borderRadius: "0.5cqw",
                      background: "rgba(0,0,0,0.25)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "1.4cqw",
                      right: "1.4cqw",
                      top: "1.4cqw",
                      height: "8.6cqw",
                      borderRadius: "0.5cqw",
                      background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 0.62cqw, rgba(0,0,0,0.06) 0.62cqw 0.9cqw)",
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "1.4cqw",
                      right: "1.4cqw",
                      top: "1.4cqw",
                      height: "8.6cqw",
                      borderRadius: "0.5cqw",
                      background: "radial-gradient(70% 100% at 50% 30%, rgba(120,180,255,0.55), rgba(120,180,255,0) 70%)",
                      opacity: v.keyboardGlowOpacity,
                    }}
                  />
                </div>

                {/* Lid pivot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-14.5cqw",
                    top: "-9cqw",
                    width: "29cqw",
                    height: 0,
                    transformStyle: "preserve-3d",
                    transformOrigin: "50% 0%",
                    transform: `translateZ(0.5cqw) rotateX(${v.lidAngle}deg)`,
                  }}
                >
                  {/* Outer shell */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "29cqw",
                      height: "18.6cqw",
                      borderRadius: "0.9cqw",
                      zIndex: v.outerZ,
                      opacity: v.outerOpacity,
                      background: "linear-gradient(200deg, #4d4d54, #34343a 55%, #212125)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset, 0 0.35cqw 0.9cqw rgba(0,0,0,0.5)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "0.9cqw",
                        background: "linear-gradient(115deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 40%)",
                      }}
                    />
                  </div>

                  {/* Inner screen face */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "29cqw",
                      height: "18.6cqw",
                      borderRadius: "0.7cqw",
                      overflow: "hidden",
                      zIndex: v.screenZ,
                      opacity: v.screenOpacity,
                      transform: "rotateX(180deg)",
                      background: "#06070a",
                      boxShadow: "0 0 0 0.55cqw #0a0a0a",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(80% 70% at 50% 40%, rgba(70,130,230,0.5), rgba(6,7,10,1) 75%)",
                        opacity: v.screenWakeOpacity,
                      }}
                    />

                    {/* Boot scene */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.9cqw",
                        opacity: v.bootOpacity,
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.55cqw", letterSpacing: "0.15em", color: "#dce7f7" }}>
                        HELIX&nbsp;OS<span className="hero-laptop-cursor">_</span>
                      </div>
                      <div style={{ width: "9cqw", height: "0.32cqw", borderRadius: "1cqw", background: "rgba(120,170,255,0.18)", overflow: "hidden" }}>
                        <div className="hero-laptop-bootbar" style={{ height: "100%", background: "linear-gradient(90deg,#5aa2ff,#8fc4ff)" }} />
                      </div>
                    </div>

                    {/* Architecture scene */}
                    <div style={{ position: "absolute", inset: 0, opacity: v.archOpacity }}>
                      <div style={{ position: "absolute", inset: 0, padding: "1.6cqw 2cqw 1cqw" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.9cqw", color: "#7fa8e0", letterSpacing: "0.08em", marginBottom: "1cqw" }}>
                          ARCHITECTURE
                        </div>
                        <div style={{ position: "relative", width: "100%", height: "13.5cqw" }}>
                          {[
                            { left: "1%", top: "44%", width: "22%", height: "0.14cqw" },
                            { left: "23%", top: "8%", width: "0.14cqw", height: "36%" },
                            { left: "23%", top: "56%", width: "0.14cqw", height: "36%" },
                            { left: "23%", top: "24%", width: "20%", height: "0.14cqw" },
                            { left: "23%", top: "76%", width: "20%", height: "0.14cqw" },
                            { left: "43%", top: "24%", width: "0.14cqw", height: "52%" },
                            { left: "43%", top: "24%", width: "18%", height: "0.14cqw" },
                            { left: "43%", top: "50%", width: "18%", height: "0.14cqw" },
                            { left: "43%", top: "76%", width: "18%", height: "0.14cqw" },
                            { left: "61%", top: "24%", width: "0.14cqw", height: "52%" },
                          ].map((s, i) => (
                            <div key={i} style={{ position: "absolute", ...s, background: "rgba(120,170,255,0.4)" }} />
                          ))}
                          {[
                            { left: "0%", top: "38%", width: "6.6cqw", label: "Client", bg: "rgba(255,255,255,0.06)", border: "rgba(120,170,255,0.35)", color: "#dce7f7" },
                            { left: "22%", top: "2%", width: "7cqw", label: "Gateway", bg: "rgba(90,160,255,0.16)", border: "rgba(120,170,255,0.5)", color: "#eaf2ff" },
                            { left: "22%", top: "70%", width: "7cqw", label: "Auth", bg: "rgba(255,255,255,0.06)", border: "rgba(120,170,255,0.35)", color: "#dce7f7" },
                            { left: "42%", top: "18%", width: "7.5cqw", label: "Core API", bg: "rgba(90,160,255,0.2)", border: "rgba(120,170,255,0.55)", color: "#eaf2ff" },
                            { left: "42%", top: "44%", width: "7.5cqw", label: "Queue", bg: "rgba(255,255,255,0.06)", border: "rgba(120,170,255,0.35)", color: "#dce7f7" },
                            { left: "42%", top: "70%", width: "7.5cqw", label: "Storage", bg: "rgba(255,255,255,0.06)", border: "rgba(120,170,255,0.35)", color: "#dce7f7" },
                            { left: "60%", top: "18%", width: "6.6cqw", label: "DB", bg: "rgba(90,160,255,0.16)", border: "rgba(120,170,255,0.5)", color: "#eaf2ff" },
                          ].map((n) => (
                            <div
                              key={n.label}
                              style={{
                                position: "absolute",
                                left: n.left,
                                top: n.top,
                                width: n.width,
                                padding: "0.5cqw 0",
                                borderRadius: "0.4cqw",
                                textAlign: "center",
                                background: n.bg,
                                border: `1px solid ${n.border}`,
                                color: n.color,
                                fontSize: "0.85cqw",
                              }}
                            >
                              {n.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Code scene */}
                    <div style={{ position: "absolute", inset: 0, opacity: v.codeOpacity, display: "flex" }}>
                      <div
                        style={{
                          width: "22%",
                          height: "100%",
                          background: "rgba(255,255,255,0.03)",
                          borderRight: "1px solid rgba(255,255,255,0.06)",
                          padding: "1.4cqw 0.8cqw",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.7cqw",
                        }}
                      >
                        {[
                          { width: "70%", bg: "rgba(255,255,255,0.18)", ml: 0 },
                          { width: "55%", bg: "rgba(255,255,255,0.12)", ml: "0.6cqw" },
                          { width: "60%", bg: "rgba(120,170,255,0.4)", ml: "0.6cqw" },
                          { width: "45%", bg: "rgba(255,255,255,0.12)", ml: "0.6cqw" },
                          { width: "65%", bg: "rgba(255,255,255,0.18)", ml: 0 },
                        ].map((r, i) => (
                          <div key={i} style={{ width: r.width, height: "0.5cqw", borderRadius: "0.2cqw", background: r.bg, marginLeft: r.ml }} />
                        ))}
                      </div>
                      <div style={{ flex: 1, padding: "1.6cqw 2cqw", fontFamily: "var(--font-mono)", fontSize: "0.95cqw", lineHeight: 1.9, color: "#c8d3e0" }}>
                        <div><span style={{ color: "#7fa8e0" }}>function</span> <span style={{ color: "#e0c98f" }}>deploy</span>(service) {"{"}</div>
                        <div style={{ paddingLeft: "1.4cqw" }}><span style={{ color: "#7fa8e0" }}>const</span> build = pipeline.<span style={{ color: "#e0c98f" }}>run</span>(service)</div>
                        <div style={{ paddingLeft: "1.4cqw" }}><span style={{ color: "#7fa8e0" }}>if</span> (build.ok) <span style={{ color: "#e0c98f" }}>release</span>(build)</div>
                        <div>{"}"}</div>
                      </div>
                    </div>

                    {/* API flow scene */}
                    <div style={{ position: "absolute", inset: 0, opacity: v.apiOpacity, display: "flex", alignItems: "center", justifyContent: "center", gap: "1.4cqw", padding: "0 2cqw" }}>
                      {["Client", "API", "Service", "DB"].map((label, i, arr) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "1.4cqw" }}>
                          <div
                            style={{
                              padding: "0.7cqw 1cqw",
                              borderRadius: "0.4cqw",
                              border: `1px solid ${label === "API" ? "rgba(120,170,255,0.55)" : "rgba(120,170,255,0.4)"}`,
                              color: label === "API" ? "#eaf2ff" : "#dce7f7",
                              fontSize: "0.85cqw",
                              background: label === "API" ? "rgba(90,160,255,0.18)" : "rgba(255,255,255,0.05)",
                            }}
                          >
                            {label}
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              className="hero-laptop-flow"
                              style={{
                                width: "3.4cqw",
                                height: "0.16cqw",
                                background: "repeating-linear-gradient(90deg, rgba(120,170,255,0.9) 0 6px, rgba(120,170,255,0) 6px 12px)",
                                backgroundSize: "48px 100%",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Dashboard scene */}
                    <div style={{ position: "absolute", inset: 0, opacity: v.dashOpacity, padding: "1.5cqw 2cqw", display: "flex", flexDirection: "column", gap: "1.1cqw" }}>
                      <div style={{ display: "flex", gap: "1cqw" }}>
                        {[
                          { label: "DEPLOYS/DAY", value: "128", color: "#eaf2ff" },
                          { label: "UPTIME", value: "99.98%", color: "#8fe0b0" },
                          { label: "LATENCY", value: "42ms", color: "#eaf2ff" },
                        ].map((s) => (
                          <div key={s.label} style={{ flex: 1, borderRadius: "0.5cqw", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.7cqw 0.9cqw" }}>
                            <div style={{ fontSize: "0.72cqw", color: "#7f8ba0", letterSpacing: "0.05em" }}>{s.label}</div>
                            <div style={{ fontSize: "1.3cqw", color: s.color, fontWeight: 600 }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, borderRadius: "0.5cqw", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-end", gap: "0.5cqw", padding: "0.8cqw 1cqw" }}>
                        {[35, 55, 40, 70, 50, 85].map((h, i) => (
                          <div
                            key={i}
                            className="hero-laptop-bar"
                            style={{
                              width: "8%",
                              height: `${h}%`,
                              background: h > 80 ? "rgba(120,170,255,0.7)" : "rgba(120,170,255,0.5)",
                              borderRadius: "0.15cqw 0.15cqw 0 0",
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8cqw" }}>
                        {["Build", "Test", "Deploy"].map((step) => (
                          <span key={step} style={{ display: "flex", alignItems: "center", gap: "0.8cqw" }}>
                            <span style={{ padding: "0.4cqw 0.8cqw", borderRadius: "1cqw", fontSize: "0.72cqw", color: "#dce7f7", background: "rgba(255,255,255,0.08)" }}>{step}</span>
                            <span style={{ width: "1.4cqw", height: 1, background: "rgba(255,255,255,0.2)" }} />
                          </span>
                        ))}
                        <span style={{ padding: "0.4cqw 0.9cqw", borderRadius: "1cqw", fontSize: "0.72cqw", color: "#06070a", background: "#8fe0b0", display: "flex", alignItems: "center", gap: "0.4cqw" }}>
                          <span className="hero-laptop-livedot" style={{ width: "0.5cqw", height: "0.5cqw", borderRadius: "50%", background: "#06070a" }} />
                          Live
                        </span>
                      </div>
                    </div>

                    {/* Glass reflection */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0) 35%)",
                        opacity: v.screenWakeOpacity,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Props: mug + notebook */}
              <div style={{ position: "absolute", left: "16cqw", top: "-15cqw", opacity: v.propsOpacity }}>
                <div style={{ width: "8cqw", height: "5.6cqw", borderRadius: "0.5cqw", background: "linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))", boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset" }} />
                <div style={{ position: "absolute", left: "9.5cqw", top: "0.6cqw", width: "3cqw", height: "3.4cqw", borderRadius: "0 0 1cqw 1cqw / 0 0 1.4cqw 1.4cqw", background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="absolute left-0 right-0 bottom-4 text-center z-20 pointer-events-none px-4">
          <div
            style={{
              opacity: v.captionOpacity,
              transform: `translateY(${v.captionShift}px)`,
              fontSize: "clamp(11px, 2.4cqw, 14px)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.02em",
            }}
          >
            {v.captionText}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

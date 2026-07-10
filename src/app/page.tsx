"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion, useMotionValue, useMotionValueEvent, AnimatePresence, type MotionValue } from "framer-motion";
import { ArrowRight, ExternalLink, Github, MapPin, Mail, Phone, Linkedin } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "@/data/portfolio";
import ContactForm from "@/components/ui/ContactForm";
import MagneticWrapper from "@/components/ui/MagneticWrapper";

/* ─────────────────────────────────────────────
   ANIMATION HELPERS
   ───────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;


function FadeUp({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION WRAPPER
   ───────────────────────────────────────────── */
function Section({
  id,
  children,
  className = "",
  style,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} className={`py-28 px-6 ${className}`} style={style}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="text-center mb-16">
      <FadeUp>
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
        >
          {eyebrow}
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>
        {sub && (
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
   ───────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px z-[100] origin-left"
      style={{ scaleX, background: "var(--text)" }}
    />
  );
}

/* ─────────────────────────────────────────────
   HERO WORKSTATION
   ───────────────────────────────────────────── */
function HeroWorkstation({ scrollY }: { scrollY: MotionValue<number> }) {
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const rm = !!useReducedMotion();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMx(e.clientX - window.innerWidth / 2);
      setMy(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Badge parallax — each badge at a distinct scroll speed to simulate Z depth.
     Hooks must be called unconditionally; rm zeros the output range instead. */
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
    { label: "React",       x: "-62%", y: "12%",  delay: 0.1,  float: "float-slow" },
    { label: "TypeScript",  x: "104%", y: "8%",   delay: 0.2,  float: "float-medium" },
    { label: "Python",      x: "-55%", y: "64%",  delay: 0.35, float: "float-fast" },
    { label: "Azure",       x: "108%", y: "58%",  delay: 0.15, float: "float-slow" },
    { label: "Docker",      x: "-40%", y: "105%", delay: 0.25, float: "float-medium" },
    { label: "Spring Boot", x: "90%",  y: "100%", delay: 0.3,  float: "float-fast" },
  ];

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none" style={{ aspectRatio: "4/3" }}>
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
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-hover)",
              color: "var(--text-2)",
            }}
          >
            {label}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.3, ease }}
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-hover)",
          transform: `perspective(1100px) rotateY(${-4 + mx * 0.004}deg) rotateX(${1.5 + my * -0.003}deg)`,
          transition: "transform 0.14s ease-out",
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-raised)" }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--red)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--amber)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--green)" }} />
          <span className="ml-2 text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-subtle)" }}>
            workshop.ts
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="status-dot" />
            <span className="text-xs" style={{ color: "var(--green)" }}>LIVE</span>
          </div>
        </div>

        {/* Code body */}
        <div className="p-5 text-xs leading-7" style={{ fontFamily: "var(--font-mono)" }}>
          <div style={{ color: "var(--text-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>const</span>
            <span style={{ color: "var(--text-2)" }}> system</span>
            <span> = </span>
            <span style={{ color: "var(--text-muted)" }}>await</span>
            <span style={{ color: "var(--text-2)" }}> buildStack</span>
            <span>({"{"}</span>
          </div>
          <div className="pl-5" style={{ color: "var(--text-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>frontend</span>
            <span>: </span>
            <span style={{ color: "var(--text-2)" }}>&quot;React + Next.js&quot;</span><span>,</span>
          </div>
          <div className="pl-5" style={{ color: "var(--text-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>api</span>
            <span>: </span>
            <span style={{ color: "var(--text-2)" }}>&quot;Spring Boot + Node&quot;</span><span>,</span>
          </div>
          <div className="pl-5" style={{ color: "var(--text-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>cloud</span>
            <span>: </span>
            <span style={{ color: "var(--text-2)" }}>&quot;Azure + Docker&quot;</span><span>,</span>
          </div>
          <div className="pl-5" style={{ color: "var(--text-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>uptime</span>
            <span>: </span>
            <span style={{ color: "var(--text-2)" }}>99.9</span><span>,</span>
          </div>
          <div style={{ color: "var(--text-subtle)" }}>{"});"}</div>
          <div className="mt-4" style={{ color: "var(--text-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>export default</span>
            <span style={{ color: "var(--text-2)" }}> system</span><span>;</span>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-5 py-2.5"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-raised)" }}
        >
          {[
            { label: "Frontend", cls: "status-dot" },
            { label: "API",      cls: "status-dot-amber" },
            { label: "Cloud",    cls: "status-dot" },
            { label: "CI",       cls: "status-dot" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={cls} />
              <span className="text-xs" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COUNT-UP
   ───────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   STAT ORB
   Mouse-tracking tilt + Z-depth pop-in entrance.
   ───────────────────────────────────────────── */
function StatOrb({
  value, suffix, label, delay = 0,
}: { value: number; suffix: string; label: string; delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rm = !!useReducedMotion();

  /* Normalised cursor position within the card (-0.5 → 0.5) */
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  /* Map cursor position → tilt angles */
  const rotX = useTransform(mY, [-0.5, 0.5], [10, -10]);
  const rotY = useTransform(mX, [-0.5, 0.5], [-10, 10]);
  const rotXS = useSpring(rotX, { stiffness: 240, damping: 22 });
  const rotYS = useSpring(rotY, { stiffness: 240, damping: 22 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || rm) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mX.set((e.clientX - left - width  / 2) / width);
    mY.set((e.clientY - top  - height / 2) / height);
  }

  function onMouseLeave() { mX.set(0); mY.set(0); }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="bw-card relative overflow-hidden p-6 text-center cursor-default"
      style={{
        transformStyle: "preserve-3d",
        rotateX: rm ? 0 : rotXS,
        rotateY: rm ? 0 : rotYS,
      }}
      initial={rm
        ? { opacity: 0 }
        : { opacity: 0, scale: 0.72, z: -120 }}
      whileInView={{ opacity: 1, scale: 1, z: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Sphere-surface highlight — radial glow at top-left simulates curvature */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 28% 22%, rgba(255,255,255,0.07) 0%, transparent 70%)",
        }}
      />
      <p className="relative text-4xl font-bold mb-2" style={{ color: "var(--text)" }}>
        <CountUp to={value} suffix={suffix} />
      </p>
      <p
        className="relative text-xs uppercase tracking-widest"
        style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
   Dot (tight spring) + ring (loose spring).
   Only on pointer:fine devices; respects reduced-motion.
   ───────────────────────────────────────────── */
function CustomCursor() {
  const rm = !!useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [hovered, setHovered] = useState(false);

  /* Dot follows nearly instantly */
  const dotX = useSpring(x, { stiffness: 700, damping: 42 });
  const dotY = useSpring(y, { stiffness: 700, damping: 42 });
  /* Ring trails noticeably behind */
  const ringX = useSpring(x, { stiffness: 90, damping: 20 });
  const ringY = useSpring(y, { stiffness: 90, damping: 20 });

  useEffect(() => {
    if (rm) return;
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const hide = () => { x.set(-200); y.set(-200); };
    const over = (e: MouseEvent) => {
      setHovered(!!(e.target as HTMLElement).closest("a, button, [role='button']"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y, rm]);

  if (rm) return null;

  return (
    <>
      {/* Inner dot — tight, nearly instant */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX, y: dotY,
          translateX: "-50%", translateY: "-50%",
          width: 8, height: 8,
          background: "var(--text)",
        }}
        animate={{ scale: hovered ? 1.4 : 1, opacity: hovered ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* Outer ring — loose, lags behind */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          width: 36, height: 36,
          border: "1.5px solid var(--text)",
        }}
        animate={{ scale: hovered ? 1.55 : 1, opacity: hovered ? 0.55 : 0.2 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   PINNED PROJECTS — Apple-style scroll showcase
   ───────────────────────────────────────────── */

/** Right-side visual panel: metrics or tech-stack display */
function ProjectVisual({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <div
      className="bw-card relative overflow-hidden"
      style={{ padding: "2rem", aspectRatio: "4 / 5" }}
    >
      {/* Faint background index number */}
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 font-bold leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(5rem, 10vw, 9rem)",
          color: "var(--text)",
          opacity: 0.04,
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative h-full flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="status-dot" />
          <span className="text-xs" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>LIVE</span>
        </div>

        {project.metrics.length > 0 ? (
          <div className="flex flex-col gap-5 flex-1">
            {project.metrics.slice(0, 2).map((m, mi) => (
              <div
                key={mi}
                className="pb-5"
                style={mi === 0 ? { borderBottom: "1px solid var(--border)" } : {}}
              >
                <p className="text-xs mb-2" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                  metric_{String(mi + 1).padStart(2, "0")}
                </p>
                <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--text-2)" }}>{m}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-xs mb-4" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
              {"// tech_stack"}
            </p>
            <div className="flex flex-col gap-2">
              {project.techStack.map((t) => (
                <p key={t} className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{t}</p>
              ))}
            </div>
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <p className="text-xs truncate" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
            {project.techStack.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Single dot in the bottom progress row */
function ProgressDot({
  index,
  total,
  scrollProgress,
}: {
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end   = (index + 1) * step;
  const buf   = step * 0.15;

  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, start - buf), start, Math.max(start, end - buf), Math.min(1, end)],
    [0.2, 1, 1, index === total - 1 ? 1 : 0.2]
  );
  const scale = useTransform(
    scrollProgress,
    [Math.max(0, start - buf), start, Math.max(start, end - buf), Math.min(1, end)],
    [0.8, 1.5, 1.5, index === total - 1 ? 1.5 : 0.8]
  );

  return (
    <motion.div
      className="rounded-full"
      style={{ width: 6, height: 6, background: "var(--text)", opacity, scale }}
    />
  );
}

/** One project panel — fades in/out as scroll progress crosses its window */
function ProjectSlide({
  project,
  index,
  total,
  scrollProgress,
}: {
  project: ProjectItem;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const rm   = !!useReducedMotion();
  const step = 1 / total;
  const start = index * step;
  const end   = (index + 1) * step;
  const FADE  = step * 0.22;

  const opacity = useTransform(
    scrollProgress,
    [
      index === 0 ? 0 : Math.max(0, start - FADE),
      start,
      Math.min(1 - FADE * 0.5, end - FADE),
      index === total - 1 ? 1 : Math.min(1, end),
    ],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );
  const y = useTransform(
    scrollProgress,
    [Math.max(0, start - FADE), start],
    rm ? [0, 0] : [55, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ opacity, y }}
    >
      <div className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
        {/* Left: copy */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>

          <div>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2"
              style={{ color: "var(--text)" }}
            >
              {project.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
              {project.subtitle}
            </p>
          </div>

          <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
            {project.description}
          </p>

          {project.metrics.length > 0 && (
            <div className="flex flex-col gap-2">
              {project.metrics.map((m) => (
                <div key={m} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--green)" }} />
                  <span className="text-sm" style={{ color: "var(--text-2)" }}>{m}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-md"
                style={{
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  color: "var(--text-subtle)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-5">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                <Github size={14} /> Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                <ExternalLink size={14} /> Live
              </a>
            )}
          </div>
        </div>

        {/* Right: visual panel */}
        <div className="hidden lg:block lg:col-span-2">
          <ProjectVisual project={project} index={index} />
        </div>
      </div>
    </motion.div>
  );
}

/** Outer container that drives the sticky scroll — height = N viewports */
function PinnedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const projects = PORTFOLIO_DATA.projects;
  const N = projects.length;

  return (
    <div ref={containerRef} style={{ height: `${N * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Top label bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-6 z-10">
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
            05 — Projects
          </p>
          <p className="text-xs" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
            Recent Builds
          </p>
        </div>

        {/* Stacked slides — each fades in/out over its scroll window */}
        <div className="absolute inset-0">
          {projects.map((proj, i) => (
            <ProjectSlide
              key={proj.id}
              project={proj}
              index={i}
              total={N}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Bottom progress dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2.5">
          {projects.map((_, i) => (
            <ProgressDot key={i} index={i} total={N} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HORIZON DIVIDER
   Thin line that tilts in from 45° and unfurls
   scaleX 0→1 as the section boundary enters view.
   ───────────────────────────────────────────── */
function HorizonDivider() {
  const rm = !!useReducedMotion();
  return (
    <div aria-hidden="true" style={{ perspective: "600px" }}>
      <motion.div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, var(--border-strong) 25%, var(--border-strong) 75%, transparent)",
          transformOrigin: "center center",
        }}
        initial={rm ? { opacity: 0, scaleX: 0 } : { opacity: 0, scaleX: 0, rotateX: 45 }}
        whileInView={{ opacity: 1, scaleX: 1, rotateX: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ARCHITECTURE STAGE  (Stages 02 → 04)
   Scroll-pinned hub: modules assemble from depth
   → connection lines draw → production status
   ───────────────────────────────────────────── */

const ARCH_MODULES = [
  { label: "FRONTEND",       tech: "React · TypeScript", top: "18%", left: "50%" },
  { label: "API",            tech: "Spring Boot · REST",  top: "50%", left: "18%" },
  { label: "DATA",           tech: "PostgreSQL · Redis",  top: "50%", left: "82%" },
  { label: "INFRASTRUCTURE", tech: "Docker · CI/CD",      top: "75%", left: "33%" },
  { label: "CLOUD",          tech: "AWS · Azure",         top: "75%", left: "67%" },
] as const;

const SVG_NODES: readonly [number, number][] = [
  [50, 18], [18, 50], [82, 50], [33, 75], [67, 75],
];
const SVG_LENS = [32, 32, 32, 30, 30] as const;

const STAGE_COPY = [
  { title: "The System Takes Shape",  sub: "Every production system begins with an idea." },
  { title: "Architecture in Motion",  sub: "Five layers. One purpose." },
  { title: "Independent. Connected.", sub: "Every component talks to the one that needs it." },
  { title: "Production Ready",        sub: "Engineered beyond the first deployment." },
] as const;

function ArchitectureStage() {
  const ref = useRef<HTMLDivElement>(null);
  const rm  = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [stageIdx, setStageIdx] = useState(0);
  const [status,   setStatus]   = useState("INITIALIZING");
  const [active,   setActive]   = useState<Set<number>>(new Set());

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStageIdx(v < 0.28 ? 0 : v < 0.56 ? 1 : v < 0.80 ? 2 : 3);
    setStatus(
      v >= 0.94 ? "PRODUCTION READY" :
      v >= 0.86 ? "SYSTEM ONLINE"    :
      v >= 0.76 ? "DEPLOYING"        :
      v >= 0.48 ? "BUILDING"         : "INITIALIZING"
    );
    const a = new Set<number>();
    if (v >= 0.50) a.add(0);
    if (v >= 0.55) a.add(1);
    if (v >= 0.60) a.add(2);
    if (v >= 0.65) a.add(3);
    if (v >= 0.70) a.add(4);
    setActive(a);
  });

  const coreOp  = useTransform(scrollYProgress, [0.04, 0.15], [0, 1]);
  const coreScl = useTransform(scrollYProgress, [0.04, 0.15], rm ? [1, 1] : [0.86, 1]);

  const MR = [
    [0.10, 0.22], [0.16, 0.28], [0.22, 0.34], [0.28, 0.40], [0.34, 0.46],
  ];
  const m0Op = useTransform(scrollYProgress, MR[0], [0, 1]);
  const m1Op = useTransform(scrollYProgress, MR[1], [0, 1]);
  const m2Op = useTransform(scrollYProgress, MR[2], [0, 1]);
  const m3Op = useTransform(scrollYProgress, MR[3], [0, 1]);
  const m4Op = useTransform(scrollYProgress, MR[4], [0, 1]);
  const mOps = [m0Op, m1Op, m2Op, m3Op, m4Op];

  const m0Z  = useTransform(scrollYProgress, MR[0], rm ? [0, 0] : [-80, 0]);
  const m1Z  = useTransform(scrollYProgress, MR[1], rm ? [0, 0] : [-80, 0]);
  const m2Z  = useTransform(scrollYProgress, MR[2], rm ? [0, 0] : [-80, 0]);
  const m3Z  = useTransform(scrollYProgress, MR[3], rm ? [0, 0] : [-80, 0]);
  const m4Z  = useTransform(scrollYProgress, MR[4], rm ? [0, 0] : [-80, 0]);
  const mZs  = [m0Z, m1Z, m2Z, m3Z, m4Z];

  const m0Rx = useTransform(scrollYProgress, MR[0], rm ? [0, 0] : [8, 0]);
  const m1Rx = useTransform(scrollYProgress, MR[1], rm ? [0, 0] : [8, 0]);
  const m2Rx = useTransform(scrollYProgress, MR[2], rm ? [0, 0] : [8, 0]);
  const m3Rx = useTransform(scrollYProgress, MR[3], rm ? [0, 0] : [8, 0]);
  const m4Rx = useTransform(scrollYProgress, MR[4], rm ? [0, 0] : [8, 0]);
  const mRxs = [m0Rx, m1Rx, m2Rx, m3Rx, m4Rx];

  const LR = [
    [0.28, 0.38], [0.34, 0.44], [0.40, 0.50], [0.44, 0.54], [0.48, 0.58],
  ];
  const l0 = useTransform(scrollYProgress, LR[0], rm ? [0, 0] : [SVG_LENS[0], 0]);
  const l1 = useTransform(scrollYProgress, LR[1], rm ? [0, 0] : [SVG_LENS[1], 0]);
  const l2 = useTransform(scrollYProgress, LR[2], rm ? [0, 0] : [SVG_LENS[2], 0]);
  const l3 = useTransform(scrollYProgress, LR[3], rm ? [0, 0] : [SVG_LENS[3], 0]);
  const l4 = useTransform(scrollYProgress, LR[4], rm ? [0, 0] : [SVG_LENS[4], 0]);
  const lOffs = [l0, l1, l2, l3, l4];

  const metOp = useTransform(scrollYProgress, [0.90, 0.96], [0, 1]);
  const metY  = useTransform(scrollYProgress, [0.90, 0.96], rm ? [0, 0] : [18, 0]);

  const isProd = status === "PRODUCTION READY" || status === "SYSTEM ONLINE";

  return (
    <div ref={ref} style={{ height: "500vh", background: "var(--bg)" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Top label */}
        <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}
          >
            FROM CODE TO PRODUCTION
          </p>
          <div className="flex items-center gap-2">
            <span className={isProd ? "status-dot" : "status-dot-amber"} />
            <span
              className="text-xs"
              style={{
                color: isProd ? "var(--green)" : "var(--amber)",
                fontFamily: "var(--font-mono)",
                transition: "color 0.6s ease",
              }}
            >
              {status}
            </span>
          </div>
        </div>

        {/* SVG connection layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {SVG_NODES.map(([nx, ny], i) => (
            <g key={i}>
              <line
                x1={50} y1={50} x2={nx} y2={ny}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
              />
              <motion.line
                x1={50} y1={50} x2={nx} y2={ny}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={SVG_LENS[i]}
                style={{ strokeDashoffset: lOffs[i] }}
              />
              {active.has(i) && (
                <line
                  x1={50} y1={50} x2={nx} y2={ny}
                  stroke="#3b82f6"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="1.5 34"
                  className="arch-signal"
                  style={{ animationDelay: `${i * 0.48}s` }}
                />
              )}
            </g>
          ))}
        </svg>

        {/* System Core (center workstation) */}
        <motion.div
          className="absolute"
          style={{
            top: "50%", left: "50%",
            translateX: "-50%", translateY: "-50%",
            opacity: coreOp, scale: coreScl,
          }}
        >
          <div
            className="bw-card"
            style={{ width: 188, padding: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}
          >
            <div
              className="flex items-center gap-1.5 mb-3 pb-2.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--red)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
              <span className="ml-1" style={{ color: "var(--text-subtle)", fontSize: 9 }}>system.ts</span>
              <div className="ml-auto flex items-center gap-1">
                <span
                  className={active.size > 0 ? "status-dot" : "status-dot-amber"}
                  style={{ width: 5, height: 5 }}
                />
                <span style={{ color: active.size > 0 ? "var(--green)" : "var(--amber)", fontSize: 8 }}>
                  {active.size > 0 ? "LIVE" : "BOOT"}
                </span>
              </div>
            </div>
            <p style={{ color: "var(--text-subtle)" }}>
              <span style={{ color: "var(--text-muted)" }}>const</span>{" stack = {"}
            </p>
            <p style={{ paddingLeft: "0.75rem", color: "var(--text-subtle)" }}>
              {"layers: "}<span style={{ color: "var(--text-2)" }}>{active.size}</span>{","}
            </p>
            <p style={{ paddingLeft: "0.75rem", color: "var(--text-subtle)" }}>
              {"status: "}<span style={{ color: active.size === 5 ? "var(--green)" : "var(--text-2)" }}>
                &quot;{active.size === 5 ? "online" : "loading"}&quot;
              </span>
            </p>
            <p style={{ color: "var(--text-subtle)" }}>{"}"}</p>
          </div>
        </motion.div>

        {/* Architecture modules */}
        {ARCH_MODULES.map((mod, i) => (
          <motion.div
            key={mod.label}
            className="absolute"
            style={{
              top: mod.top, left: mod.left,
              translateX: "-50%", translateY: "-50%",
              opacity: mOps[i], z: mZs[i], rotateX: mRxs[i],
            }}
          >
            <div
              className="bw-card cursor-default"
              style={{
                minWidth: 140, padding: "0.7rem 1rem",
                borderColor: active.has(i) ? "rgba(255,255,255,0.2)" : "var(--border)",
                transition: "border-color 0.5s ease",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="rounded-full shrink-0"
                  style={{
                    width: 6, height: 6, display: "inline-block",
                    background: active.has(i) ? "var(--green)" : "var(--text-subtle)",
                    transition: "background 0.5s ease",
                  }}
                />
                <span
                  className="text-xs font-semibold tracking-wider"
                  style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
                >
                  {mod.label}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                {mod.tech}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Stage narrative */}
        <div className="absolute bottom-14 left-0 right-0 text-center px-6 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                {STAGE_COPY[stageIdx].title}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {STAGE_COPY[stageIdx].sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Production metrics (fade in near end of stage) */}
        <motion.div
          className="absolute top-16 left-0 right-0 flex justify-center gap-8 md:gap-16 px-6 z-10"
          style={{ opacity: metOp, y: metY }}
        >
          {[
            { v: "99.9%", l: "UPTIME"       },
            { v: "8k+",   l: "USERS SERVED" },
            { v: "35%",   l: "API FASTER"   },
            { v: "40%",   l: "DEPLOY SPEED" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <p className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>{v}</p>
              <p className="text-xs" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */
export default function HomePage() {
  const rm = !!useReducedMotion();
  const { scrollY } = useScroll();

  /* Whole-hero fade — same as before */
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  /* ── Depth-layer parallax ──────────────────────────────────
     Each layer moves at a different scroll speed, creating a
     sense of Z-depth without WebGL. All values are zeroed when
     the user prefers reduced motion.
  ─────────────────────────────────────────────────────────── */

  /* Layer 0: Dot-grid background — barely moves */
  const bgYRaw = useTransform(scrollY, [0, 600], [0, rm ? 0 : -22]);
  const bgY    = useSpring(bgYRaw, { stiffness: 90, damping: 30 });

  /* Layer 2: Text block (name + tagline + chips) — moderate drift */
  const textYRaw = useTransform(scrollY, [0, 600], [0, rm ? 0 : -68]);
  const textY    = useSpring(textYRaw, { stiffness: 80, damping: 28 });

  /* Layer 5: CTA row — minimal drift so buttons stay readable */
  const ctaYRaw = useTransform(scrollY, [0, 600], [0, rm ? 0 : -38]);
  const ctaY    = useSpring(ctaYRaw, { stiffness: 85, damping: 29 });

  /* Layer 3+4: Card + badges — fastest, plus subtle perspective rotation */
  const cardYRaw     = useTransform(scrollY, [0, 600], [0, rm ? 0 : -108]);
  const cardY        = useSpring(cardYRaw,    { stiffness: 75, damping: 26 });
  const cardRXRaw    = useTransform(scrollY, [0, 450], [0, rm ? 0 : 7]);
  const cardRX       = useSpring(cardRXRaw,   { stiffness: 60, damping: 28 });
  const cardScaleRaw = useTransform(scrollY, [0, 500], [1, rm ? 1 : 0.94]);
  const cardScale    = useSpring(cardScaleRaw, { stiffness: 70, damping: 28 });

  return (
    <>
      <CustomCursor />
      <ScrollProgress />

      {/* ── HERO ─────────────────────────────────── */}
      <motion.section
        className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Layer 0: Dot grid — barely moves, anchors the scene */}
        <motion.div
          className="absolute inset-0 dot-grid-bg"
          style={{ opacity: 0.5, y: bgY }}
        />
        {/* Vignette — static overlay, always full-screen */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, var(--bg) 80%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Layer 2: Text group — drifts up at medium speed */}
            <motion.div style={{ y: textY }}>
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              >
                <span className="status-dot" />
                <span className="text-xs tracking-wider uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Full Stack Developer
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.15, ease }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6"
                style={{ color: "var(--text)" }}
              >
                {PORTFOLIO_DATA.profile.name}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.28, ease }}
                className="text-xl md:text-2xl mb-8 leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Engineering production systems
                <br />
                <span style={{ color: "var(--text-2)" }}>from pixel to cloud.</span>
              </motion.p>

              {/* Chips */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38, ease }}
                className="flex flex-wrap gap-2 mb-10"
              >
                {["Full Stack", "Cloud Native", "AI Integration", "CI/CD"].map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Layer 5: CTAs — minimal drift, stays readable longest */}
            <motion.div style={{ y: ctaY }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.48, ease }}
                className="flex flex-wrap items-center gap-4"
              >
                <MagneticWrapper>
                  <a
                    href="/#projects"
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                    style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
                  >
                    View Projects <ArrowRight size={14} />
                  </a>
                </MagneticWrapper>
                <MagneticWrapper>
                  <a
                    href="/#contact"
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border-hover)",
                      color: "var(--text)",
                    }}
                  >
                    Let&apos;s Talk
                  </a>
                </MagneticWrapper>
              </motion.div>
            </motion.div>
          </div>

          {/* Layer 3+4: Workstation card + floating badges
              perspective on the parent creates the 3-D tilt context */}
          <div className="hidden lg:block" style={{ perspective: "1400px" }}>
            <motion.div style={{ y: cardY, rotateX: cardRX, scale: cardScale }}>
              <HeroWorkstation scrollY={scrollY} />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
            Scroll
          </span>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, var(--text-subtle), transparent)" }} />
        </motion.div>
      </motion.section>

      <ArchitectureStage />

      <HorizonDivider />

      {/* ── 03 EXPERIENCE ────────────────────────── */}
      <Section id="experience">
        <SectionHead
          eyebrow="03 — Architecture"
          title="Experience Blueprint"
          sub="Production systems shipped. Real teams. Measurable outcomes."
        />
        {/* perspective here makes every child rotateY feel truly 3-D */}
        <div className="relative" style={{ perspective: "1200px", perspectiveOrigin: "50% 30%" }}>
          {/* Center spine — fades in/out at the ends so it never looks clipped */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--border) 6%, var(--border) 94%, transparent)",
            }}
          />

          <div className="space-y-10 md:space-y-8">
            {PORTFOLIO_DATA.experience.map((exp, i) => {
              const fromLeft = i % 2 === 0;
              /* near cards (even) sit at full size; far cards (odd) sit slightly deeper */
              const restScale = fromLeft ? 1 : 0.985;
              return (
                <div key={exp.id} className="relative md:flex md:items-start">
                  {/* Spine dot — anchored at the center line */}
                  <div
                    className="hidden md:block absolute left-1/2 top-8 w-3 h-3 rounded-full border-2 z-10 -translate-x-1/2"
                    style={{ background: "var(--bg)", borderColor: "var(--text-muted)" }}
                  />

                  {/* 3D card — hinges from the spine side on enter, gentle counter-tilt on hover */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      rotateY: rm ? 0 : (fromLeft ? -24 : 24),
                      scale: rm ? 1 : 0.94,
                    }}
                    whileInView={{ opacity: 1, rotateY: 0, scale: restScale }}
                    whileHover={rm ? {} : {
                      rotateY: fromLeft ? 3.5 : -3.5,
                      scale: restScale + 0.01,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.78, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      /* hinge from the spine-facing edge so the card "opens" outward */
                      transformOrigin: fromLeft ? "right center" : "left center",
                    }}
                    className={[
                      "w-full",
                      fromLeft
                        ? "md:w-[calc(50%-2.5rem)] md:mr-auto md:pr-10"
                        : "md:w-[calc(50%-2.5rem)] md:ml-auto md:pl-10",
                    ].join(" ")}
                  >
                    <div className="bw-card p-7 cursor-default">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{exp.role}</h3>
                          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{exp.company}</p>
                        </div>
                        <span
                          className="text-xs px-3 py-1 rounded-full shrink-0"
                          style={{
                            background: "var(--bg-raised)",
                            border: "1px solid var(--border)",
                            color: "var(--text-subtle)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {exp.description.map((point, j) => (
                          <li key={j} className="flex gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--text-subtle)" }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mt-16">
          <FadeUp>
            <p className="text-xs tracking-[0.2em] uppercase mb-8 text-center" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
              Education
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-5">
            {PORTFOLIO_DATA.education.map((edu, i) => (
              <FadeUp key={edu.id} delay={i * 0.1}>
                <div className="bw-card p-6 cursor-default">
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>Education</p>
                  <h4 className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>{edu.degree} in {edu.field}</h4>
                  <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>{edu.school} · {edu.location}</p>
                  <p className="text-xs" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>{edu.period}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <HorizonDivider />

      {/* ── 05 PROJECTS — scroll-pinned showcase ── */}
      <section id="projects">
        <PinnedProjects />
      </section>

      <HorizonDivider />

      {/* ── 06 CONTACT ───────────────────────────── */}
      <Section id="contact" style={{ background: "var(--bg-surface)" }}>
        <SectionHead
          eyebrow="06 — Contact"
          title="Let's Build Together"
          sub="Have a project in mind? I'm actively looking for full-stack engineering opportunities."
        />
        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <FadeUp>
            <div className="space-y-4">
              {[
                { Icon: Mail,     label: "Email",    value: "hkannan.dev@gmail.com", href: PORTFOLIO_DATA.profile.social.email },
                { Icon: Phone,    label: "Phone",    value: "+1 (647) 643-3063",     href: "tel:+16476433063" },
                { Icon: Github,   label: "GitHub",   value: "Harish-K000",           href: PORTFOLIO_DATA.profile.social.github },
                { Icon: Linkedin, label: "LinkedIn", value: "harish-kannan",         href: PORTFOLIO_DATA.profile.social.linkedin },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== "Phone" ? "_blank" : undefined}
                  rel={label !== "Phone" ? "noreferrer" : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer bw-card"
                  style={{ textDecoration: "none", display: "flex" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                      {label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{value}</p>
                  </div>
                </a>
              ))}

              <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "var(--bg-raised)", border: "1px solid var(--border)" }}>
                <span className="status-dot mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Available for new roles</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Open to full-time full-stack or cloud engineering positions. Graduating Dec 2025 · Based in Ontario, Canada.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="bw-card p-6">
              <p className="font-semibold text-base mb-6" style={{ color: "var(--text)" }}>Send a message</p>
              <ContactForm />
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <div className="mt-10 flex justify-center">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", color: "var(--text-subtle)" }}
            >
              <MapPin size={12} />
              Waterloo, Ontario, Canada
            </div>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}

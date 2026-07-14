"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion, useMotionValue, useMotionValueEvent, useAnimationFrame, AnimatePresence, animate, type MotionValue } from "framer-motion";
import { ArrowRight, ExternalLink, Github, MapPin, Mail, Phone, Linkedin, ChevronDown, ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "@/data/portfolio";
import ContactForm from "@/components/ui/ContactForm";
import MagneticWrapper from "@/components/ui/MagneticWrapper";
import HeroLaptop from "@/components/ui/HeroLaptop";
import ScrollThread from "@/components/ui/ScrollThread";
import CinematicOverlay from "@/components/ui/CinematicOverlay";
import LivingSystemBackground from "@/components/ui/LivingBlueprint";
import { ScrollFxProvider, useScrollFx } from "@/lib/scroll-fx";

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
   CUSTOM CURSOR
   Dot (tight spring) + ring (loose spring).
   Only on pointer:fine devices; respects reduced-motion.
   ───────────────────────────────────────────── */
function CustomCursor() {
  const rm = !!useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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

  /* Wait for mount before ever rendering null for reduced-motion — the
     server always renders the cursor (it can't know the client's motion
     preference), so bailing out on `rm` before mount would mismatch the
     hydrated output and force the whole tree into client-only rendering. */
  if (mounted && rm) return null;

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
   HERO DOT GRID
   Same parallax as before, plus a faint brighten
   on fast scroll — a first, quiet echo of the
   thread's "camera whip" language.
   ───────────────────────────────────────────── */
function HeroDotGrid({ y }: { y: MotionValue<number> }) {
  const { speed } = useScrollFx();
  const opacity = useTransform(speed, (s) => 0.5 + s * 0.3);
  return <motion.div className="absolute inset-0 dot-grid-bg" style={{ opacity, y }} />;
}

/* ─────────────────────────────────────────────
   PINNED PROJECTS — Apple-style scroll showcase
   ───────────────────────────────────────────── */

/** Projects with a bespoke recorded animation instead of the generic
 *  metrics/tech-stack panel — keyed by portfolio.ts project id. */
const PROJECT_VIDEOS: Record<string, { mp4: string; webm: string }> = {
  "agentic-browser-automation": {
    mp4: "/video/agentic-workflow.mp4",
    webm: "/video/agentic-workflow.webm",
  },
  "predictive-diabetes-analytics": {
    mp4: "/video/diabetes-workflow.mp4",
    webm: "/video/diabetes-workflow.webm",
  },
  "depth-training-website": {
    mp4: "/video/physiotherapy-workflow.mp4",
    webm: "/video/physiotherapy-workflow.webm",
  },
  "patient-queue-management": {
    mp4: "/video/patient-queue-workflow.mp4",
    webm: "/video/patient-queue-workflow.webm",
  },
  "translate-ease": {
    mp4: "/video/translate-workflow.mp4",
    webm: "/video/translate-workflow.webm",
  },
};

/** Right-side visual panel: a recorded signature clip when one exists,
 *  otherwise the metrics or tech-stack display. */
function ProjectVisual({ project, index }: { project: ProjectItem; index: number }) {
  const video = PROJECT_VIDEOS[project.id];

  if (video) {
    return (
      <div className="bw-card relative overflow-hidden h-full">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="metadata"
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>
        <div
          className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          <span className="status-dot" />
          <span className="text-xs" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>LIVE</span>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}
        >
          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)" }}>
            {project.techStack.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bw-card relative overflow-hidden h-full"
      style={{ padding: "2rem" }}
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

/** Single dot in the bottom progress row — click to jump to that project */
/** Small circular icon button for carousel transport controls
 *  (Prev / Play-Pause / Next) — matches the header's icon-button style. */
function TransportButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
    >
      {children}
    </button>
  );
}

function ProgressDot({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active}
      className="rounded-full cursor-pointer p-2 -m-2"
    >
      <motion.span
        className="block rounded-full"
        style={{ width: 6, height: 6, background: "var(--text)" }}
        animate={{ opacity: active ? 1 : 0.25, scale: active ? 1.5 : 0.8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  );
}

/** A faint, static "architecture signature" behind each project card — a
 *  different topology archetype per project so the carousel gives each
 *  build a bit of unique visual identity instead of an empty backdrop. */
function projectHash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const TOPOLOGY_ARCHETYPES = ["flowchart", "hub", "timeline", "mesh", "grid"] as const;
type TopologyArchetype = (typeof TOPOLOGY_ARCHETYPES)[number];

function ProjectTopology({ archetype, seed }: { archetype: TopologyArchetype; seed: number }) {
  let nodes: [number, number][] = [];
  let edges: [number, number][] = [];

  if (archetype === "flowchart") {
    nodes = [[10, 50], [30, 28], [30, 72], [55, 50], [80, 28], [80, 72]];
    edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]];
  } else if (archetype === "hub") {
    nodes = [[50, 50]];
    edges = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      nodes.push([50 + Math.cos(a) * 36, 50 + Math.sin(a) * 36]);
      edges.push([0, i + 1]);
    }
  } else if (archetype === "timeline") {
    nodes = [[8, 50], [26, 50], [44, 50], [62, 50], [80, 50]];
    edges = [[0, 1], [1, 2], [2, 3], [3, 4]];
  } else if (archetype === "mesh") {
    for (let i = 0; i < 9; i++) {
      nodes.push([12 + projectHash(seed + i * 3.1) * 76, 12 + projectHash(seed + i * 7.7) * 76]);
    }
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((m, j) => ({ j, d: i === j ? Infinity : Math.hypot(n[0] - m[0], n[1] - m[1]) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      dists.forEach(({ j }) => edges.push([i, j]));
    });
  } else {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) nodes.push([22 + col * 28, 22 + row * 28]);
    }
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const i = row * 3 + col;
        if (col < 2) edges.push([i, i + 1]);
        if (row < 2) edges.push([i, i + 3]);
      }
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.15"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 && archetype === "hub" ? 0.7 : 0.45} fill="rgba(255,255,255,0.06)" />
      ))}
    </svg>
  );
}

/** One project panel — the single active slide in the auto-advancing carousel */
function ProjectSlide({
  project,
  index,
  total,
  allProjects,
  onAdvance,
  onJump,
}: {
  project: ProjectItem;
  index: number;
  total: number;
  allProjects: ProjectItem[];
  onAdvance: () => void;
  onJump: (i: number) => void;
}) {
  const rm = !!useReducedMotion();
  const archetype = TOPOLOGY_ARCHETYPES[index % TOPOLOGY_ARCHETYPES.length];
  const hasVideo = !!PROJECT_VIDEOS[project.id];

  const peeks: number[] = [];
  for (let k = 1; k <= 2 && peeks.length < 2; k++) {
    const candidate = (index + k) % total;
    if (candidate !== index && !peeks.includes(candidate)) peeks.push(candidate);
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center cursor-pointer"
      initial={rm ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={rm ? { opacity: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        onAdvance();
      }}
    >
      <ProjectTopology archetype={archetype} seed={index * 41.3} />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
        {/* Left: copy */}
        <div className={hasVideo ? "lg:col-span-2 flex flex-col gap-6" : "lg:col-span-3 flex flex-col gap-6"}>
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

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={`/projects/${project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
              style={{ color: "var(--text)" }}
            >
              View case study <ArrowRight size={14} />
            </Link>
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

        {/* Right: visual panel, with the next couple of projects listed
            below it as a real, reliably-clickable stack — jump straight to
            one instead of only being able to step forward one at a time.
            (A version of this used transform-offset "peeking" cards layered
            behind the visual, but most of each card's hit area ended up
            hidden under the front one — unreliable to click. This uses
            normal document flow instead, so the whole row is always live.) */}
        <div className={hasVideo ? "hidden lg:flex lg:col-span-3 flex-col gap-3" : "hidden lg:flex lg:col-span-2 flex-col gap-3"}>
          {/* Height is capped (not aspect-ratio-derived) so the card plus
              the peek rows below it can never exceed the fixed h-screen
              carousel and get clipped on shorter viewports. */}
          <div style={{ height: hasVideo ? "clamp(280px, 44vh, 460px)" : "clamp(320px, 46vh, 460px)" }}>
            <ProjectVisual project={project} index={index} />
          </div>
          {peeks.map((peekIdx, i) => {
            const peekProject = allProjects[peekIdx];
            return (
              <button
                key={peekProject.id}
                type="button"
                onClick={(e) => { e.stopPropagation(); onJump(peekIdx); }}
                aria-label={`Jump to project ${peekIdx + 1}: ${peekProject.title}`}
                className="flex items-center gap-3 text-left cursor-pointer rounded-xl px-4 py-3 transition-colors duration-200"
                style={{
                  background: i === 0 ? "var(--bg-raised)" : "var(--bg-surface)",
                  border: `1px solid ${i === 0 ? "var(--border-hover)" : "var(--border)"}`,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = i === 0 ? "var(--border-hover)" : "var(--border)"; }}
              >
                <span className="text-[10px] tracking-widest shrink-0" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
                  {String(peekIdx + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium truncate" style={{ color: "var(--text-muted)" }}>
                  {peekProject.title}
                </span>
                <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: "var(--text-subtle)" }} />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/** Auto-advancing project carousel — one viewport tall, no scroll-jacking. */
function PinnedProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rm = !!useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.5 });
  const projects = PORTFOLIO_DATA.projects;
  const N = projects.length;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [everReachedEnd, setEverReachedEnd] = useState(false);

  const autoAdvanceActive = inView && playing && !hovered && !focused && !rm && index < N - 1;

  useEffect(() => {
    if (!autoAdvanceActive) return;
    const timer = setTimeout(() => setIndex((i) => Math.min(i + 1, N - 1)), 4200);
    return () => clearTimeout(timer);
  }, [autoAdvanceActive, index, N]);

  useEffect(() => {
    if (index === N - 1) setEverReachedEnd(true);
  }, [index, N]);

  const goTo = (i: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(N - 1, i)));
  };

  /* Clicking the slide, or the Next control, advances forward, wrapping
     back to the first project once you're past the last — so navigating
     never dead-ends. */
  const advance = () => {
    setPlaying(false);
    setIndex((i) => (i + 1) % N);
  };

  const retreat = () => {
    setPlaying(false);
    setIndex((i) => (i - 1 + N) % N);
  };

  /* Resuming from the last slide has nowhere to auto-advance to, so the
     Play control would otherwise flip to "Pause" while nothing actually
     plays — restart from the first slide instead. */
  const togglePlaying = () => {
    const nextPlaying = !playing;
    if (nextPlaying && index === N - 1) setIndex(0);
    setPlaying(nextPlaying);
  };

  const sequenceDone = rm ? inView : everReachedEnd;

  /* Swipe support — manual touch tracking (rather than framer-motion's
     drag) so it doesn't fight the slide's own enter/exit transform.
     Ignores mostly-vertical gestures so page scroll still works. */
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) advance(); else retreat();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); advance(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); retreat(); }
  };

  return (
    <div
      id="projects"
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Recent projects"
    >
      {/* Top label bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-6 z-10">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
          05 — Projects
        </p>
        <p className="text-xs" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
          Recent Builds
        </p>
      </div>

      {/* Active slide — click anywhere on it (except a link or the peeking
          stack cards) to advance; Prev/Next/swipe/arrow-keys below cover
          keyboard and touch users. Crossfade (not mode="wait") so a direct
          jump feels instant instead of waiting through a full exit before
          the new project appears. */}
      <div
        className="absolute inset-0"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence>
          <ProjectSlide
            key={projects[index].id}
            project={projects[index]}
            index={index}
            total={N}
            allProjects={projects}
            onAdvance={advance}
            onJump={goTo}
          />
        </AnimatePresence>
      </div>

      {/* Bottom transport row — Prev / Play-Pause / progress dots / Next.
          Kept on one row so it costs no extra vertical space on short
          mobile viewports. */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center items-center gap-3 z-10 px-6">
        <TransportButton onClick={retreat} label="Previous project">
          <ChevronLeft size={16} />
        </TransportButton>
        {!rm && (
          <TransportButton onClick={togglePlaying} label={playing ? "Pause autoplay" : "Play autoplay"}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </TransportButton>
        )}
        <div className="flex items-center gap-2.5">
          {projects.map((proj, i) => (
            <ProgressDot key={proj.id} active={i === index} onClick={() => goTo(i)} label={`Go to project ${i + 1}: ${proj.title}`} />
          ))}
        </div>
        <TransportButton onClick={advance} label="Next project">
          <ChevronRight size={16} />
        </TransportButton>
      </div>

      {/* Scroll cue — appears once the carousel has settled on the last project */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={sequenceDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
          Scroll to continue
        </span>
        <motion.div
          animate={rm || !sequenceDone ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} style={{ color: "var(--text-subtle)" }} />
        </motion.div>
      </motion.div>
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
  { label: "FRONTEND",       tech: "React · TypeScript", top: "max(18%, 190px)", left: "50%" },
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
  const inView = useInView(ref, { once: true, amount: 0.5 });

  /* Auto-play clock: 0 → 1 over a fixed duration once the section is in
     view, replacing the old scroll-jacked 500vh drive. Everything below
     still reads off this single progress value, unchanged. */
  const progress = useMotionValue(0);
  const [sequenceDone, setSequenceDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (rm) {
      progress.set(1);
      setSequenceDone(true);
      return;
    }
    const controls = animate(progress, 1, {
      duration: 6.5,
      ease: "linear",
      onComplete: () => setSequenceDone(true),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, rm]);

  const [stageIdx, setStageIdx] = useState(0);
  const [status,   setStatus]   = useState("INITIALIZING");
  const [active,   setActive]   = useState<Set<number>>(new Set());

  useMotionValueEvent(progress, "change", (v) => {
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

  const coreOp  = useTransform(progress, [0.04, 0.15], [0, 1]);
  const coreScl = useTransform(progress, [0.04, 0.15], rm ? [1, 1] : [0.86, 1]);

  const MR = [
    [0.10, 0.22], [0.16, 0.28], [0.22, 0.34], [0.28, 0.40], [0.34, 0.46],
  ];
  const m0Op = useTransform(progress, MR[0], [0, 1]);
  const m1Op = useTransform(progress, MR[1], [0, 1]);
  const m2Op = useTransform(progress, MR[2], [0, 1]);
  const m3Op = useTransform(progress, MR[3], [0, 1]);
  const m4Op = useTransform(progress, MR[4], [0, 1]);
  const mOps = [m0Op, m1Op, m2Op, m3Op, m4Op];

  const m0Z  = useTransform(progress, MR[0], rm ? [0, 0] : [-80, 0]);
  const m1Z  = useTransform(progress, MR[1], rm ? [0, 0] : [-80, 0]);
  const m2Z  = useTransform(progress, MR[2], rm ? [0, 0] : [-80, 0]);
  const m3Z  = useTransform(progress, MR[3], rm ? [0, 0] : [-80, 0]);
  const m4Z  = useTransform(progress, MR[4], rm ? [0, 0] : [-80, 0]);
  const mZs  = [m0Z, m1Z, m2Z, m3Z, m4Z];

  const m0Rx = useTransform(progress, MR[0], rm ? [0, 0] : [8, 0]);
  const m1Rx = useTransform(progress, MR[1], rm ? [0, 0] : [8, 0]);
  const m2Rx = useTransform(progress, MR[2], rm ? [0, 0] : [8, 0]);
  const m3Rx = useTransform(progress, MR[3], rm ? [0, 0] : [8, 0]);
  const m4Rx = useTransform(progress, MR[4], rm ? [0, 0] : [8, 0]);
  const mRxs = [m0Rx, m1Rx, m2Rx, m3Rx, m4Rx];

  const LR = [
    [0.28, 0.38], [0.34, 0.44], [0.40, 0.50], [0.44, 0.54], [0.48, 0.58],
  ];
  const l0 = useTransform(progress, LR[0], rm ? [0, 0] : [SVG_LENS[0], 0]);
  const l1 = useTransform(progress, LR[1], rm ? [0, 0] : [SVG_LENS[1], 0]);
  const l2 = useTransform(progress, LR[2], rm ? [0, 0] : [SVG_LENS[2], 0]);
  const l3 = useTransform(progress, LR[3], rm ? [0, 0] : [SVG_LENS[3], 0]);
  const l4 = useTransform(progress, LR[4], rm ? [0, 0] : [SVG_LENS[4], 0]);
  const lOffs = [l0, l1, l2, l3, l4];

  const metOp = useTransform(progress, [0.90, 0.96], [0, 1]);
  const metY  = useTransform(progress, [0.90, 0.96], rm ? [0, 0] : [18, 0]);

  const isProd = status === "PRODUCTION READY" || status === "SYSTEM ONLINE";

  return (
    <div id="architecture" ref={ref} className="relative">
      <div
        className="relative h-screen overflow-hidden"
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
                stroke="rgba(255,255,255,0.1)"
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
        <div className="absolute bottom-24 left-0 right-0 text-center px-6 z-10">
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

        {/* Scroll cue — appears once the auto-play sequence finishes,
            telling the visitor how to move on instead of forcing more scroll. */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={sequenceDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
          aria-hidden="true"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>
            Scroll to continue
          </span>
          <motion.div
            animate={rm || !sequenceDone ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} style={{ color: "var(--text-subtle)" }} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE BLUEPRINT
   Scroll-tracked timeline: a pulse of light travels
   down the center spine while a canvas lattice in the
   background morphs from a loose idea-graph into a
   structured grid — research → build → production.
   ───────────────────────────────────────────── */
function smoothstep01(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function phaseColor(p: number) {
  const research = 1 - smoothstep01(0, 0.42, p);
  const transform = Math.max(0, 1 - Math.abs(p - 0.52) / 0.28);
  const production = smoothstep01(0.58, 1, p);
  const blue = [110, 160, 235];
  const amber = [205, 160, 90];
  const green = [95, 175, 130];
  const graphite = [190, 195, 202];
  const wSum = research + transform + production;
  const base = 1 - Math.min(1, wSum);
  let r = graphite[0] * base, g = graphite[1] * base, b = graphite[2] * base;
  r += blue[0] * research + amber[0] * transform + green[0] * production;
  g += blue[1] * research + amber[1] * transform + green[1] * production;
  b += blue[2] * research + amber[2] * transform + green[2] * production;
  return { r, g, b, research, transform, production };
}

interface LatticeNode { rx: number; ry: number; px: number; py: number; i: number }

function buildLatticeNodes(): LatticeNode[] {
  const hash = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const list: LatticeNode[] = [];
  let i = 0;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const px = 0.16 + col * 0.227;
      const py = 0.14 + row * 0.235;
      const rx = Math.max(0.04, Math.min(0.96, 0.5 + (hash(i * 2.13 + 1) - 0.5)));
      const ry = Math.max(0.05, Math.min(0.95, 0.5 + (hash(i * 3.71 + 2) - 0.5)));
      list.push({ rx, ry, px, py, i });
      i++;
    }
  }
  return list;
}

function buildLatticeEdges(): [number, number][] {
  const idx = (r: number, c: number) => r * 4 + c;
  const e: [number, number][] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (col < 3) e.push([idx(row, col), idx(row, col + 1)]);
      if (row < 3) e.push([idx(row, col), idx(row + 1, col)]);
    }
  }
  return e;
}

const LATTICE_NODES = buildLatticeNodes();
const LATTICE_EDGES = buildLatticeEdges();

/** Background canvas: construction lines + idea-graph/lattice + floating light points. */
function ExperienceCanvas({
  progressRef,
  velocityRef,
  rm,
}: {
  progressRef: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  rm: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);

  const draw = () => {
    const canvas = canvasRef.current;
    const { w, h } = sizeRef.current;
    if (!canvas || !w) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const p = progressRef.current;
    const t = timeRef.current;
    const col = phaseColor(p);
    const rgb = `${col.r | 0},${col.g | 0},${col.b | 0}`;
    const lattice = smoothstep01(0.18, 0.92, p);
    const drift = rm ? 0 : Math.sin(t * 0.12) * 6;

    // Layer 1: deep architectural construction lines
    ctx.save();
    ctx.translate(0, drift * 0.3);
    const skew = (1 - lattice) * 3.2;
    [0.14, 0.38, 0.63, 0.86].forEach((fx, i) => {
      const x = fx * w;
      const angle = (i % 2 === 0 ? 1 : -1) * skew * (Math.PI / 180);
      ctx.save();
      ctx.translate(x, h / 2);
      ctx.rotate(angle);
      ctx.strokeStyle = `rgba(230,232,236,${0.035 + lattice * 0.03})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -h / 2 - 80);
      ctx.lineTo(0, h / 2 + 80);
      ctx.stroke();
      ctx.restore();
    });
    [0.32, 0.7].forEach((fy) => {
      ctx.strokeStyle = `rgba(230,232,236,${col.production * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(0, fy * h);
      ctx.lineTo(w, fy * h);
      ctx.stroke();
    });
    ctx.restore();

    // Layer 2: idea graph -> engineering lattice
    ctx.save();
    ctx.translate(0, drift * 0.6);
    const pos = LATTICE_NODES.map((n) => ({
      x: (n.rx + (n.px - n.rx) * lattice) * w,
      y: (n.ry + (n.py - n.ry) * lattice) * h,
      n,
    }));
    const curveAmt = 1 - lattice;
    LATTICE_EDGES.forEach(([a, b], ei) => {
      const A = pos[a], B = pos[b];
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      const dx = B.x - A.x, dy = B.y - A.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const sign = ei % 2 === 0 ? 1 : -1;
      const off = sign * curveAmt * 46;
      ctx.strokeStyle = `rgba(220,224,230,${0.05 + lattice * 0.05})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(mx + nx * off, my + ny * off, B.x, B.y);
      ctx.stroke();
    });
    pos.forEach(({ x, y, n }) => {
      const accent = n.i % 3 === 0;
      const r = 1.6 + lattice * 1.2;
      ctx.beginPath();
      ctx.fillStyle = `rgba(225,228,233,${0.35 + lattice * 0.25})`;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (accent) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 22);
        grad.addColorStop(0, `rgba(${rgb},0.5)`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();

    // Layer 3: restrained floating points of light — stretch into streaks
    // behind the scroll direction when the page is moving fast, so the same
    // "camera whip" language from the global thread shows up here too.
    if (!rm) {
      const v = velocityRef.current;
      const streak = Math.min(1, Math.abs(v) / 2200);
      const dir = v >= 0 ? 1 : -1;
      ctx.save();
      for (let i = 0; i < 7; i++) {
        const seed = i * 91.7;
        const fx = Math.sin(seed) * 0.5 + 0.5;
        const fy = Math.cos(seed * 1.3) * 0.5 + 0.5;
        const bx = fx * w + Math.sin(t * 0.15 + i) * 14;
        const by = fy * h + Math.cos(t * 0.12 + i * 1.7) * 14 + drift;
        const pulse = 0.35 + 0.25 * Math.sin(t * 0.4 + i * 2.1);
        if (streak > 0.04) {
          ctx.strokeStyle = `rgba(${rgb},${0.4 * streak * pulse})`;
          ctx.lineWidth = 1.4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(bx, by - dir * streak * 50);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, 16);
        grad.addColorStop(0, `rgba(${rgb},${0.28 * pulse})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(235,238,242,${0.5 * pulse})`;
        ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAnimationFrame((t) => {
    timeRef.current = t / 1000;
    draw();
  });

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

function ExperienceBlueprint() {
  const rm = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotFractionsRef = useRef<number[]>([]);
  const progressRef = useRef(0);
  const velocityRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { velocity } = useScrollFx();
  useMotionValueEvent(velocity, "change", (v) => { velocityRef.current = v; });

  const measureDots = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const trackH = track.offsetHeight || 1;
    dotFractionsRef.current = dotRefs.current.map((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const offset = r.top + r.height / 2 - trackRect.top;
      return Math.max(0, Math.min(1, offset / trackH));
    });
  };

  const applyDom = (p: number) => {
    progressRef.current = p;
    const col = phaseColor(p);
    const rgb = `${col.r | 0}, ${col.g | 0}, ${col.b | 0}`;

    const track = trackRef.current;
    if (track) {
      const y = p * track.offsetHeight;
      if (pulseRef.current) {
        pulseRef.current.style.top = `${y}px`;
        pulseRef.current.style.background = `rgb(${rgb})`;
        pulseRef.current.style.boxShadow = `0 0 8px 2px rgba(${rgb},0.9), 0 0 30px 10px rgba(${rgb},0.35)`;
      }
      if (trailRef.current) {
        trailRef.current.style.top = `${y}px`;
        trailRef.current.style.background = `linear-gradient(to top, rgba(${rgb},0.55), rgba(${rgb},0))`;
      }
    }

    dotRefs.current.forEach((el, i) => {
      if (!el) return;
      const frac = dotFractionsRef.current[i] ?? 0;
      if (p >= frac - 0.015) {
        el.style.background = `rgba(${rgb}, 0.9)`;
        el.style.borderColor = `rgba(${rgb}, 0.9)`;
        el.style.boxShadow = `0 0 0 3px rgba(${rgb},0.12), 0 0 18px 2px rgba(${rgb},0.5)`;
      } else {
        el.style.background = "rgba(0,0,0,0.4)";
        el.style.borderColor = "rgba(255,255,255,0.25)";
        el.style.boxShadow = "none";
      }
    });

    const weights = [col.research, col.transform, col.production];
    glowRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = String(0.08 + weights[i] * 0.14);
    });
  };

  useEffect(() => {
    measureDots();
    applyDom(scrollYProgress.get());
    window.addEventListener("resize", measureDots);
    return () => window.removeEventListener("resize", measureDots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, "change", applyDom);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-28 px-6"
      style={{ overflow: "hidden" }}
    >
      {/* Sticky background: drifting glows + lattice canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            ref={(el) => { glowRefs.current[0] = el; }}
            className="experience-glow"
            style={{ top: "8%", left: "12%", width: 620, height: 620, filter: "blur(90px)", background: "radial-gradient(circle, rgba(110,160,235,0.9) 0%, rgba(110,160,235,0) 70%)", animation: rm ? "none" : "driftA 22s ease-in-out infinite" }}
          />
          <div
            ref={(el) => { glowRefs.current[1] = el; }}
            className="experience-glow"
            style={{ top: "42%", right: "10%", width: 560, height: 560, filter: "blur(100px)", background: "radial-gradient(circle, rgba(205,160,90,0.9) 0%, rgba(205,160,90,0) 70%)", animation: rm ? "none" : "driftB 26s ease-in-out infinite" }}
          />
          <div
            ref={(el) => { glowRefs.current[2] = el; }}
            className="experience-glow"
            style={{ bottom: "6%", left: "30%", width: 640, height: 640, filter: "blur(100px)", background: "radial-gradient(circle, rgba(95,175,130,0.9) 0%, rgba(95,175,130,0) 70%)", animation: rm ? "none" : "driftC 24s ease-in-out infinite" }}
          />

          <ExperienceCanvas progressRef={progressRef} velocityRef={velocityRef} rm={rm} />

          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 78%, var(--bg) 100%)" }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHead
          eyebrow="03 — Architecture"
          title="Experience Blueprint"
          sub="Production systems shipped. Real teams. Measurable outcomes."
        />

        <div className="relative">
          {/* Center spine — the pulse travels down this as you scroll */}
          <div
            ref={trackRef}
            className="absolute left-1/2 top-0 bottom-0 hidden md:block"
            style={{ width: 1, background: "rgba(255,255,255,0.14)", transform: "translateX(-0.5px)" }}
          >
            <div
              ref={trailRef}
              className="absolute"
              style={{ left: -1, width: 3, top: 0, height: 260, transform: "translate(-1px, -100%)", filter: "blur(2px)", opacity: 0.8 }}
            />
            <div
              ref={pulseRef}
              className="absolute rounded-full"
              style={{ left: "50%", top: 0, width: 8, height: 8, transform: "translate(-50%, -50%)" }}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {PORTFOLIO_DATA.experience.map((exp, i) => {
              const fromLeft = i % 2 === 0;
              const year = exp.period.match(/\d{4}/)?.[0] ?? "";
              return (
                <div key={exp.id} className="flex" style={{ justifyContent: fromLeft ? "flex-start" : "flex-end" }}>
                  <div className="w-full md:w-[46%] relative">
                    <div
                      ref={(el) => { dotRefs.current[i] = el; }}
                      className="hidden md:block absolute rounded-full"
                      style={
                        fromLeft
                          ? { right: -66, top: 46, width: 22, height: 22, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)", transition: "box-shadow 0.6s ease, border-color 0.6s ease, background 0.6s ease" }
                          : { left: -66, top: 46, width: 22, height: 22, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)", transition: "box-shadow 0.6s ease, border-color 0.6s ease, background 0.6s ease" }
                      }
                    />
                    {/* Year marker — sits directly above the spine dot, in its
                        same 22px column, so it can't collide with the card
                        on the opposite side at narrower breakpoints. */}
                    {year && (
                      <div
                        className="hidden md:block text-center"
                        style={{
                          position: "absolute",
                          ...(fromLeft ? { right: -66 } : { left: -66 }),
                          top: 14,
                          width: 22,
                        }}
                      >
                        <span
                          className="text-[9px] tracking-tighter"
                          style={{ color: "var(--text-subtle)", fontFamily: "var(--font-mono)", opacity: 0.65 }}
                        >
                          {year}
                        </span>
                      </div>
                    )}
                    <FadeUp delay={i * 0.05}>
                      <div className="bw-card p-7 md:p-11 cursor-default">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                          <h3 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>{exp.role}</h3>
                          <span
                            className="text-xs px-3.5 py-1.5 rounded-full shrink-0"
                            style={{ border: "1px solid var(--border-hover)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                          >
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-base mb-6" style={{ color: "var(--text-subtle)" }}>{exp.company}</p>
                        <ul className="space-y-3">
                          {exp.description.map((point, j) => (
                            <li key={j} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--text-subtle)" }} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeUp>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mt-20 md:mt-28">
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
      </div>
    </section>
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
    <ScrollFxProvider>
      <LivingSystemBackground />
      <CustomCursor />
      <ScrollProgress />
      <ScrollThread />
      <CinematicOverlay />

      {/* ── HERO ─────────────────────────────────── */}
      <motion.section
        id="hero"
        className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Layer 0: Dot grid — barely moves, anchors the scene */}
        <HeroDotGrid y={bgY} />
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
              <HeroLaptop scrollY={scrollY} />
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
      <ExperienceBlueprint />

      <HorizonDivider />

      {/* ── 05 PROJECTS — auto-advancing carousel ── */}
      <PinnedProjects />

      <HorizonDivider />

      {/* ── 06 CONTACT ───────────────────────────── */}
      <Section id="contact">
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
    </ScrollFxProvider>
  );
}

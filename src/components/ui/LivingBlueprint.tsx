"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useScrollFx, sectionColor, sectionBlendIndex } from "@/lib/scroll-fx";

/* ─────────────────────────────────────────────
   LIVING SYSTEM BLUEPRINT
   Three very faint, cheap background layers shared by the whole page,
   mounted once, so the large black gaps between sections read as one
   continuous "living system" instead of empty space:

     1. BlueprintGrid    — static dot texture,           opacity ~0.04
     2. AmbientFieldGlow — slow drifting color fields,    opacity ~0.06–0.10
     3. BlueprintNetwork — canvas node/edge/pulse system, opacity ~0.08–0.14

   All three are `fixed inset-0`, `-z-10`, `pointer-events-none` — they sit
   behind normal document content without needing every section to know
   about them (sections just need to not paint their own opaque bg).
   ───────────────────────────────────────────── */

function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* ── Layer 1: static grid texture ─────────────────────────────────── */
function BlueprintGrid() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.5px)",
        backgroundSize: "28px 28px",
        opacity: 0.04,
      }}
    />
  );
}

/* ── Layer 3: ambient color field ─────────────────────────────────── */
const GLOW_SPOTS = [
  { top: "10%", left: "16%", size: 620, anim: "driftA 26s ease-in-out infinite" },
  { top: "48%", left: "82%", size: 560, anim: "driftB 31s ease-in-out infinite" },
  { top: "82%", left: "24%", size: 600, anim: "driftC 28s ease-in-out infinite" },
] as const;

function AmbientFieldGlow() {
  const rm = !!useReducedMotion();
  const { progress, sectionFractions } = useScrollFx();
  const fractionsRef = useRef(sectionFractions);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fractionsRef.current = sectionFractions;
  }, [sectionFractions]);

  useMotionValueEvent(progress, "change", (p) => {
    const [r, g, b] = sectionColor(p, fractionsRef.current);
    glowRefs.current.forEach((el) => {
      if (!el) return;
      el.style.background = `radial-gradient(circle, rgba(${r},${g},${b},0.5) 0%, rgba(${r},${g},${b},0) 70%)`;
    });
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {GLOW_SPOTS.map((spot, i) => (
        <div
          key={i}
          ref={(el) => { glowRefs.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.size,
            height: spot.size,
            filter: "blur(110px)",
            opacity: 0.16,
            transform: "translate(-50%, -50%)",
            animation: rm ? "none" : spot.anim,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* ── Layer 2: node network canvas ─────────────────────────────────── */
const NODE_COUNT = 42;
const MAX_EDGE_PER_NODE = 3;
const MAX_PULSES = 4;

interface BPNode { bx: number; by: number; seed: number }

function buildNodes(): BPNode[] {
  const nodes: BPNode[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({ bx: hash(i * 3.73 + 1), by: hash(i * 5.31 + 7), seed: hash(i * 9.13 + 2) * 1000 });
  }
  return nodes;
}
const BP_NODES = buildNodes();

/** Which nodes connect to which — computed once from each node's base
 *  position, not every frame. Recomputing nearest-neighbors live (off the
 *  slowly-drifting positions) meant two nodes would occasionally swap
 *  "closest" rank, and an edge would hard-cut in or out that frame instead
 *  of fading — that discontinuity read as flicker. A fixed topology plus
 *  smooth distance-based opacity below fixes it: only the line's *opacity*
 *  changes as nodes move, never whether it exists. */
function buildEdges(): [number, number][] {
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < BP_NODES.length; i++) {
    const dists = BP_NODES
      .map((m, j) => ({ j, d: i === j ? Infinity : Math.hypot(BP_NODES[i].bx - m.bx, BP_NODES[i].by - m.by) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, MAX_EDGE_PER_NODE);
    dists.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edgeSet.has(key)) return;
      edgeSet.add(key);
      edges.push([i, j]);
    });
  }
  return edges;
}
const BP_EDGES = buildEdges();

/** Per-section target layout for a node — index matches SECTION_IDS. */
const LAYOUTS: ((n: BPNode, i: number) => { x: number; y: number })[] = [
  // hero — loose scattered particles
  (n) => ({ x: n.bx, y: n.by }),
  // architecture — organized into 4 horizontal system layers
  (n, i) => ({ x: 0.12 + hash(n.seed + i) * 0.76, y: (i % 4 + 0.5) / 4 }),
  // experience — collapses toward the vertical timeline spine
  (n) => ({ x: 0.5 + (n.bx - 0.5) * 0.16, y: n.by }),
  // projects — clusters around the two visible card zones
  (n, i) => ({ x: (i % 2 === 0 ? 0.26 : 0.74) + (n.bx - 0.5) * 0.2, y: 0.24 + n.by * 0.55 }),
  // contact — converges toward one signal point
  (n) => ({ x: 0.5 + (n.bx - 0.5) * 0.05, y: 0.84 + (n.by - 0.5) * 0.035 }),
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function nodeTarget(n: BPNode, i: number, blendIdx: number) {
  const lo = Math.max(0, Math.min(LAYOUTS.length - 1, Math.floor(blendIdx)));
  const hi = Math.min(LAYOUTS.length - 1, lo + 1);
  const t = blendIdx - lo;
  const a = LAYOUTS[lo](n, i);
  const b = LAYOUTS[hi](n, i);
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

function BlueprintNetwork() {
  const rm = !!useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const { progress, sectionFractions } = useScrollFx();
  const progressRef = useRef(0);
  const fractionsRef = useRef(sectionFractions);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const timeRef = useRef(0);
  const pulsesRef = useRef<{ a: number; b: number; start: number; duration: number }[]>([]);
  const nextPulseAtRef = useRef(2);

  useEffect(() => { fractionsRef.current = sectionFractions; }, [sectionFractions]);
  useMotionValueEvent(progress, "change", (p) => { progressRef.current = p; });

  useEffect(() => {
    if (rm) return;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches;
    if (!finePointer) return;
    const move = (e: MouseEvent) => { cursorRef.current = { x: e.clientX, y: e.clientY }; };
    const leave = () => { cursorRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [rm]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h, dpr };
      draw();
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !w) return;
      ctx.clearRect(0, 0, w, h);

      const p = progressRef.current;
      const blendIdx = sectionBlendIndex(p, fractionsRef.current);
      const [cr, cg, cb] = sectionColor(p, fractionsRef.current);
      const t = timeRef.current;

      const positions = BP_NODES.map((n, i) => {
        const target = nodeTarget(n, i, blendIdx);
        const driftX = rm ? 0 : Math.sin(t * 0.09 + n.seed) * 0.004;
        const driftY = rm ? 0 : Math.cos(t * 0.07 + n.seed * 1.3) * 0.004;
        const breathe = rm ? 0.65 : Math.pow(0.5 + 0.5 * Math.sin(t * 0.22 + n.seed), 1.6);
        const opacity = 0.18 + breathe * 0.82;
        const px = (target.x + driftX) * w;
        const py = (target.y + driftY) * h;
        const cdx = px - cursorRef.current.x;
        const cdy = py - cursorRef.current.y;
        const cursorBoost = rm ? 0 : Math.max(0, 1 - Math.sqrt(cdx * cdx + cdy * cdy) / 150);
        return { x: px, y: py, opacity, cursorBoost };
      });

      // Fixed topology (BP_EDGES) — only the distance/opacity for each pair
      // is recomputed per frame, never whether the edge exists.
      const maxDist = Math.min(w, h) * 0.22;
      const edges = BP_EDGES.map(([i, j]) => {
        const A = positions[i], B = positions[j];
        const dx = A.x - B.x, dy = A.y - B.y;
        return [i, j, Math.sqrt(dx * dx + dy * dy)] as const;
      });

      ctx.lineWidth = 1;
      edges.forEach(([i, j, d]) => {
        const A = positions[i], B = positions[j];
        const proximity = 1 - d / maxDist;
        const alpha = 0.16 * proximity * Math.min(A.opacity, B.opacity);
        if (alpha < 0.004) return;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      });

      positions.forEach(({ x, y, opacity, cursorBoost }, i) => {
        const r = 1.3 + (i % 5 === 0 ? 0.7 : 0);
        const a = Math.min(0.85, 0.18 * opacity + cursorBoost * 0.5);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        if (cursorBoost > 0.05) {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, 26);
          grad.addColorStop(0, `rgba(${cr},${cg},${cb},${cursorBoost * 0.35})`);
          grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, 26, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // data pulses traveling along existing edges
      if (!rm && edges.length > 0) {
        if (t >= nextPulseAtRef.current && pulsesRef.current.length < MAX_PULSES) {
          const [a, b] = edges[Math.floor(hash(t * 1000) * edges.length)];
          pulsesRef.current.push({ a, b, start: t, duration: 1.3 + hash(t * 777) * 0.6 });
          nextPulseAtRef.current = t + 1.8 + hash(t * 333) * 1.4;
        }
        pulsesRef.current = pulsesRef.current.filter((pulse) => t - pulse.start < pulse.duration);
        pulsesRef.current.forEach((pulse) => {
          const A = positions[pulse.a], B = positions[pulse.b];
          if (!A || !B) return;
          const pt = (t - pulse.start) / pulse.duration;
          const eased = pt < 0.5 ? 2 * pt * pt : 1 - Math.pow(-2 * pt + 2, 2) / 2;
          const px = lerp(A.x, B.x, eased);
          const py = lerp(A.y, B.y, eased);
          const fade = Math.sin(Math.PI * pt);
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
          grad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.55 * fade})`);
          grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    let raf = 0;
    let running = true;
    const loop = (ts: number) => {
      timeRef.current = ts / 1000;
      draw();
      if (running && !rm) raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!rm) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (!rm) raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rm]);

  return <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden="true" />;
}

export default function LivingSystemBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <BlueprintGrid />
      <AmbientFieldGlow />
      <BlueprintNetwork />
    </div>
  );
}

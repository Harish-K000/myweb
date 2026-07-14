"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, type MotionValue } from "framer-motion";

const WINDOW_COLORS = ["#38bdf8", "#fbbf24", "#4ade80", "#a78bfa"];

// Deterministic "random" so server and client render the same markup.
function seeded(i: number, salt: number) {
    const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

const BUILDINGS = Array.from({ length: 8 }, (_, i) => {
    const height = 60 + Math.round(seeded(i, 1) * 140);
    const cols = 3 + Math.round(seeded(i, 2) * 2);
    const rows = Math.max(2, Math.round(height / 22));
    const windows = Array.from({ length: cols * rows }, (_, w) => {
        const lit = seeded(i * 31 + w, 3) > 0.55;
        const color = WINDOW_COLORS[Math.floor(seeded(i * 31 + w, 4) * WINDOW_COLORS.length)];
        return { lit, color };
    });
    return { height, cols, rows, windows };
});

const FOREGROUND_CHIPS = [
    { x: "8%", y: "18%", color: "#38bdf8", float: "float-slow" },
    { x: "82%", y: "12%", color: "#a78bfa", float: "float-medium" },
    { x: "92%", y: "38%", color: "#fbbf24", float: "float-fast" },
    { x: "4%", y: "55%", color: "#4ade80", float: "float-medium" },
    { x: "70%", y: "8%", color: "#38bdf8", float: "float-slow" },
];

/**
 * A code-built skyline (no flat image) so the depth illusion is real, not a
 * clip-path trick: background grid, building silhouettes, lit windows, and
 * floating accent chips are independent DOM layers, each moving at its own
 * scroll/cursor speed.
 */
export default function CitySkyline({ className = "" }: { className?: string }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [intensity, setIntensity] = React.useState(1);
    const [motionAllowed, setMotionAllowed] = React.useState(true);

    React.useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const narrow = window.innerWidth < 1024;
        setMotionAllowed(!reduced);
        setIntensity(reduced ? 0 : coarse || narrow ? 0.4 : 1);
    }, []);

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

    const bgY = useTransform(scrollYProgress, [0, 1], [0, -50 * intensity]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.05 * intensity]);
    const midY = useTransform(scrollYProgress, [0, 1], [0, -100 * intensity]);
    const midScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.08 * intensity]);
    const objY = useTransform(scrollYProgress, [0, 1], [0, -150 * intensity]);
    const objRotate = useTransform(scrollYProgress, [0, 1], [0, 1 * intensity]);
    const fgY = useTransform(scrollYProgress, [0, 1], [0, -220 * intensity]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const spring = { stiffness: 80, damping: 30, mass: 1 };
    const smx = useSpring(mouseX, spring);
    const smy = useSpring(mouseY, spring);

    React.useEffect(() => {
        if (!motionAllowed || intensity < 1) return;
        const onMove = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
            mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [motionAllowed, intensity, mouseX, mouseY]);

    const bgX = useTransform(smx, (v) => v * 4);
    const bgYM = useTransform(smy, (v) => v * 4);
    const midX = useTransform(smx, (v) => v * 8);
    const midYM = useTransform(smy, (v) => v * 8);
    const objX = useTransform(smx, (v) => v * 14);
    const objYM = useTransform(smy, (v) => v * 14);
    const fgX = useTransform(smx, (v) => v * 20);
    const fgYM = useTransform(smy, (v) => v * 20);

    return (
        <div ref={ref} className={`relative w-full h-full overflow-hidden ${className}`}>
            {/* Background layer — dot grid + ambient glow */}
            <motion.div
                className="absolute inset-0 dot-grid-bg opacity-30"
                style={{ x: bgX, y: useCombine(bgY, bgYM), scale: bgScale }}
            />

            {/* Glow layer */}
            <div
                className="absolute glow-pulse"
                style={{
                    right: "8%",
                    bottom: "10%",
                    width: 260,
                    height: 260,
                    background: "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
                    filter: "blur(10px)",
                }}
                aria-hidden="true"
            />

            {/* Midground layer — building silhouettes */}
            <motion.div
                className="absolute inset-x-0 bottom-0 flex items-end justify-end gap-2 pr-[6%]"
                style={{ x: midX, y: useCombine(midY, midYM), scale: midScale }}
                aria-hidden="true"
            >
                {BUILDINGS.map((b, i) => (
                    <div
                        key={i}
                        className="rounded-t-sm border border-cyan-400/20"
                        style={{
                            width: 22 + b.cols * 4,
                            height: b.height,
                            background: "linear-gradient(to top, rgba(13,20,38,0.95), rgba(13,20,38,0.7))",
                        }}
                    />
                ))}
            </motion.div>

            {/* Main object layer — lit windows over the same silhouette positions */}
            <motion.div
                className="absolute inset-x-0 bottom-0 flex items-end justify-end gap-2 pr-[6%]"
                style={{ x: objX, y: useCombine(objY, objYM), rotate: objRotate }}
                aria-hidden="true"
            >
                {BUILDINGS.map((b, i) => (
                    <div
                        key={i}
                        className="grid gap-[3px] p-[5px]"
                        style={{
                            width: 22 + b.cols * 4,
                            height: b.height,
                            gridTemplateColumns: `repeat(${b.cols}, 1fr)`,
                            alignContent: "end",
                        }}
                    >
                        {b.windows.map((w, wi) => (
                            <span
                                key={wi}
                                style={{
                                    width: "100%",
                                    aspectRatio: "1 / 1",
                                    background: w.lit ? w.color : "transparent",
                                    opacity: w.lit ? 0.85 : 0,
                                    borderRadius: 1,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </motion.div>

            {/* Foreground layer — floating accent chips */}
            <motion.div className="absolute inset-0" style={{ x: fgX, y: useCombine(fgY, fgYM) }} aria-hidden="true">
                {FOREGROUND_CHIPS.map((c, i) => (
                    <span
                        key={i}
                        className={motionAllowed ? c.float : ""}
                        style={{
                            position: "absolute",
                            left: c.x,
                            top: c.y,
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: c.color,
                            boxShadow: `0 0 12px ${c.color}`,
                            opacity: 0.85,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}

function useCombine(a: MotionValue<number>, b: MotionValue<number>) {
    return useTransform([a, b], (values: number[]) => values[0] + values[1]);
}

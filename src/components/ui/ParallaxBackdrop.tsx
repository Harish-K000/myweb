"use client";

import * as React from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";

type Accent = "gold" | "rune" | "ember";

const ACCENTS: Record<Accent, { solid: string; soft: string; faint: string }> = {
    gold: {
        solid: "rgba(214, 168, 79, 0.72)",
        soft: "rgba(214, 168, 79, 0.16)",
        faint: "rgba(214, 168, 79, 0.055)",
    },
    rune: {
        solid: "rgba(96, 165, 250, 0.72)",
        soft: "rgba(96, 165, 250, 0.16)",
        faint: "rgba(96, 165, 250, 0.055)",
    },
    ember: {
        solid: "rgba(255, 106, 42, 0.72)",
        soft: "rgba(255, 106, 42, 0.16)",
        faint: "rgba(255, 106, 42, 0.055)",
    },
};

const GLYPHS = [
    { label: "</>", left: "8%", top: "18%", depth: "far" },
    { label: "{ }", left: "84%", top: "14%", depth: "near" },
    { label: "01", left: "76%", top: "58%", depth: "far" },
    { label: "API", left: "12%", top: "72%", depth: "near" },
    { label: "◈", left: "52%", top: "36%", depth: "far" },
] as const;

export default function ParallaxBackdrop({
    accent = "gold",
    density = "default",
}: {
    accent?: Accent;
    density?: "default" | "quiet";
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, { stiffness: 65, damping: 24, mass: 0.8 });
    const smoothY = useSpring(pointerY, { stiffness: 65, damping: 24, mass: 0.8 });
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
    const colors = ACCENTS[accent];

    React.useEffect(() => {
        if (reduceMotion) return;

        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
        if (!finePointer.matches) return;

        const handlePointerMove = (event: PointerEvent) => {
            pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
            pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, [pointerX, pointerY, reduceMotion]);

    const farX = useTransform(smoothX, [-1, 1], [-10, 10]);
    const farY = useTransform(
        [smoothY, scrollYProgress],
        (values: number[]) => values[0] * 8 - values[1] * 55
    );
    const midX = useTransform(smoothX, [-1, 1], [-20, 20]);
    const midY = useTransform(
        [smoothY, scrollYProgress],
        (values: number[]) => values[0] * 14 - values[1] * 105
    );
    const nearX = useTransform(smoothX, [-1, 1], [-34, 34]);
    const nearY = useTransform(
        [smoothY, scrollYProgress],
        (values: number[]) => values[0] * 22 - values[1] * 165
    );
    const gridY = useTransform(scrollYProgress, [0, 1], [80, -120]);
    const gridRotate = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);

    return (
        <div ref={ref} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div className="fixed inset-0 overflow-hidden">
                <motion.div className="absolute inset-[-8%]" style={{ x: farX, y: farY }}>
                    <div
                        className="absolute left-[4%] top-[8%] h-[28rem] w-[28rem] rounded-full blur-[120px]"
                        style={{ background: colors.soft, opacity: density === "quiet" ? 0.45 : 0.72 }}
                    />
                    <div
                        className="absolute bottom-[4%] right-[2%] h-[24rem] w-[24rem] rounded-full blur-[110px]"
                        style={{ background: "rgba(96, 165, 250, 0.1)", opacity: density === "quiet" ? 0.35 : 0.58 }}
                    />
                </motion.div>

                <motion.div
                    className="absolute right-[-8rem] top-[8%] h-[30rem] w-[30rem]"
                    style={{ x: midX, y: midY, transformStyle: "preserve-3d" }}
                >
                    <motion.div
                        className="parallax-rune absolute inset-0 rounded-full"
                        animate={reduceMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                        style={{ borderColor: colors.soft, boxShadow: `inset 0 0 70px ${colors.faint}` }}
                    />
                    <motion.div
                        className="parallax-rune absolute inset-[18%] rounded-full"
                        animate={reduceMotion ? undefined : { rotate: -360 }}
                        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                        style={{ borderColor: colors.soft }}
                    />
                    <div
                        className="absolute inset-[38%] rotate-45 border"
                        style={{ borderColor: colors.soft, boxShadow: `0 0 30px ${colors.soft}` }}
                    />
                </motion.div>

                <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
                    {GLYPHS.map((glyph, index) => (
                        <motion.span
                            key={glyph.label}
                            className={`parallax-glyph absolute ${glyph.depth === "near" ? "parallax-glyph-near" : ""}`}
                            style={{
                                left: glyph.left,
                                top: glyph.top,
                                color: colors.solid,
                                borderColor: colors.soft,
                            }}
                            animate={reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -10 : 10, 0] }}
                            transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut", delay: index * -0.8 }}
                        >
                            {glyph.label}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div
                    className="parallax-grid absolute -bottom-[32%] left-[-20%] h-[62%] w-[140%]"
                    style={{
                        y: gridY,
                        transformPerspective: 680,
                        rotateX: 68,
                        rotateZ: gridRotate,
                        borderColor: colors.faint,
                        backgroundImage: `linear-gradient(${colors.faint} 1px, transparent 1px), linear-gradient(90deg, ${colors.faint} 1px, transparent 1px)`,
                    }}
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(var(--color-brand-bg-rgb)/0.1)_55%,rgb(var(--color-brand-bg-rgb)/0.82)_100%)]" />
            </div>
        </div>
    );
}

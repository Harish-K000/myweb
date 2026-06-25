"use client";

import * as React from "react";
import Image from "next/image";
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const ACCENTS = [
    { accent: "#60a5fa", glow: "rgba(96, 165, 250, 0.34)" },
    { accent: "#d6a84f", glow: "rgba(214, 168, 79, 0.36)" },
    { accent: "#ff6a2a", glow: "rgba(255, 106, 42, 0.36)" },
    { accent: "#7c9473", glow: "rgba(124, 148, 115, 0.34)" },
];

// Eyeballed against the journey artwork's six lit banners, left-to-right
// along the rising road — from "the journey begins" to the tech-lead keep.
const ROAD_POSITIONS = [
    { left: "13%", top: "80%" },
    { left: "27%", top: "49%" },
    { left: "40%", top: "34%" },
    { left: "55%", top: "29%" },
    { left: "70%", top: "22%" },
    { left: "85%", top: "14%" },
];

function pickPositions(count: number) {
    if (count <= 1) return [ROAD_POSITIONS[0]];
    return Array.from(
        { length: count },
        (_, i) => ROAD_POSITIONS[Math.round((i * (ROAD_POSITIONS.length - 1)) / (count - 1))]
    );
}

export default function PathOfTheEngineer() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const reduceMotion = Boolean(useReducedMotion());
    const [activeChapter, setActiveChapter] = React.useState(0);

    const milestones = PORTFOLIO_DATA.experience;
    const positions = React.useMemo(() => pickPositions(milestones.length), [milestones.length]);
    const stages = React.useMemo(
        () =>
            milestones.map((job, index) => ({
                ...job,
                accent: ACCENTS[index % ACCENTS.length].accent,
                glow: ACCENTS[index % ACCENTS.length].glow,
                position: positions[index],
            })),
        [milestones, positions]
    );

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [1.04, 1.04, 1.04] : [1.08, 1.14, 1.2]);
    const imageY = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [60, 0, -80]);
    const imageRotateX = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [3, 0, -2]);
    const imageRotateY = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [-2, 0, 2]);
    const sectionOpacity = useTransform(scrollYProgress, [0, 0.06, 0.92, 1], [0, 1, 1, 0]);
    const copyY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], reduceMotion ? [0, 0, 0, 0] : [40, 0, -20, -60]);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const normalized = Math.min(1, Math.max(0, (latest - 0.06) / 0.88));
        const nextStage = Math.min(stages.length - 1, Math.round(normalized * (stages.length - 1)));
        setActiveChapter((current) => (current === nextStage ? current : nextStage));
    });

    const selectChapter = (index: number) => {
        setActiveChapter(index);
        const section = sectionRef.current;
        if (!section) return;

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollableDistance = section.offsetHeight - window.innerHeight;
        const chapterProgress = index / Math.max(stages.length - 1, 1);
        window.scrollTo({
            top: sectionTop + scrollableDistance * chapterProgress,
            behavior: reduceMotion ? "auto" : "smooth",
        });
    };

    const stage = stages[activeChapter];
    if (!stage) return null;

    return (
        <section
            id="path"
            ref={sectionRef}
            className="relative bg-[#080605]"
            style={{ height: `${110 + stages.length * 75}vh` }}
        >
            <div className="sticky top-0 h-screen min-h-[640px] overflow-hidden" style={{ perspective: "1400px" }}>
                <motion.div
                    className="absolute inset-[-5%]"
                    style={{
                        scale: imageScale,
                        y: imageY,
                        rotateX: imageRotateX,
                        rotateY: imageRotateY,
                        transformStyle: "preserve-3d",
                    }}
                >
                    <Image
                        src="/images/sections/path-journey.webp"
                        alt="A winding, lantern-lit road climbing past banners marking each stage of a developer's career, with a lone traveler at its start"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </motion.div>

                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,5,0.85)_0%,rgba(8,6,5,0.4)_38%,rgba(8,6,5,0.12)_62%,rgba(8,6,5,0.5)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,6,5,0.75)_0%,transparent_20%,transparent_72%,rgba(8,6,5,0.94)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_34%,rgba(0,0,0,0.74)_100%)]" />

                <motion.div
                    className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                    animate={{ left: stage.position.left, top: stage.position.top, backgroundColor: stage.glow, opacity: 0.75 }}
                    transition={{ type: "spring", stiffness: 80, damping: 24 }}
                    aria-hidden="true"
                />
                <motion.div
                    className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    animate={{ left: stage.position.left, top: stage.position.top, backgroundColor: stage.accent }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    style={{ boxShadow: `0 0 18px ${stage.glow}` }}
                    aria-hidden="true"
                />

                <motion.div
                    className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pb-14 lg:px-12"
                    style={{ opacity: sectionOpacity, y: copyY }}
                >
                    <div className="max-w-2xl">
                        <p className="eyebrow-rune mb-4" style={{ color: "#d6a84f" }}>
                            The Path of the Engineer
                        </p>
                        <h2 className="font-display text-4xl font-bold leading-[1.06] text-[#f8f1e3] md:text-6xl lg:text-7xl">
                            From first quest
                            <br />
                            <span className="gradient-text">to seasoned campaigner.</span>
                        </h2>
                    </div>

                    <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
                        <div className="hidden lg:block">
                            <div className="mb-5 flex items-center gap-2">
                                {stages.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => selectChapter(index)}
                                        className="group flex items-center gap-2 py-3 text-left"
                                        aria-label={`Show ${item.role}`}
                                        aria-pressed={activeChapter === index}
                                    >
                                        <motion.span
                                            className="h-[2px] rounded-full"
                                            animate={{
                                                width: activeChapter === index ? 38 : 16,
                                                backgroundColor: activeChapter === index ? item.accent : "rgba(248,241,227,0.25)",
                                            }}
                                        />
                                        <span className="sr-only">{item.role}</span>
                                    </button>
                                ))}
                                <span className="ml-3 font-display text-xs uppercase tracking-[0.2em] text-[#b8aa94]">
                                    Milestone {String(activeChapter + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                                </span>
                            </div>
                        </div>

                        <motion.div
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/55 p-5 shadow-2xl backdrop-blur-xl md:p-6"
                            style={{ boxShadow: `0 26px 70px -28px ${stage.glow}` }}
                        >
                            <motion.div className="absolute inset-x-0 top-0 h-px" animate={{ backgroundColor: stage.accent }} />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={stage.id}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, rotateX: 5 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, rotateX: -4 }}
                                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ transformPerspective: 900 }}
                                >
                                    <p className="mb-3 text-[10px] uppercase tracking-[0.18em]" style={{ color: stage.accent }}>
                                        {stage.period}
                                    </p>
                                    <h3 className="font-display text-2xl font-semibold text-[#f8f1e3] md:text-3xl">
                                        {stage.role} · {stage.company}
                                    </h3>
                                    <ul className="mt-4 max-h-48 space-y-3 overflow-y-auto text-sm leading-relaxed text-[#c8bda8]">
                                        {stage.description.map((bullet, index) => (
                                            <li key={index} className="flex gap-2.5">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: stage.accent }} />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:hidden">
                    {stages.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => selectChapter(index)}
                            className="h-8 w-8 rounded-full border bg-black/55 backdrop-blur"
                            style={{
                                borderColor: activeChapter === index ? item.accent : "rgba(248,241,227,0.18)",
                                color: activeChapter === index ? item.accent : "#b8aa94",
                            }}
                            aria-label={`Show ${item.role}`}
                            aria-pressed={activeChapter === index}
                        >
                            <span className="font-display text-[10px]">{index + 1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

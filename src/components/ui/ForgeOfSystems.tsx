"use client";

import * as React from "react";
import Image from "next/image";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { skills } from "@/data/skills";

const STAGES = [
    {
        title: "Enchanted UI Crystal",
        subtitle: "React + TypeScript",
        items: ["React.js", "Next.js", "TypeScript", "Angular", "HTML5", "CSS3"],
        accent: "#60a5fa",
        glow: "rgba(96, 165, 250, 0.34)",
        description: "Component architecture, state management, and type-safe interfaces, shaped into fast, accessible UI.",
    },
    {
        title: "Spellbound API Gateway",
        subtitle: "REST + GraphQL",
        items: ["RESTful APIs", "GraphQL", "Node.js", "Express.js", "API Development", "Microservices"],
        accent: "#9b7fd4",
        glow: "rgba(155, 127, 212, 0.34)",
        description: "Contracts and integrations that bind frontend to backend without breaking under load.",
    },
    {
        title: "The Forge Engine",
        subtitle: "Java + Spring Boot",
        items: ["Java", "Spring Boot", "OOP", "Design Patterns", "Secure Coding", "JUnit"],
        accent: "#d6a84f",
        glow: "rgba(214, 168, 79, 0.36)",
        description: "Domain-driven services hammered into shape — resilient, tested, and built to hold weight.",
    },
    {
        title: "Ancient Data Vault",
        subtitle: "PostgreSQL + MongoDB",
        items: ["PostgreSQL", "MongoDB", "MySQL", "SQL Server", "Redis", "SQL"],
        accent: "#a97142",
        glow: "rgba(169, 113, 66, 0.36)",
        description: "Schemas and queries tuned for speed, guarding data with the care of a vault keeper.",
    },
    {
        title: "The Portal Tower",
        subtitle: "AWS + Docker + CI/CD",
        items: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
        accent: "#ff6a2a",
        glow: "rgba(255, 106, 42, 0.36)",
        description: "Sealed containers and deployment pipelines that carry the work safely into production.",
    },
] as const;

const BANNER_POSITIONS = ["22.5%", "37.5%", "51.5%", "65.5%", "78.5%"];

export default function ForgeOfSystems() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const reduceMotion = Boolean(useReducedMotion());
    const [activeChapter, setActiveChapter] = React.useState(0);
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothPointerX = useSpring(pointerX, { stiffness: 80, damping: 30, mass: 0.8 });
    const smoothPointerY = useSpring(pointerY, { stiffness: 80, damping: 30, mass: 0.8 });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const imageScale = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        reduceMotion ? [1.04, 1.04, 1.04] : [1.08, 1.14, 1.2]
    );
    const imageY = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        reduceMotion ? [0, 0, 0] : [80, 0, -105]
    );
    const imageRotateX = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        reduceMotion ? [0, 0, 0] : [4, 0, -3]
    );
    const imageRotateY = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        reduceMotion ? [0, 0, 0] : [-2.5, 0, 2.5]
    );
    const sectionOpacity = useTransform(scrollYProgress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
    const copyY = useTransform(
        scrollYProgress,
        [0, 0.25, 0.78, 1],
        reduceMotion ? [0, 0, 0, 0] : [45, 0, -24, -70]
    );
    const imagePointerX = useTransform(smoothPointerX, (value) => value * 1.2);
    const imagePointerY = useTransform(smoothPointerY, (value) => value * 0.8);
    const panelX = useTransform(smoothPointerX, (value) => value * -0.24);
    const panelY = useTransform(smoothPointerY, (value) => value * -0.18);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const normalized = Math.min(1, Math.max(0, (latest - 0.08) / 0.84));
        const nextStage = Math.min(
            STAGES.length - 1,
            Math.round(normalized * (STAGES.length - 1))
        );
        setActiveChapter((current) => current === nextStage ? current : nextStage);
    });

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (reduceMotion || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 24);
        pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 24);
    };

    const resetPointer = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    const selectChapter = (index: number) => {
        setActiveChapter(index);
        const section = sectionRef.current;
        if (!section) return;

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrollableDistance = section.offsetHeight - window.innerHeight;
        const chapterProgress = index / (STAGES.length - 1);
        window.scrollTo({
            top: sectionTop + scrollableDistance * chapterProgress,
            behavior: reduceMotion ? "auto" : "smooth",
        });
    };

    const stage = STAGES[activeChapter];
    const forgeStats = [
        { value: `${PORTFOLIO_DATA.experience.length}`, label: "Campaigns Served" },
        { value: `${PORTFOLIO_DATA.projects.length}`, label: "Quests Completed" },
        { value: `${PORTFOLIO_DATA.techStack.length}+`, label: "Runes Mastered" },
        { value: `${skills.length}`, label: "Grimoire Chapters" },
    ];

    return (
        <section
            id="forge"
            ref={sectionRef}
            className="relative h-[230vh] min-h-[1320px] bg-[#080605]"
        >
            <div
                className="sticky top-0 h-screen min-h-[640px] overflow-hidden"
                style={{ perspective: "1400px" }}
                onPointerMove={handlePointerMove}
                onPointerLeave={resetPointer}
            >
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
                    <motion.div className="absolute inset-0" style={{ x: imagePointerX, y: imagePointerY }}>
                        <Image
                            src="/images/sections/forge-of-systems.webp"
                            alt="A vast fantasy forge with five glowing technology banners representing the stages of full-stack software delivery"
                            fill
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                    </motion.div>
                </motion.div>

                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,5,0.92)_0%,rgba(8,6,5,0.48)_38%,rgba(8,6,5,0.12)_62%,rgba(8,6,5,0.56)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,6,5,0.7)_0%,transparent_20%,transparent_72%,rgba(8,6,5,0.94)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_34%,rgba(0,0,0,0.74)_100%)]" />

                <motion.div
                    className="absolute top-[6%] h-[43%] w-[14%] -translate-x-1/2 rounded-[48%] blur-2xl"
                    animate={{
                        left: BANNER_POSITIONS[activeChapter],
                        backgroundColor: stage.glow,
                        opacity: 0.68,
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 24 }}
                    aria-hidden="true"
                />

                <motion.div
                    className="absolute left-1/2 top-[48%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    animate={{ backgroundColor: stage.glow }}
                    style={{ opacity: sectionOpacity }}
                    transition={{ duration: 0.8 }}
                    aria-hidden="true"
                />
                <motion.div
                    className="absolute left-1/2 top-[48%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f3c969]/35"
                    animate={reduceMotion ? undefined : { rotate: 360, scale: [0.94, 1.08, 0.94] }}
                    transition={{ rotate: { duration: 24, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                    style={{ boxShadow: "0 0 55px rgba(214,168,79,0.28)" }}
                    aria-hidden="true"
                />

                <motion.div
                    animate={reduceMotion ? undefined : { x: ["-10%", "10%", "-10%"] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] blur-3xl"
                    aria-hidden="true"
                />

                <motion.div
                    className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pb-14 lg:px-12"
                    style={{ opacity: sectionOpacity, y: copyY }}
                >
                    <div className="max-w-2xl">
                        <p className="eyebrow-rune mb-4">The Forge of Systems</p>
                        <h2 className="font-display text-4xl font-bold leading-[1.06] text-[#f8f1e3] md:text-6xl lg:text-7xl">
                            Raw ideas enter.
                            <br />
                            <span className="gradient-text">Production systems emerge.</span>
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c8bda8] md:text-lg">
                            Every quest begins with raw material. Scroll through five stages where frontend crystal,
                            backend iron, data, APIs, and cloud infrastructure are shaped into reliable software.
                        </p>
                    </div>

                    <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
                        <div className="hidden lg:block">
                            <div className="mb-5 flex items-center gap-2">
                                {STAGES.map((item, index) => (
                                    <button
                                        key={item.title}
                                        type="button"
                                        onClick={() => selectChapter(index)}
                                        className="group flex items-center gap-2 py-3 text-left"
                                        aria-label={`Show ${item.title}`}
                                        aria-pressed={activeChapter === index}
                                    >
                                        <motion.span
                                            className="h-[2px] rounded-full"
                                            animate={{
                                                width: activeChapter === index ? 38 : 16,
                                                backgroundColor: activeChapter === index ? item.accent : "rgba(248,241,227,0.25)",
                                            }}
                                        />
                                        <span className="sr-only">{item.title}</span>
                                    </button>
                                ))}
                                <span className="ml-3 font-display text-xs uppercase tracking-[0.2em] text-[#b8aa94]">
                                    Forge stage {String(activeChapter + 1).padStart(2, "0")} / 05
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-5">
                                {forgeStats.map((stat) => (
                                    <div key={stat.label}>
                                        <p className="font-display text-2xl font-bold text-[#f3c969]">{stat.value}</p>
                                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#b8aa94]">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/55 p-5 shadow-2xl backdrop-blur-xl md:p-6"
                            style={{
                                x: panelX,
                                y: panelY,
                                transformPerspective: 1000,
                                boxShadow: `0 26px 70px -28px ${stage.glow}`,
                            }}
                        >
                            <motion.div
                                className="absolute inset-x-0 top-0 h-px"
                                animate={{ backgroundColor: stage.accent }}
                            />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={stage.title}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, rotateX: 5 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, rotateX: -4 }}
                                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ transformPerspective: 900 }}
                                >
                                    <p
                                        className="mb-3 text-[10px] uppercase tracking-[0.18em]"
                                        style={{ color: stage.accent }}
                                    >
                                        {stage.subtitle}
                                    </p>
                                    <h3 className="font-display text-2xl font-semibold text-[#f8f1e3] md:text-3xl">
                                        {stage.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#c8bda8]">
                                        {stage.description}
                                    </p>
                                    <div className="mt-5 flex max-h-28 flex-wrap gap-2 overflow-hidden md:max-h-none">
                                        {stage.items.map((item, index) => (
                                            <motion.span
                                                key={item}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.25) }}
                                                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }}
                                                className="rounded-full border bg-black/35 px-3 py-1.5 text-xs text-[#f8f1e3]"
                                                style={{
                                                    borderColor: `${stage.accent}66`,
                                                    boxShadow: `0 0 18px ${stage.glow}`,
                                                }}
                                            >
                                                {item}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:hidden">
                    {STAGES.map((item, index) => (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => selectChapter(index)}
                            className="h-8 w-8 rounded-full border bg-black/55 backdrop-blur"
                            style={{
                                borderColor: activeChapter === index ? item.accent : "rgba(248,241,227,0.18)",
                                color: activeChapter === index ? item.accent : "#b8aa94",
                            }}
                            aria-label={`Show ${item.title}`}
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

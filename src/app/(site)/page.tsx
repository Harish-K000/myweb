"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Github,
    Linkedin,
    Mail,
    Phone,
    ArrowUpRight,
    Download,
} from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { PORTFOLIO_DATA, type ProjectItem } from "@/data/portfolio";
import { skills } from "@/data/skills";
import ContactForm from "@/components/ui/ContactForm";
import ForgeOfSystems from "@/components/ui/ForgeOfSystems";
import PathOfTheEngineer from "@/components/ui/PathOfTheEngineer";
import VortexIntro from "@/components/ui/VortexIntro";
import SceneAssembly from "@/components/ui/SceneAssembly";
import VortexField from "@/components/ui/VortexField";
import { useTilt } from "@/components/ui/useTilt";

const CATEGORY_COLORS: Record<string, string> = {
    "Languages & Frontend": "var(--color-cat-frontend)",
    "Backend & Databases": "var(--color-cat-backend)",
    "Cloud & DevOps": "var(--color-cat-cloud)",
    "AI & Generative AI": "var(--color-cat-ai)",
    "Engineering & Testing": "var(--color-cat-architecture)",
    "Tools & Collaboration": "var(--color-cat-tools)",
};

function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
    return (
        <section id={id} className={`relative px-6 py-24 max-w-7xl mx-auto ${className}`}>
            {children}
        </section>
    );
}

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    subtitle,
    accent = "var(--color-brand-primary)",
    dark = false,
}: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    accent?: string;
    dark?: boolean;
}) {
    return (
        <FadeIn className="relative max-w-2xl mx-auto text-center mb-16">
            <p className="eyebrow-rune mb-4" style={{ color: accent }}>
                {eyebrow}
            </p>
            <h2
                className="font-display text-4xl md:text-5xl font-bold mb-4"
                style={dark ? { color: "#f8f1e3" } : undefined}
            >
                {title}
            </h2>
            <p className={dark ? "leading-relaxed text-[#b8aa94]" : "text-muted leading-relaxed"}>{subtitle}</p>
        </FadeIn>
    );
}

const MotionLink = motion.create(Link);

function QuestCard({ proj, index }: { proj: ProjectItem; index: number }) {
    const tilt = useTilt();
    return (
        <MotionLink
            href={`/projects/${proj.id}`}
            ref={tilt.ref as React.RefObject<HTMLAnchorElement>}
            {...tilt.handlers}
            style={tilt.style}
            className="stone-card block h-full p-6 flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xs" style={{ color: "var(--color-brand-primary)" }}>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight className="w-4 h-4 text-muted" />
            </div>
            <h3 className="font-display text-lg font-bold mb-1">{proj.title}</h3>
            <p className="text-xs text-muted mb-4">{proj.subtitle}</p>
            <p className="text-sm text-muted mb-5 leading-relaxed flex-1">{proj.description}</p>
            <div className="flex flex-wrap gap-2 mb-5">
                {proj.techStack.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[11px] chip-surface px-2.5 py-1 rounded">{tag}</span>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                {proj.metrics.slice(0, 2).map((metric) => (
                    <p key={metric} className="text-xs text-muted leading-snug">{metric}</p>
                ))}
            </div>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ opacity: tilt.glareOpacity, background: tilt.glareBackground }}
            />
        </MotionLink>
    );
}

function GrimoirePanel({ category, items, color }: { category: string; items: string[]; color: string }) {
    const tilt = useTilt();
    return (
        <motion.div
            ref={tilt.ref as React.RefObject<HTMLDivElement>}
            {...tilt.handlers}
            style={tilt.style}
            className="stone-card p-6 h-full"
        >
            <h3 className="font-display text-sm font-semibold mb-4 uppercase tracking-[0.1em]" style={{ color }}>
                {category}
            </h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <span
                        key={item}
                        className="text-xs px-3 py-1.5 rounded border"
                        style={{ borderColor: `${color}33`, background: `${color}0f`, color: "var(--color-brand-text)" }}
                    >
                        {item}
                    </span>
                ))}
            </div>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ opacity: tilt.glareOpacity, background: tilt.glareBackground }}
            />
        </motion.div>
    );
}

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const { scrollYProgress: heroScrollProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.2 });
    const heroContentY = useTransform(heroScrollProgress, [0, 1], reduceMotion ? [0, 0] : [0, -110]);
    const heroContentScale = useTransform(heroScrollProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.94]);
    const heroContentOpacity = useTransform(heroScrollProgress, [0, 0.72], [1, 0]);
    const heroArtY = useTransform(heroScrollProgress, [0, 1], reduceMotion ? [0, 0] : [0, 80]);
    const scrollCueOpacity = useTransform(heroScrollProgress, [0, 0.25], [1, 0]);

    // Mouse-driven 3D depth: the art tilts in space and the foreground text
    // drifts independently at a different rate, so the hero reads as layers
    // at different depths rather than one flat image with scroll motion.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothPointerX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.6 });
    const smoothPointerY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.6 });

    useEffect(() => {
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

    const heroArtRotateX = useTransform(smoothPointerY, [-1, 1], reduceMotion ? [0, 0] : [4, -4]);
    const heroArtRotateY = useTransform(smoothPointerX, [-1, 1], reduceMotion ? [0, 0] : [-5, 5]);
    const heroArtPointerX = useTransform(smoothPointerX, (value) => value * 18);
    const heroContentPointerX = useTransform(smoothPointerX, (value) => value * -10);
    const heroContentPointerY = useTransform(smoothPointerY, (value) => value * -6);
    const heroContentCombinedY = useTransform(
        [heroContentY, heroContentPointerY],
        ([scrollY, pointerY]: number[]) => scrollY + pointerY
    );

    return (
        <div className="selection:bg-[var(--color-brand-primary)]/30">
            <VortexField />
            <motion.div
                style={{ scaleX: progress }}
                className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left"
            >
                <div className="w-full h-full" style={{ background: "linear-gradient(to right, var(--color-brand-primary), var(--color-brand-accent))" }} />
            </motion.div>

            {/* ── Hero: The Developer's Castle ─────────────────────── */}
            <motion.div
                ref={heroRef}
                id="hero-section"
                className="relative h-screen min-h-[640px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <div className="absolute inset-0 bg-[#080605] overflow-hidden" style={{ perspective: "1200px" }}>
                    <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1.04 }}
                        style={{ y: heroArtY }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                rotateX: heroArtRotateX,
                                rotateY: heroArtRotateY,
                                x: heroArtPointerX,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <Image
                                src="/images/sections/hero-castle.webp"
                                alt="A lone knight overlooking a vast, lantern-lit castle keep at dawn"
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover object-center scale-110"
                            />
                        </motion.div>
                    </motion.div>
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, rgba(8,6,5,0.95) 0%, rgba(8,6,5,0.65) 45%, rgba(8,6,5,0.15) 100%)",
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to bottom, rgba(8,6,5,0.55) 0%, transparent 22%, transparent 75%, rgba(8,6,5,0.9) 100%)",
                        }}
                    />
                </div>

                {/* Text content lives outside the overflow-hidden art layer so it
                    can never be silently clipped if copy runs long. */}
                <motion.div
                    className="absolute inset-0 z-20 h-full flex flex-col justify-center px-6 max-w-7xl mx-auto pointer-events-none"
                    style={{
                        y: heroContentCombinedY,
                        x: heroContentPointerX,
                        scale: heroContentScale,
                        opacity: heroContentOpacity,
                    }}
                >
                    <div className="max-w-2xl pointer-events-auto">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="eyebrow-rune mb-5"
                            style={{ color: "#b8aa94", letterSpacing: "0.2em" }}
                        >
                            Greetings, I&apos;m
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.9 }}
                            className="font-display text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.0] text-[#f8f1e3]"
                        >
                            HARISH
                            <br />
                            <span className="gradient-text">K.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, letterSpacing: "0.5em" }}
                            animate={{ opacity: 1, letterSpacing: "0.25em" }}
                            transition={{ delay: 0.95, duration: 1 }}
                            className="font-display text-base md:text-lg mb-6 uppercase"
                            style={{ color: "var(--color-brand-primary)" }}
                        >
                            Full Stack Developer
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="text-lg mb-10 leading-relaxed max-w-lg text-[#b8aa94]"
                        >
                            I build scalable web applications, backend systems, cloud-ready APIs, and production-grade digital experiences.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.8 }}
                            className="flex flex-wrap gap-4 mb-10"
                        >
                            <a
                                href="#quests"
                                className="wobble-hover inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.1em] font-semibold px-7 py-3 rounded-md transition-colors"
                                style={{ background: "var(--color-brand-primary)", color: "#1f1710" }}
                            >
                                View Projects <ArrowUpRight className="w-4 h-4" />
                            </a>
                            <a
                                href="/resume.pdf"
                                download
                                className="wobble-hover inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.1em] border px-7 py-3 rounded-md transition-colors"
                                style={{ borderColor: "rgba(214,168,79,0.35)", color: "#f8f1e3" }}
                            >
                                <Download className="w-4 h-4" /> Download Resume
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="flex items-center gap-4"
                        >
                            <a href={PORTFOLIO_DATA.profile.social.github} target="_blank" rel="noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[rgba(214,168,79,0.18)] text-[#b8aa94] hover:text-[#d6a84f] hover:border-[#d6a84f]/40 transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href={PORTFOLIO_DATA.profile.social.linkedin} target="_blank" rel="noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[rgba(214,168,79,0.18)] text-[#b8aa94] hover:text-[#d6a84f] hover:border-[#d6a84f]/40 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href={PORTFOLIO_DATA.profile.social.email}
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[rgba(214,168,79,0.18)] text-[#b8aa94] hover:text-[#d6a84f] hover:border-[#d6a84f]/40 transition-all">
                                <Mail className="w-4 h-4" />
                            </a>
                            <a href={PORTFOLIO_DATA.profile.social.phone}
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[rgba(214,168,79,0.18)] text-[#b8aa94] hover:text-[#d6a84f] hover:border-[#d6a84f]/40 transition-all">
                                <Phone className="w-4 h-4" />
                            </a>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ opacity: scrollCueOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 eyebrow-rune"
                >
                    <span>Descend</span>
                    <motion.span
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="block h-8 w-[2px]"
                        style={{ background: "linear-gradient(to bottom, var(--color-brand-primary), transparent)" }}
                    />
                </motion.div>
            </motion.div>

            {/* ── Interlude: The Rift ───────────────────────────────── */}
            <VortexIntro />

            {/* ── About / Full Stack Journey: Forge of Systems ─────── */}
            <ForgeOfSystems />

            {/* ── Experience: Path of the Engineer ─────────────────── */}
            <PathOfTheEngineer />

            {/* ── Education: Halls of Learning ──────────────────────── */}
            <Section id="academy">
                <SectionHeading
                    eyebrow="Halls of Learning"
                    title="Halls of Learning"
                    subtitle="Where the craft was first studied."
                />
                <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {PORTFOLIO_DATA.education.map((edu, i) => (
                        <FadeIn key={edu.id} delay={i * 0.08}>
                            <div className="stone-card depth-card p-6 h-full">
                                <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: "var(--color-brand-primary)" }}>{edu.period}</p>
                                <h3 className="font-display font-semibold mb-1">{edu.degree}</h3>
                                <p className="text-sm text-muted mb-3">{edu.field}</p>
                                <p className="text-sm text-[var(--color-brand-text)]">{edu.school}</p>
                                <p className="text-xs text-muted">{edu.location}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>

            {/* ── Projects: Hall of Quests ───────────────────────────── */}
            <Section id="quests">
                <SectionHeading
                    eyebrow="The Hall of Quests"
                    title="Hall of Quests"
                    subtitle="Selected work — each one a different problem, a different scale."
                />
                <div className="grid md:grid-cols-3 gap-6">
                    {PORTFOLIO_DATA.projects.map((proj, index) => (
                        <FadeIn key={proj.id} delay={index * 0.1} className="h-full">
                            <QuestCard proj={proj} index={index} />
                        </FadeIn>
                    ))}
                </div>
                <FadeIn delay={0.2} className="text-center mt-10">
                    <Link href="/projects" className="text-sm hover:opacity-80 transition-opacity inline-flex items-center gap-1.5" style={{ color: "var(--color-brand-primary)" }}>
                        View all quests <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </FadeIn>
            </Section>

            {/* ── Skills: Arcane Tech Grimoire ──────────────────────── */}
            <Section id="grimoire" className="bg-[#080605]">
                <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
                    <SceneAssembly
                        src="/images/sections/grimoire-hall.webp"
                        alt="A candlelit hall of stained-glass windows etched with technology sigils, around an open spellbook"
                    />
                </div>
                <SectionHeading
                    eyebrow="The Arcane Tech Grimoire"
                    title="Arcane Tech Grimoire"
                    subtitle="The spells I reach for — bound by chapter, ready to cast."
                    dark
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((group, index) => {
                        const color = CATEGORY_COLORS[group.category] ?? "var(--color-brand-primary)";
                        return (
                            <FadeIn key={group.category} delay={index * 0.08}>
                                <GrimoirePanel category={group.category} items={group.items} color={color} />
                            </FadeIn>
                        );
                    })}
                </div>
            </Section>

            {/* ── Contact: Open the Portal ──────────────────────────── */}
            <Section id="portal" className="mb-10">
                <SectionHeading
                    eyebrow="The Summoning Gate"
                    title="Open the Portal"
                    subtitle="Available for freelance projects, full-time roles, and interesting problems. Let's talk."
                />
                <div className="grid lg:grid-cols-2 gap-8">
                    <FadeIn>
                        <div className="portal-frame h-full relative">
                            <div
                                className="absolute inset-0 glow-pulse pointer-events-none"
                                style={{ background: "radial-gradient(circle at 30% 20%, rgba(214,168,79,0.12), transparent 60%)" }}
                            />
                            <div className="portal-frame-bar relative z-10">
                                <span className="seal-dot" />
                                <span className="seal-dot" style={{ opacity: 0.5 }} />
                                <span className="seal-dot" style={{ opacity: 0.3 }} />
                                <span className="text-xs text-muted ml-2 font-display uppercase tracking-[0.1em]">The Summoning Gate</span>
                            </div>
                            <div className="p-6 space-y-3 relative z-10">
                                <p className="text-muted leading-relaxed">
                                    The gate stands open. Send word, and I will answer the call.
                                </p>
                                <a href={PORTFOLIO_DATA.profile.social.email} className="flex items-center gap-3 text-sm text-muted hover:text-[var(--color-brand-primary)] transition-colors">
                                    <Mail className="w-4 h-4" /> {PORTFOLIO_DATA.profile.social.email.replace("mailto:", "")}
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.phone} className="flex items-center gap-3 text-sm text-muted hover:text-[var(--color-brand-primary)] transition-colors">
                                    <Phone className="w-4 h-4" /> {PORTFOLIO_DATA.profile.social.phoneDisplay}
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-[var(--color-brand-primary)] transition-colors">
                                    <Github className="w-4 h-4" /> github.com/Harish-K000
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-[var(--color-brand-primary)] transition-colors">
                                    <Linkedin className="w-4 h-4" /> linkedin.com/in/harish-kannan-95811918b
                                </a>
                                <a href="/resume.pdf" download className="flex items-center gap-3 text-sm text-muted hover:text-[var(--color-brand-primary)] transition-colors">
                                    <Download className="w-4 h-4" /> Download Resume
                                </a>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="stone-card p-6 md:p-8 h-full">
                            <ContactForm />
                        </div>
                    </FadeIn>
                </div>
            </Section>
        </div>
    );
}

"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Phone, LayoutTemplate, Code2, Server, Database, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { PORTFOLIO_DATA, type ProjectItem } from "@/data/portfolio";
import { skills } from "@/data/skills";
import ContactForm from "@/components/ui/ContactForm";
import CitySkyline from "@/components/ui/CitySkyline";
import { useTilt } from "@/components/ui/useTilt";

// Tech Stack panel colors — keyed to the category names in src/data/skills.ts
const CATEGORY_COLORS: Record<string, string> = {
    "Programming Languages": "var(--color-cat-languages)",
    "Frontend Technologies": "var(--color-cat-frontend)",
    "Backend Technologies": "var(--color-cat-backend)",
    Databases: "var(--color-cat-data)",
    "Cloud & DevOps": "var(--color-cat-cloud)",
    "AI & Generative AI": "var(--color-cat-ai)",
    "Software Engineering": "var(--color-cat-architecture)",
    "Testing & Automation": "var(--color-cat-testing)",
    "Tools & Collaboration": "var(--color-cat-tools)",
};

// Experience timeline accent cycle — independent of the Tech Stack categories above.
const EXPERIENCE_ACCENT_CYCLE = [
    "var(--color-cat-frontend)",
    "var(--color-cat-backend)",
    "var(--color-cat-cloud)",
    "var(--color-cat-languages)",
];

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
}: {
    eyebrow: string;
    title: ReactNode;
    subtitle: string;
    accent?: string;
}) {
    return (
        <FadeIn className="max-w-2xl mx-auto text-center mb-16">
            <p className="eyebrow-mono mb-4" style={{ color: accent }}>
                // {eyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
            <p className="text-muted leading-relaxed">{subtitle}</p>
        </FadeIn>
    );
}

// A thin ink bar that grows taller with each career chapter — the
// "small to senior" visual thread running down the experience timeline.
function GrowthMarker({ growth }: { growth: number }) {
    const height = 28 + growth * 56;
    return (
        <div className="hidden sm:flex flex-col items-center justify-end w-10 shrink-0" aria-hidden="true">
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="w-[6px] rounded-full bg-gradient-to-t from-cyan-400 to-white origin-bottom"
            />
            <div className="mt-2 h-2 w-2 rounded-full bg-cyan-400/60" />
        </div>
    );
}

function StoryChapter({
    id,
    eyebrow,
    title,
    timeline,
    bullets,
    accentColor,
    growth = 0,
}: {
    id: string;
    eyebrow: string;
    title: string;
    timeline: string;
    bullets: string[];
    accentColor: string;
    growth?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.02]);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.9], [0, 0.4, 0]);

    return (
        <section id={id} ref={ref} className="relative min-h-screen flex items-center px-6">
            <motion.div
                style={{ opacity: glowOpacity, scale }}
                className="absolute -top-24 left-10 h-72 w-72 rounded-full blur-[120px]"
                aria-hidden="true"
            >
                <div className="w-full h-full rounded-full" style={{ background: accentColor, opacity: 0.18 }} />
            </motion.div>
            <div className="relative z-10 max-w-6xl mx-auto w-full flex gap-6">
                <GrowthMarker growth={growth} />
                <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] flex-1">
                    <motion.div style={{ opacity, y }} className="space-y-5">
                        <p className="eyebrow-mono" style={{ color: accentColor }}>// {eyebrow}</p>
                        <h3 className="text-4xl md:text-5xl font-semibold leading-tight">{title}</h3>
                        <p className="font-mono-ui text-sm uppercase tracking-[0.15em]" style={{ color: accentColor }}>{timeline}</p>
                    </motion.div>
                    <motion.div style={{ opacity, y }} className="terminal-card p-6 md:p-8">
                        <ul className="space-y-4 text-muted leading-relaxed">
                            {bullets.map((bullet, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="mt-2 h-2 w-2 rounded-full shrink-0" style={{ background: accentColor }} />
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

const PIPELINE_STEPS = [
    {
        icon: LayoutTemplate,
        label: "Design & Architecture",
        color: "var(--color-cat-frontend)",
        copy: "System design, API contracts, and infrastructure planning — solving the right problem before writing code.",
    },
    {
        icon: Code2,
        label: "React + TypeScript",
        color: "var(--color-cat-frontend)",
        copy: "Component architecture, state management, and type-safe interfaces for fast, accessible UI.",
    },
    {
        icon: Server,
        label: "Java + Spring Boot",
        color: "var(--color-cat-backend)",
        copy: "Domain-driven backend services, REST APIs, and resilient retry/error-handling logic.",
    },
    {
        icon: Database,
        label: "PostgreSQL + AWS",
        color: "var(--color-cat-cloud)",
        copy: "Schema design, query tuning, and cloud deployment pipelines that hold up under real traffic.",
    },
];

const MotionLink = motion.create(Link);

function PipelineCard({ step, index }: { step: (typeof PIPELINE_STEPS)[number]; index: number }) {
    const tilt = useTilt();
    return (
        <motion.div
            ref={tilt.ref as React.RefObject<HTMLDivElement>}
            {...tilt.handlers}
            style={tilt.style}
            className="terminal-card p-6 h-full"
        >
            <div className="flex items-center justify-between mb-5">
                <span
                    className="flex items-center justify-center w-10 h-10 rounded-md"
                    style={{ background: `${step.color}1a`, color: step.color }}
                >
                    <step.icon className="w-5 h-5" />
                </span>
                <span className="font-mono-ui text-xs text-muted">{String(index + 1).padStart(2, "0")} / 04</span>
            </div>
            <h3 className="font-semibold mb-2">{step.label}</h3>
            <p className="text-sm text-muted leading-relaxed">{step.copy}</p>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ opacity: tilt.glareOpacity, background: tilt.glareBackground }}
            />
        </motion.div>
    );
}

function ProjectCard({ proj, index }: { proj: ProjectItem; index: number }) {
    const tilt = useTilt();
    return (
        <MotionLink
            href={`/projects/${proj.id}`}
            ref={tilt.ref as React.RefObject<HTMLAnchorElement>}
            {...tilt.handlers}
            style={tilt.style}
            className="terminal-card block h-full p-6 flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <span className="font-mono-ui text-xs text-cyan-400">{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight className="w-4 h-4 text-muted" />
            </div>
            <h3 className="text-lg font-bold mb-1">{proj.title}</h3>
            <p className="font-mono-ui text-xs text-muted mb-4">{proj.subtitle}</p>
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

function TechPanel({ category, items, color }: { category: string; items: string[]; color: string }) {
    const tilt = useTilt();
    return (
        <motion.div
            ref={tilt.ref as React.RefObject<HTMLDivElement>}
            {...tilt.handlers}
            style={tilt.style}
            className="terminal-card p-6 h-full"
        >
            <h3 className="font-mono-ui text-sm font-semibold mb-4" style={{ color }}>
                {category}
            </h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <span
                        key={item}
                        className="text-xs font-mono-ui px-3 py-1.5 rounded border"
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
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.2 });

    const pipelineStats = [
        { value: `${PORTFOLIO_DATA.experience.length}`, label: "Roles Held" },
        { value: `${PORTFOLIO_DATA.projects.length}`, label: "Featured Projects" },
        { value: `${PORTFOLIO_DATA.techStack.length}+`, label: "Technologies" },
        { value: `${skills.length}`, label: "Skill Domains" },
    ];

    return (
        <div className="selection:bg-cyan-500/30">
            <motion.div
                style={{ scaleX: progress }}
                className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-cyan-400"
            />

            {/* ── Hero ───────────────────────────────────────────── */}
            <motion.div
                id="hero-section"
                className="relative h-screen min-h-[640px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <div className="absolute inset-0 bg-[var(--color-brand-bg)] overflow-hidden">
                    <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 0.96 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <CitySkyline />
                    </motion.div>
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, rgb(var(--color-brand-bg-rgb) / 0.95) 0%, rgb(var(--color-brand-bg-rgb) / 0.65) 45%, rgb(var(--color-brand-bg-rgb) / 0.15) 100%)",
                        }}
                    />
                </div>

                {/* Text content lives outside the overflow-hidden art layer so it
                    can never be silently clipped if copy runs long. */}
                <div className="absolute inset-0 z-20 h-full flex flex-col justify-center px-6 max-w-7xl mx-auto pointer-events-none">
                    <div className="max-w-2xl pointer-events-auto">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="eyebrow-mono flex items-center gap-2 mb-5"
                        >
                            <span className="status-dot" />
                            Available for new opportunities
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.0]"
                        >
                            HARISH
                            <br />
                            <span className="gradient-text">K.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85, duration: 0.8 }}
                            className="font-mono-ui text-lg md:text-xl text-cyan-400 mb-6"
                        >
                            {PORTFOLIO_DATA.profile.title}
                            <span className="typed-cursor h-5 align-middle" />
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-lg text-muted mb-10 leading-relaxed max-w-lg"
                        >
                            {PORTFOLIO_DATA.profile.tagline}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.15, duration: 0.8 }}
                            className="flex flex-wrap gap-4 mb-10"
                        >
                            <a href="#projects" className="wobble-hover inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-7 py-3 rounded-md transition-colors">
                                View Projects <ArrowUpRight className="w-4 h-4" />
                            </a>
                            <a href="#contact" className="wobble-hover font-mono-ui text-sm uppercase tracking-[0.15em] border border-[var(--color-brand-border)] hover:border-cyan-400/40 text-[var(--color-brand-text)] px-7 py-3 rounded-md transition-colors">
                                Get In Touch
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 0.8 }}
                            className="flex items-center gap-4"
                        >
                            <a href={PORTFOLIO_DATA.profile.social.github} target="_blank" rel="noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-cyan-400 hover:border-cyan-400/40 transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href={PORTFOLIO_DATA.profile.social.linkedin} target="_blank" rel="noreferrer"
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-cyan-400 hover:border-cyan-400/40 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href={PORTFOLIO_DATA.profile.social.email}
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-cyan-400 hover:border-cyan-400/40 transition-all">
                                <Mail className="w-4 h-4" />
                            </a>
                            <a href={PORTFOLIO_DATA.profile.social.phone}
                                className="flex items-center justify-center w-9 h-9 rounded-md border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-cyan-400 hover:border-cyan-400/40 transition-all">
                                <Phone className="w-4 h-4" />
                            </a>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 eyebrow-mono"
                >
                    <span>Scroll</span>
                    <motion.span
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="block h-8 w-[2px] bg-gradient-to-b from-cyan-400 to-transparent"
                    />
                </motion.div>
            </motion.div>

            {/* ── Pipeline / Journey ─────────────────────────────── */}
            <Section id="pipeline">
                <SectionHeading
                    eyebrow="PROCESS.PIPELINE"
                    title={<>Full Stack <span className="gradient-text">Journey</span></>}
                    subtitle="End-to-end engineering from whiteboard to production — every layer of the stack."
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {PIPELINE_STEPS.map((step, i) => (
                        <FadeIn key={step.label} delay={i * 0.08}>
                            <PipelineCard step={step} index={i} />
                        </FadeIn>
                    ))}
                </div>
                <FadeIn delay={0.2}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {pipelineStats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl md:text-4xl font-bold text-cyan-400">{stat.value}</p>
                                <p className="text-xs uppercase tracking-[0.15em] text-muted mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </Section>

            {/* ── Experience ──────────────────────────────────────── */}
            <section id="experience" className="relative">
                <div className="max-w-6xl mx-auto px-6 pt-20">
                    <SectionHeading
                        eyebrow="CAREER.TIMELINE"
                        title="Professional Experience"
                        subtitle="The chapters that shaped my approach to research, engineering, and product delivery — each one built on the last."
                    />
                </div>

                {PORTFOLIO_DATA.experience.map((job, index) => (
                    <StoryChapter
                        key={job.id}
                        id={`chapter-${job.id}`}
                        eyebrow={`Chapter ${index + 1}`}
                        title={`${job.role} at ${job.company}`}
                        timeline={job.period}
                        bullets={job.description}
                        accentColor={EXPERIENCE_ACCENT_CYCLE[index % EXPERIENCE_ACCENT_CYCLE.length]}
                        growth={index / Math.max(PORTFOLIO_DATA.experience.length - 1, 1)}
                    />
                ))}
            </section>

            {/* ── Education ───────────────────────────────────────── */}
            <Section id="education">
                <SectionHeading
                    eyebrow="EDUCATION.LOG"
                    title="Education"
                    subtitle="The degrees behind the stack."
                />
                <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {PORTFOLIO_DATA.education.map((edu, i) => (
                        <FadeIn key={edu.id} delay={i * 0.08}>
                            <div className="terminal-card p-6 h-full">
                                <p className="font-mono-ui text-xs uppercase tracking-[0.15em] text-cyan-400 mb-2">{edu.period}</p>
                                <h3 className="font-semibold mb-1">{edu.degree}</h3>
                                <p className="text-sm text-muted mb-3">{edu.field}</p>
                                <p className="text-sm text-[var(--color-brand-text)]">{edu.school}</p>
                                <p className="text-xs text-muted">{edu.location}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>

            {/* ── Projects ────────────────────────────────────────── */}
            <Section id="projects">
                <SectionHeading
                    eyebrow="PORTFOLIO.SHOWCASE"
                    title="Projects"
                    subtitle="Selected work — each one a different problem, a different scale."
                />
                <div className="grid md:grid-cols-3 gap-6">
                    {PORTFOLIO_DATA.projects.map((proj, index) => (
                        <FadeIn key={proj.id} delay={index * 0.1} className="h-full">
                            <ProjectCard proj={proj} index={index} />
                        </FadeIn>
                    ))}
                </div>
                <FadeIn delay={0.2} className="text-center mt-10">
                    <Link href="/projects" className="font-mono-ui text-sm text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5">
                        View all repositories <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </FadeIn>
            </Section>

            {/* ── Tech Stack ──────────────────────────────────────── */}
            <Section id="skills">
                <SectionHeading
                    eyebrow="TECH.ECOSYSTEM"
                    title="Technology Stack"
                    subtitle="The tools I reach for — grouped by where they sit in the stack."
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((group, i) => {
                        const color = CATEGORY_COLORS[group.category] ?? "var(--color-brand-primary)";
                        return (
                            <FadeIn key={group.category} delay={i * 0.08}>
                                <TechPanel category={group.category} items={group.items} color={color} />
                            </FadeIn>
                        );
                    })}
                </div>
            </Section>

            {/* ── Contact ─────────────────────────────────────────── */}
            <Section id="contact" className="mb-10">
                <SectionHeading
                    eyebrow="CONTACT.INITIALIZE"
                    title="Open Channel"
                    subtitle="Available for freelance projects, full-time roles, and interesting problems. Let's talk."
                />
                <div className="grid lg:grid-cols-2 gap-8">
                    <FadeIn>
                        <div className="terminal-window h-full">
                            <div className="terminal-window-bar">
                                <span className="terminal-dot bg-red-500/70" />
                                <span className="terminal-dot bg-yellow-500/70" />
                                <span className="terminal-dot bg-green-500/70" />
                                <span className="font-mono-ui text-xs text-muted ml-2">harish-k.terminal</span>
                            </div>
                            <div className="p-6 font-mono-ui text-sm space-y-2">
                                <p className="text-muted">$ Initializing secure channel...</p>
                                <p className="text-muted">$ Establishing connection to {PORTFOLIO_DATA.profile.social.email.replace("mailto:", "")}</p>
                                <p className="text-cyan-400">$ Ready to receive incoming transmissions.</p>
                                <p className="text-cyan-400">$ <span className="typed-cursor h-4 align-middle" /></p>
                            </div>
                            <div className="px-6 pb-6 space-y-3 border-t border-[var(--color-border-subtle)] pt-5">
                                <a href={PORTFOLIO_DATA.profile.social.email} className="flex items-center gap-3 text-sm text-muted hover:text-cyan-400 transition-colors">
                                    <Mail className="w-4 h-4" /> {PORTFOLIO_DATA.profile.social.email.replace("mailto:", "")}
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.phone} className="flex items-center gap-3 text-sm text-muted hover:text-cyan-400 transition-colors">
                                    <Phone className="w-4 h-4" /> {PORTFOLIO_DATA.profile.social.phoneDisplay}
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-cyan-400 transition-colors">
                                    <Github className="w-4 h-4" /> github.com/harishkannan
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-cyan-400 transition-colors">
                                    <Linkedin className="w-4 h-4" /> linkedin.com/in/harish-kannan-95811918b
                                </a>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="terminal-card p-6 md:p-8 h-full">
                            <ContactForm />
                        </div>
                    </FadeIn>
                </div>
            </Section>
        </div>
    );
}

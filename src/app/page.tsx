"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ContactForm from "@/components/ui/ContactForm";
import LogoLoop from "@/components/ui/LogoLoop";

const SequenceHero = dynamic(() => import("@/components/cinematic/SequenceHero"), { ssr: false });

function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
    return (
        <section id={id} className={`relative px-6 py-20 max-w-7xl mx-auto ${className}`}>
            {children}
        </section>
    );
}

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// A simple ink silhouette that grows taller with each career chapter —
// the "small to adult" visual thread running down the timeline.
function GrowthMarker({ growth }: { growth: number }) {
    const height = 28 + growth * 56; // px, smallest chapter ~28px, latest ~84px
    return (
        <div className="hidden sm:flex flex-col items-center justify-end w-10 shrink-0" aria-hidden="true">
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="w-[6px] rounded-full bg-gradient-to-t from-red-500 to-white origin-bottom"
            />
            <div className="mt-2 h-2 w-2 rounded-full bg-[var(--color-ink-line)]" />
        </div>
    );
}

function StoryChapter({
    id,
    eyebrow,
    title,
    timeline,
    bullets,
    accent = "cyan",
    growth = 0,
}: {
    id: string;
    eyebrow: string;
    title: string;
    timeline: string;
    bullets: string[];
    accent?: "cyan" | "violet" | "emerald";
    growth?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.02]);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.9], [0, 0.5, 0]);

    const accentClass =
        accent === "violet"
            ? "from-white/20"
            : accent === "emerald"
                ? "from-white/20"
                : "from-red-500/20";

    return (
        <section id={id} ref={ref} className="relative min-h-screen flex items-center px-6">
            <motion.div
                style={{ opacity: glowOpacity, scale }}
                className={`absolute -top-24 left-10 h-72 w-72 rounded-full blur-[120px] ${accentClass} to-transparent bg-gradient-to-br`}
            />
            <div className="relative z-10 max-w-6xl mx-auto w-full flex gap-6">
                <GrowthMarker growth={growth} />
                <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] flex-1">
                <motion.div style={{ opacity, y }} className="space-y-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</p>
                    <h3 className="text-4xl md:text-5xl font-semibold leading-tight">{title}</h3>
                    <p className="text-red-500 text-sm uppercase tracking-[0.2em]">{timeline}</p>
                </motion.div>
                <motion.div style={{ opacity, y }} className="glass-panel p-6 md:p-8">
                    <ul className="space-y-4 text-muted leading-relaxed">
                        {bullets.map((bullet, index) => (
                            <li key={index} className="flex gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500/80" />
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

export default function Home() {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.2 });
    const techLogos = PORTFOLIO_DATA.techStack.map((tech) => ({
        node: (
            <span className="logoloop__text" style={{ color: tech.color }}>
                {tech.key}
            </span>
        ),
        title: tech.key,
    }));

    return (
        <div className="selection:bg-red-600/30">
            <motion.div
                style={{ scaleX: progress }}
                className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-red-500"
            />
            <div id="hero-section" className="relative h-[260vh] min-h-[400px]">
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                    <div className="absolute inset-0 z-0">
                        <SequenceHero />
                    </div>
                    <div className="absolute inset-0 hero-overlay z-10 pointer-events-none" />

                    <div className="relative z-20 h-full flex flex-col justify-center px-6 max-w-7xl mx-auto pointer-events-none">
                        <div className="max-w-2xl pointer-events-auto">
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="speech-bubble inline-block font-mono mb-4 text-xs uppercase tracking-[0.25em]"
                            >
                                eat(); sleep(); code(); repeat();
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
                            >
                                {PORTFOLIO_DATA.profile.name}
                                <br />
                                <span className="gradient-text">builds living systems</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                                className="text-xl text-muted mb-10 leading-relaxed max-w-lg"
                            >
                                {PORTFOLIO_DATA.profile.summary}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.8 }}
                                className="flex flex-wrap gap-4 mb-10"
                            >
                                <a href="#projects" className="wobble-hover bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-colors">
                                    View Projects
                                </a>
                                <a href="#contact" className="wobble-hover border-2 border-[var(--color-ink-line)] text-[var(--color-brand-text)] px-8 py-3 rounded-full transition-colors">
                                    Contact
                                </a>
                            </motion.div>

                            {/* Social links */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.3, duration: 0.8 }}
                                className="flex items-center gap-4"
                            >
                                <a href={PORTFOLIO_DATA.profile.social.github} target="_blank" rel="noreferrer"
                                    className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-red-500 hover:border-red-500/40 transition-all">
                                    <Github className="w-4 h-4" />
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.linkedin} target="_blank" rel="noreferrer"
                                    className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-red-500 hover:border-red-500/40 transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href={PORTFOLIO_DATA.profile.social.email}
                                    className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-red-500 hover:border-red-500/40 transition-all">
                                    <Mail className="w-4 h-4" />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted"
                    >
                        <span>Scroll</span>
                        <motion.span
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            className="block h-8 w-[2px] bg-gradient-to-b from-red-500 to-transparent"
                        />
                    </motion.div>
                </div>
            </div>

            <Section id="skills" className="pt-12 pb-8">
                <div className="flex items-end justify-between flex-wrap gap-4">
                    <FadeIn>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted">Stack</p>
                            <h2 className="text-3xl md:text-4xl font-bold">Tools I ship with</h2>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="text-muted max-w-lg">
                            A constantly evolving toolkit tuned for performance, clarity, and cinematic delivery.
                        </p>
                    </FadeIn>
                </div>
                <div className="mt-10">
                    <LogoLoop
                        logos={techLogos}
                        speed={80}
                        direction="left"
                        logoHeight={22}
                        gap={28}
                        hoverSpeed={20}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="var(--color-brand-bg)"
                        ariaLabel="Technology stack"
                    />
                </div>
            </Section>

            <section id="experience" className="relative">
                <div className="max-w-6xl mx-auto px-6 pt-20">
                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted">Story</p>
                            <h2 className="text-4xl md:text-5xl font-bold">A timeline of depth.</h2>
                        </div>
                        <p className="text-muted max-w-xl">
                            Scroll through the chapters that shaped my approach to research, engineering, and product delivery.
                        </p>
                    </div>
                </div>

                {PORTFOLIO_DATA.experience.map((job, index) => (
                    <StoryChapter
                        key={job.id}
                        id={`chapter-${job.id}`}
                        eyebrow={`Chapter ${index + 1}`}
                        title={`${job.role} at ${job.company}`}
                        timeline={job.period}
                        bullets={job.description}
                        accent={index % 3 === 0 ? "cyan" : index % 3 === 1 ? "violet" : "emerald"}
                        growth={index / Math.max(PORTFOLIO_DATA.experience.length - 1, 1)}
                    />
                ))}
            </section>

            <Section id="projects">
                <FadeIn>
                    <h2 className="text-3xl font-bold mb-10 border-l-4 border-white pl-4">Featured Projects</h2>
                </FadeIn>
                <div className="grid md:grid-cols-2 gap-8">
                    {PORTFOLIO_DATA.projects.map((proj, index) => (
                        <FadeIn key={proj.id} delay={index * 0.1} className="h-full">
                            <Link href={`/projects/${proj.id}`} className="ink-panel ink-panel-hover block group h-full p-6">
                                <motion.div
                                    whileHover={{ y: -6, rotate: -1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-red-400 transition-colors">{proj.title}</h3>
                                <p className="text-sm text-muted mb-4">{proj.subtitle}</p>
                                <p className="text-muted mb-6 line-clamp-2">{proj.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {proj.techStack.map(tag => (
                                        <span key={tag} className="text-xs chip-surface px-3 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex gap-4 text-sm font-medium items-center text-red-400 group-hover:translate-x-1 transition-transform">
                                    View Case Study →
                                </div>
                                </motion.div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </Section>

            <Section id="contact" className="mb-20">
                <FadeIn>
                    <div className="contact-surface p-8 md:p-14 rounded-3xl relative overflow-hidden">
                        {/* Background glows */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-3">Contact</p>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to work together?</h2>
                                <p className="text-muted leading-relaxed mb-6">
                                    I&apos;m currently available for freelance projects and full-time roles.
                                    Let&apos;s build something scalable and cinematic.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a href={PORTFOLIO_DATA.profile.social.github} target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-muted)] hover:text-red-500 border border-[var(--color-brand-border)] hover:border-red-500/40 px-4 py-2 rounded-full transition-all">
                                        <Github className="w-3.5 h-3.5" /> GitHub
                                    </a>
                                    <a href={PORTFOLIO_DATA.profile.social.linkedin} target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-muted)] hover:text-red-500 border border-[var(--color-brand-border)] hover:border-red-500/40 px-4 py-2 rounded-full transition-all">
                                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                </div>
                            </div>
                            <div className="glass-panel p-6">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </Section>

        </div>
    );
}

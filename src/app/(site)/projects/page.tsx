"use client";

import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ParallaxBackdrop from "@/components/ui/ParallaxBackdrop";
import { Reveal } from "@/components/ui/MotionPrimitives";

const accentBorders = [
    "hover:border-gold-500/50",
    "hover:border-rune-500/50",
    "hover:border-ember-500/50",
];

const accentTexts = [
    "text-gold-400",
    "text-rune-400",
    "text-ember-400",
];

const accentGlows = [
    "from-gold-500/10",
    "from-rune-500/10",
    "from-ember-500/10",
];

export default function ProjectsPage() {
    return (
        <div className="relative isolate overflow-hidden">
            <ParallaxBackdrop accent="gold" />
            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
            {/* Header */}
            <Reveal>
                <p className="text-sm uppercase tracking-[0.3em] text-gold-400 mb-3">Work</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">Case Studies</h1>
                    <p className="text-[var(--color-brand-muted)] max-w-md text-balance">
                        Deep dives into product builds, research, and experimental launches.
                    </p>
                </div>
            </Reveal>

            {/* Projects grid */}
            <div className="grid gap-8 md:grid-cols-2">
                {PORTFOLIO_DATA.projects.map((project, index) => {
                    const borderClass = accentBorders[index % 3];
                    const textClass = accentTexts[index % 3];
                    const glowClass = accentGlows[index % 3];

                    return (
                        <Reveal key={project.id} delay={index * 0.1} className="h-full">
                            <Link
                                href={`/projects/${project.id}`}
                                id={`project-card-${project.id}`}
                                className={`depth-card group block h-full relative overflow-hidden rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)] p-6 md:p-8 ${borderClass} transition-all duration-300 hover:bg-[var(--color-surface-2)]`}
                            >
                                {/* Gradient glow on hover */}
                                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${glowClass} to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl`} />

                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="relative z-10 space-y-4 h-full flex flex-col"
                                >
                                    {/* Number badge */}
                                    <span className={`text-xs font-mono ${textClass} opacity-50`}>
                                        0{index + 1}
                                    </span>

                                    <div className="flex-1">
                                        <h2 className="font-display text-2xl font-bold mb-1 transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-sm text-[var(--color-brand-muted)] mb-4">{project.subtitle}</p>
                                        <p className="text-[var(--color-brand-muted)] leading-relaxed line-clamp-3 mb-6">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Tech tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.techStack.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-3 py-1 rounded-full border border-[var(--color-brand-border)] bg-[var(--color-brand-panel)] text-[var(--color-brand-muted)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Metrics */}
                                    {project.metrics && project.metrics.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {project.metrics.map((m) => (
                                                <span key={m} className={`text-xs font-medium ${textClass}`}>
                                                    ✦ {m}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className={`flex items-center gap-1 text-sm font-semibold ${textClass} group-hover:translate-x-1 transition-transform`}>
                                        View Case Study <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            </Link>
                        </Reveal>
                    );
                })}
            </div>

            {/* CTA */}
            <Reveal delay={0.3}>
                <div className="mt-16 text-center">
                    <p className="text-[var(--color-brand-muted)] mb-4">Looking to see more or collaborate?</p>
                    <div className="flex justify-center gap-4">
                        <a
                            href={PORTFOLIO_DATA.profile.social.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] px-6 py-2.5 rounded-full transition-all text-sm"
                        >
                            GitHub <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold px-6 py-2.5 rounded-full transition-all text-sm"
                        >
                            Work Together
                        </Link>
                    </div>
                </div>
            </Reveal>
            </div>
        </div>
    );
}

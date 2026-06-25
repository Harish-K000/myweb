"use client";

import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, TrendingUp } from "lucide-react";
import type { ProjectItem } from "@/data/portfolio";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ParallaxBackdrop from "@/components/ui/ParallaxBackdrop";
import { Reveal } from "@/components/ui/MotionPrimitives";

export default function ProjectDetailClient({ project }: { project: ProjectItem }) {
    const projectIndex = PORTFOLIO_DATA.projects.findIndex((p) => p.id === project.id);
    const accent = projectIndex % 3 === 0 ? "gold" : projectIndex % 3 === 1 ? "rune" : "ember";

    const accentColor = accent === "gold" ? "#d6a84f" : accent === "rune" ? "#60a5fa" : "#ff6a2a";
    const accentBg = accent === "gold"
        ? "bg-gold-500/10 border-gold-500/20"
        : accent === "rune"
            ? "bg-rune-500/10 border-rune-500/20"
            : "bg-ember-500/10 border-ember-500/20";
    const accentText = accent === "gold" ? "text-gold-400" : accent === "rune" ? "text-rune-400" : "text-ember-400";
    const accentBtn = accent === "gold"
        ? "bg-gold-500 hover:bg-gold-400"
        : accent === "rune"
            ? "bg-rune-500 hover:bg-rune-400"
            : "bg-ember-500 hover:bg-ember-400";
    const backdropAccent = accent === "rune" ? "rune" : accent === "ember" ? "ember" : "gold";

    return (
        <div className="relative isolate overflow-hidden">
            <ParallaxBackdrop accent={backdropAccent} density="quiet" />
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
            {/* Back button */}
            <Reveal>
                <Link
                    href="/projects"
                    className={`inline-flex items-center gap-2 text-sm ${accentText} hover:opacity-80 transition-opacity mb-10`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    All Projects
                </Link>
            </Reveal>

            {/* Header */}
            <Reveal delay={0.05}>
                <p className={`text-sm uppercase tracking-[0.3em] ${accentText} mb-3`}>Case Study</p>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{project.title}</h1>
                <p className="text-xl text-[var(--color-brand-muted)] mb-8">{project.subtitle}</p>
            </Reveal>

            {/* Tags & Links row */}
            <Reveal delay={0.1}>
                <div className="flex flex-wrap items-center gap-3 mb-12">
                    {project.techStack.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-brand-border)] bg-[var(--color-brand-panel)] text-[var(--color-brand-muted)]"
                        >
                            {tag}
                        </span>
                    ))}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] border border-[var(--color-brand-border)] px-3 py-1.5 rounded-full transition-colors ml-auto"
                        >
                            <Github className="w-3 h-3" /> Repo
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-1.5 text-xs text-black ${accentBtn} font-medium px-3 py-1.5 rounded-full transition-colors`}
                        >
                            <ExternalLink className="w-3 h-3" /> Live Site
                        </a>
                    )}
                </div>
            </Reveal>

            {/* Metrics highlight */}
            {project.metrics && project.metrics.length > 0 && (
                <Reveal delay={0.15}>
                    <div className={`depth-card ${accentBg} border rounded-2xl p-6 mb-10`}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className={`w-5 h-5 ${accentText}`} />
                            <h2 className={`text-sm font-semibold uppercase tracking-[0.2em] ${accentText}`}>Key Outcomes</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {project.metrics.map((m) => (
                                <div key={m} className="flex items-center gap-2 text-[var(--color-brand-text)]">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
                                    <span className="font-medium">{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            )}

            {/* Overview */}
            <Reveal delay={0.2}>
                <div className="glass-panel depth-card p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-3">Overview</h2>
                    <p className="text-[var(--color-brand-muted)] leading-relaxed text-lg">{project.description}</p>
                </div>
            </Reveal>

            {/* Problem / Solution */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Reveal delay={0.25}>
                    <div className="glass-panel depth-card p-6 md:p-8 h-full">
                        <h2 className="text-lg font-semibold mb-3">The Problem</h2>
                        <p className="text-[var(--color-brand-muted)] leading-relaxed">{project.problem}</p>
                    </div>
                </Reveal>
                <Reveal delay={0.3}>
                    <div className="glass-panel depth-card p-6 md:p-8 h-full">
                        <h2 className="text-lg font-semibold mb-3">The Solution</h2>
                        <p className="text-[var(--color-brand-muted)] leading-relaxed">{project.solution}</p>
                    </div>
                </Reveal>
            </div>

            {/* CTA */}
            <Reveal delay={0.35}>
                <div className="flex flex-wrap gap-4 mt-12">
                    <Link
                        href="/contact"
                        className={`inline-flex items-center gap-2 ${accentBtn} text-black font-bold px-8 py-3 rounded-full transition-all text-sm`}
                    >
                        Discuss This Project
                    </Link>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] px-8 py-3 rounded-full transition-all text-sm"
                    >
                        ← All Projects
                    </Link>
                </div>
            </Reveal>
            </div>
        </div>
    );
}

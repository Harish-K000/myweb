"use client";

import { PORTFOLIO_DATA } from "@/data/portfolio";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const accentColors: Record<number, string> = { 0: "cyan", 1: "violet", 2: "emerald", 3: "cyan" };
const dotColors: Record<string, string> = { cyan: "bg-cyan-400", violet: "bg-violet-400", emerald: "bg-emerald-400" };
const labelColors: Record<string, string> = { cyan: "text-cyan-400", violet: "text-violet-400", emerald: "text-emerald-400" };
const borderColors: Record<string, string> = { cyan: "border-cyan-500/20", violet: "border-violet-500/20", emerald: "border-emerald-500/20" };

export default function ResumePage() {
    return (
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-20 space-y-16">
            {/* Header */}
            <FadeIn>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-3">Resume</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">{PORTFOLIO_DATA.profile.name}</h1>
                        <p className="text-xl text-[var(--color-brand-muted)] mt-2">{PORTFOLIO_DATA.profile.title}</p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href="/resume.pdf"
                            download
                            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-full transition-all text-sm"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] px-6 py-3 rounded-full transition-all text-sm"
                        >
                            Contact Me
                        </Link>
                    </div>
                </div>
                <p className="text-[var(--color-brand-muted)] max-w-2xl leading-relaxed">{PORTFOLIO_DATA.profile.summary}</p>
            </FadeIn>

            {/* Experience */}
            <section>
                <FadeIn>
                    <div className="mb-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-brand-muted)] mb-2">Career</p>
                        <h2 className="text-3xl font-bold">Experience</h2>
                    </div>
                </FadeIn>
                <div className="space-y-6">
                    {PORTFOLIO_DATA.experience.map((job, index) => {
                        const accent = accentColors[index % 4];
                        return (
                            <FadeIn key={job.id} delay={index * 0.08}>
                                <div className={`glass-panel p-6 md:p-8 border-l-4 ${borderColors[accent]}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold">{job.role}</h3>
                                            <p className={`text-sm ${labelColors[accent]} mt-0.5`}>{job.company}</p>
                                        </div>
                                        <span className="text-sm text-[var(--color-brand-muted)] whitespace-nowrap border border-[var(--color-brand-border)] px-3 py-1 rounded-full">
                                            {job.period}
                                        </span>
                                    </div>
                                    <ul className="space-y-2 mt-4">
                                        {job.description.map((desc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-[var(--color-brand-muted)] leading-relaxed">
                                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[accent]}`} />
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </section>

            {/* Skills */}
            <section>
                <FadeIn>
                    <div className="mb-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-brand-muted)] mb-2">Stack</p>
                        <h2 className="text-3xl font-bold">Technical Skills</h2>
                    </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                    <div className="glass-panel p-6 md:p-8">
                        <div className="flex flex-wrap gap-3">
                            {PORTFOLIO_DATA.techStack.map((tech) => (
                                <span
                                    key={tech.key}
                                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-[var(--color-brand-border)] bg-[var(--color-surface-1)] font-medium transition-all hover:scale-105"
                                    style={{ color: tech.color }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tech.color }} />
                                    {tech.key}
                                </span>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* CTA */}
            <FadeIn delay={0.2}>
                <div className="text-center p-8 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)]">
                    <h3 className="text-2xl font-bold mb-2">Ready to connect?</h3>
                    <p className="text-[var(--color-brand-muted)] mb-6">
                        Open to senior full-stack roles and research positions. Let&apos;s talk.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-full transition-all"
                    >
                        Get in Touch <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            </FadeIn>
        </div>
    );
}

"use client";

import { PORTFOLIO_DATA } from "@/data/portfolio";
import Link from "next/link";
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import ParallaxBackdrop from "@/components/ui/ParallaxBackdrop";
import { Reveal } from "@/components/ui/MotionPrimitives";

const accentColors: Record<number, string> = {
    0: "gold",
    1: "rune",
    2: "ember",
    3: "gold",
};

const dotColors: Record<string, string> = {
    gold: "bg-gold-400",
    rune: "bg-rune-400",
    ember: "bg-ember-400",
};

const borderColors: Record<string, string> = {
    gold: "border-gold-500/30",
    rune: "border-rune-500/30",
    ember: "border-ember-500/30",
};

const labelColors: Record<string, string> = {
    gold: "text-gold-400",
    rune: "text-rune-400",
    ember: "text-ember-400",
};

export default function AboutPage() {
    const socials = [
        { label: "GitHub", href: PORTFOLIO_DATA.profile.social.github, icon: Github, external: true },
        { label: "LinkedIn", href: PORTFOLIO_DATA.profile.social.linkedin, icon: Linkedin, external: true },
        { label: "Email", href: PORTFOLIO_DATA.profile.social.email, icon: Mail, external: false },
    ];

    return (
        <div className="relative isolate overflow-hidden">
            <ParallaxBackdrop accent="gold" />
            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
            {/* Hero section */}
            <Reveal>
                <p className="text-sm uppercase tracking-[0.3em] text-gold-400 mb-3">About</p>
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    {PORTFOLIO_DATA.profile.name}
                </h1>
            </Reveal>

            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] items-start mt-8">
                <div className="space-y-5">
                    <Reveal delay={0.1}>
                        <p className="text-xl text-[var(--color-brand-muted)] leading-relaxed">
                            {PORTFOLIO_DATA.profile.summary}
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-[var(--color-brand-muted)] leading-relaxed">
                            I focus on building production systems that feel cinematic and reliable — from the first pixel
                            to the final deployment. My work blends product sense with engineering depth, helping teams ship
                            fast without breaking what matters.
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <p className="text-[var(--color-brand-muted)] leading-relaxed">
                            I completed my Master&apos;s in Applied Computing at Wilfrid Laurier University, where I conducted
                            IEEE-level research on federated learning for next-gen wireless networks.
                        </p>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <div className="flex flex-wrap gap-3 pt-4">
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold px-6 py-2.5 rounded-full transition-all text-sm"
                            >
                                View Projects <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border border-[var(--color-border-subtle)] hover:border-gold-400/40 text-[var(--color-brand-text)] px-6 py-2.5 rounded-full transition-all text-sm"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </Reveal>
                </div>

                {/* Info card */}
                <Reveal delay={0.15}>
                    <div className="glass-panel depth-card p-6 space-y-6 sticky top-24">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-brand-muted)] mb-1">Role</p>
                            <p className="text-lg font-semibold">{PORTFOLIO_DATA.profile.title}</p>
                        </div>
                        <div className="border-t border-[var(--color-brand-border)]" />
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-brand-muted)] mb-1">Focus</p>
                            <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed">
                                Full-stack engineering, cloud architecture, and applied AI.
                            </p>
                        </div>
                        <div className="border-t border-[var(--color-brand-border)]" />
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-brand-muted)] mb-2">Connect</p>
                            <div className="flex flex-col gap-2">
                                {socials.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target={s.external ? "_blank" : undefined}
                                            rel={s.external ? "noreferrer" : undefined}
                                            className="flex items-center gap-3 text-sm text-[var(--color-brand-muted)] hover:text-gold-400 transition-colors group"
                                        >
                                            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {s.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Experience timeline */}
            <section className="mt-24">
                <Reveal>
                    <div className="mb-10">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-brand-muted)] mb-2">Career</p>
                        <h2 className="text-3xl font-bold">Experience</h2>
                    </div>
                </Reveal>
                <div className="relative space-y-8 border-l-2 border-[var(--color-brand-border)] pl-8 ml-2">
                    {PORTFOLIO_DATA.experience.map((job, index) => {
                        const accent = accentColors[index % 4] || "gold";
                        return (
                            <Reveal key={job.id} delay={index * 0.1}>
                                <div className={`depth-card relative border ${borderColors[accent]} rounded-2xl p-6 bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] transition-colors`}>
                                    {/* Timeline dot */}
                                    <span className={`absolute -left-[2.85rem] top-6 w-4 h-4 rounded-full ${dotColors[accent]} border-4 border-[var(--color-brand-bg)]`} />

                                    <div className={`text-xs uppercase tracking-[0.2em] ${labelColors[accent]} mb-1`}>
                                        {job.company} · {job.period}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3">{job.role}</h3>
                                    <ul className="space-y-2">
                                        {job.description.map((desc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-[var(--color-brand-muted)] leading-relaxed">
                                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[accent]}`} />
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* Education */}
            <section className="mt-24">
                <Reveal>
                    <div className="mb-10">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-brand-muted)] mb-2">Academics</p>
                        <h2 className="text-3xl font-bold">Education</h2>
                    </div>
                </Reveal>
                <div className="grid sm:grid-cols-2 gap-6">
                    {PORTFOLIO_DATA.education.map((edu, index) => (
                        <Reveal key={edu.id} delay={index * 0.1}>
                            <div className="depth-card rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)] p-6 h-full">
                                <p className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-2">{edu.period}</p>
                                <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
                                <p className="text-sm text-[var(--color-brand-muted)] mb-3">{edu.field}</p>
                                <p className="text-sm">{edu.school}</p>
                                <p className="text-xs text-[var(--color-brand-muted)]">{edu.location}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mt-24">
                <Reveal>
                    <div className="mb-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-brand-muted)] mb-2">Stack</p>
                        <h2 className="text-3xl font-bold">Tools I Ship With</h2>
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <div className="flex flex-wrap gap-3">
                        {PORTFOLIO_DATA.techStack.map((tech) => (
                            <span
                                key={tech.key}
                                className="text-sm px-4 py-2 rounded-full border border-[var(--color-brand-border)] bg-[var(--color-surface-1)] font-medium"
                                style={{ color: tech.color }}
                            >
                                {tech.key}
                            </span>
                        ))}
                    </div>
                </Reveal>
            </section>
            </div>
        </div>
    );
}

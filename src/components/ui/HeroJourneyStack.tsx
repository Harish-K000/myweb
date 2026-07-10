"use client";

import { Compass, Layers, LayoutTemplate, ServerCog } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const BEATS = [
    {
        icon: Compass,
        eyebrow: "Dormant → Awake",
        title: "About",
        body: "Three years turning curiosity about how systems work into production software — APIs, web apps, and cloud-native services.",
        color: "var(--color-brand-primary)",
        href: "#about",
    },
    {
        icon: Layers,
        eyebrow: "Skill Modules",
        title: "Stack",
        body: "React, Python, Spring Boot, Azure, and the AI tooling that ties them together — grouped by how they actually get used.",
        color: "var(--color-cat-frontend)",
        href: "#grimoire",
    },
    {
        icon: LayoutTemplate,
        eyebrow: "Shipped Work",
        title: "Projects",
        body: "A focused set of product, automation, healthcare, and research systems with real constraints and measurable outcomes.",
        color: "var(--color-cat-ai)",
        href: "#quests",
    },
    {
        icon: ServerCog,
        eyebrow: "Open Channel",
        title: "Contact",
        body: "Available for full-time roles, freelance projects, and technical collaboration. Usually replies with next steps fast.",
        color: "var(--color-brand-accent)",
        href: "#portal",
    },
];

export default function HeroJourneyStack() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="relative py-20 md:py-28 overflow-hidden" aria-label="Journey overview" style={{ background: "#0a0807" }}>
            {/* A calmer, mostly-flat backdrop (faint texture + radial glow) rather
                than the busy masonry pattern used in the hero — neumorphic shadows
                only read against a quiet surface, they were getting lost on the
                checkerboard stone pattern. */}
            <div className="absolute inset-0 stone-archive-bg opacity-25 pointer-events-none" />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(214,168,79,0.07), transparent 70%)" }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(8,6,5,0.95) 0%, rgba(10,8,7,0.55) 14%, rgba(10,8,7,0.55) 86%, rgba(8,6,5,0.95) 100%)",
                }}
            />

            <div className="relative z-10 max-w-2xl mx-auto text-center px-6 mb-16 md:mb-20">
                <p className="eyebrow-rune mb-3" style={{ color: "var(--color-brand-primary)" }}>
                    The Journey
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#f8f1e3]">
                    From dormant to deployed
                </h2>
                <p className="mt-3 text-[#b8aa94] leading-relaxed">
                    Four beats of the same story below.
                </p>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Timeline spine — hidden on mobile where cards stack in one
                    column with the icon node taking its place on the left. */}
                <div
                    aria-hidden="true"
                    className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                    style={{ background: "linear-gradient(to bottom, transparent, rgba(214,168,79,0.3) 8%, rgba(214,168,79,0.3) 92%, transparent)" }}
                />

                <div className="flex flex-col gap-10 md:gap-4">
                    {BEATS.map(({ icon: Icon, eyebrow, title, body, color, href }, index) => {
                        const fromLeft = index % 2 === 0;
                        return (
                            <div key={title} className="relative md:flex md:items-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-20%" }}
                                    transition={{ duration: reduceMotion ? 0.3 : 0.5, delay: reduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-full"
                                    style={{
                                        background: "linear-gradient(145deg, var(--neu-base-light), var(--neu-base-dark))",
                                        boxShadow: `inset 3px 3px 8px var(--neu-shadow-dark), inset -3px -3px 8px var(--neu-shadow-light), 0 0 0 2px ${color}40, 0 0 24px ${color}33`,
                                    }}
                                >
                                    <Icon className="w-6 h-6" style={{ color }} />
                                </motion.div>

                                <motion.a
                                    href={href}
                                    initial={{ opacity: 0, x: reduceMotion ? 0 : fromLeft ? -40 : 40, y: 0 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true, margin: "-15%" }}
                                    transition={{ duration: reduceMotion ? 0.3 : 0.6, delay: reduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className={`relative flex flex-col ui-card ui-card-hover p-7 md:p-8 md:w-[calc(50%-3rem)] ${
                                        fromLeft ? "md:mr-auto" : "md:ml-auto"
                                    }`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-0 h-full w-1 rounded-l-[40px] md:hidden"
                                        style={{ background: color }}
                                    />
                                    <div className="flex items-center gap-3 mb-4 md:hidden">
                                        <span
                                            className="flex h-10 w-10 items-center justify-center rounded-full"
                                            style={{
                                                background: "linear-gradient(145deg, var(--neu-base-light), var(--neu-base-dark))",
                                                boxShadow: `inset 3px 3px 8px var(--neu-shadow-dark), inset -3px -3px 8px var(--neu-shadow-light), 0 0 0 1px ${color}40`,
                                            }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </span>
                                        <span className="text-xs uppercase tracking-[0.18em] font-display" style={{ color }}>
                                            {eyebrow}
                                        </span>
                                    </div>
                                    <span
                                        className="hidden md:inline-block text-xs uppercase tracking-[0.18em] font-display mb-2"
                                        style={{ color }}
                                    >
                                        {eyebrow}
                                    </span>
                                    <h3 className="font-display text-2xl md:text-3xl font-bold text-[#f8f1e3] mb-3">
                                        {title}
                                    </h3>
                                    <p className="text-[#b8aa94] leading-relaxed">{body}</p>
                                </motion.a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

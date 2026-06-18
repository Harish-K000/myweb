"use client";

import ContactForm from "@/components/ui/ContactForm";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, CalendarDays } from "lucide-react";

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

const contactChannels = [
    {
        icon: Mail,
        label: "Email",
        value: "harish.kannan.dev@gmail.com",
        href: PORTFOLIO_DATA.profile.social.email,
        external: false,
        description: "I respond within 48 hours",
    },
    {
        icon: Github,
        label: "GitHub",
        value: "github.com/harishkannan",
        href: PORTFOLIO_DATA.profile.social.github,
        external: true,
        description: "Open source & project work",
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        value: "linkedin.com/in/harish-kannan",
        href: PORTFOLIO_DATA.profile.social.linkedin,
        external: true,
        description: "Let's connect professionally",
    },
];

export default function ContactPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
            {/* Header */}
            <FadeIn>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-3">Contact</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Let&apos;s build something<br className="hidden md:block" /> cinematic.
                </h1>
                <p className="text-xl text-[var(--color-brand-muted)] max-w-lg mb-12 leading-relaxed">
                    Tell me about your goals, your timeline, and how I can help.
                    I&apos;m currently open to full-time roles and freelance projects.
                </p>
            </FadeIn>

            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
                {/* Left — contact info */}
                <div className="space-y-6">
                    <FadeIn delay={0.1}>
                        <div className="space-y-4">
                            {contactChannels.map((ch, i) => {
                                const Icon = ch.icon;
                                return (
                                    <a
                                        key={ch.label}
                                        href={ch.href}
                                        target={ch.external ? "_blank" : undefined}
                                        rel={ch.external ? "noreferrer" : undefined}
                                        className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] hover:border-cyan-500/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                                            <Icon className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-brand-text)]">{ch.label}</p>
                                            <p className="text-sm text-cyan-400">{ch.value}</p>
                                            <p className="text-xs text-[var(--color-brand-muted)] mt-0.5">{ch.description}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="p-4 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <p className="text-sm font-semibold text-emerald-400">Available for Opportunities</p>
                            </div>
                            <p className="text-sm text-[var(--color-brand-muted)]">
                                Open to senior full-stack roles and research positions. Remote-friendly.
                            </p>
                        </div>
                    </FadeIn>
                </div>

                {/* Right — form */}
                <FadeIn delay={0.15}>
                    <div className="glass-panel p-6 md:p-8">
                        <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
                        <ContactForm />
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

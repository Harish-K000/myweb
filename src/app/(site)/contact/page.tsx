"use client";

import ContactForm from "@/components/ui/ContactForm";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import ParallaxBackdrop from "@/components/ui/ParallaxBackdrop";
import { Reveal } from "@/components/ui/MotionPrimitives";

const contactChannels = [
    {
        icon: Mail,
        label: "Email",
        value: PORTFOLIO_DATA.profile.social.email.replace("mailto:", ""),
        href: PORTFOLIO_DATA.profile.social.email,
        external: false,
        description: "I respond within 48 hours",
    },
    {
        icon: Phone,
        label: "Phone",
        value: PORTFOLIO_DATA.profile.social.phoneDisplay,
        href: PORTFOLIO_DATA.profile.social.phone,
        external: false,
        description: "Available by call or text",
    },
    {
        icon: Github,
        label: "GitHub",
        value: PORTFOLIO_DATA.profile.social.github.replace("https://github.com/", "github.com/"),
        href: PORTFOLIO_DATA.profile.social.github,
        external: true,
        description: "Open source & project work",
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        value: PORTFOLIO_DATA.profile.social.linkedin.replace("https://www.linkedin.com/in/", "linkedin.com/in/"),
        href: PORTFOLIO_DATA.profile.social.linkedin,
        external: true,
        description: "Let's connect professionally",
    },
];

export default function ContactPage() {
    return (
        <div className="relative isolate overflow-hidden">
            <ParallaxBackdrop accent="gold" />
            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
            {/* Header */}
            <Reveal>
                <p className="text-sm uppercase tracking-[0.3em] text-gold-400 mb-3">Contact</p>
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Let&apos;s build something<br className="hidden md:block" /> cinematic.
                </h1>
                <p className="text-xl text-[var(--color-brand-muted)] max-w-lg mb-12 leading-relaxed">
                    Tell me about your goals, your timeline, and how I can help.
                    I&apos;m currently open to full-time roles and freelance projects.
                </p>
            </Reveal>

            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
                {/* Left — contact info */}
                <div className="space-y-6">
                    <Reveal delay={0.1}>
                        <div className="space-y-4">
                            {contactChannels.map((ch, i) => {
                                const Icon = ch.icon;
                                return (
                                    <a
                                        key={ch.label}
                                        href={ch.href}
                                        target={ch.external ? "_blank" : undefined}
                                        rel={ch.external ? "noreferrer" : undefined}
                                        className="depth-card flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] hover:border-gold-500/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                                            <Icon className="w-4 h-4 text-gold-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-brand-text)]">{ch.label}</p>
                                            <p className="text-sm text-gold-400">{ch.value}</p>
                                            <p className="text-xs text-[var(--color-brand-muted)] mt-0.5">{ch.description}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div className="depth-card p-4 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-surface-1)]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-ember-400 animate-pulse" />
                                <p className="text-sm font-semibold text-ember-400">Available for Opportunities</p>
                            </div>
                            <p className="text-sm text-[var(--color-brand-muted)]">
                                Open to senior full-stack roles and research positions. Remote-friendly.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Right — form */}
                <Reveal delay={0.15}>
                    <div className="glass-panel depth-card p-6 md:p-8">
                        <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
                        <ContactForm />
                    </div>
                </Reveal>
            </div>
            </div>
        </div>
    );
}

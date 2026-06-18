import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const socials = [
    {
        label: "GitHub",
        href: PORTFOLIO_DATA.profile.social.github,
        icon: Github,
        external: true,
    },
    {
        label: "LinkedIn",
        href: PORTFOLIO_DATA.profile.social.linkedin,
        icon: Linkedin,
        external: true,
    },
    {
        label: "Email",
        href: PORTFOLIO_DATA.profile.social.email,
        icon: Mail,
        external: false,
    },
];

export default function Footer() {
    return (
        <footer className="site-footer border-t border-[var(--color-brand-border)] py-12 text-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="space-y-2">
                        <Link href="/" className="font-bold text-lg text-[var(--color-brand-text)] hover:text-cyan-400 transition-colors">
                            {PORTFOLIO_DATA.profile.name}.
                        </Link>
                        <p className="text-[var(--color-brand-muted)] max-w-xs text-xs leading-relaxed">
                            {PORTFOLIO_DATA.profile.title} · Building production-grade web systems.
                        </p>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex gap-8 text-[var(--color-brand-muted)]">
                        <Link href="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
                        <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
                        <Link href="/resume" className="hover:text-cyan-400 transition-colors">Resume</Link>
                    </nav>

                    {/* Socials */}
                    <div className="flex items-center gap-3">
                        {socials.map((s) => {
                            const Icon = s.icon;
                            return (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target={s.external ? "_blank" : undefined}
                                    rel={s.external ? "noreferrer" : undefined}
                                    aria-label={s.label}
                                    className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--color-brand-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--color-brand-muted)] text-xs">
                    <p>© {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name}. All rights reserved.</p>
                    <a
                        href={PORTFOLIO_DATA.profile.social.email}
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                    >
                        Open to opportunities <ArrowUpRight className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

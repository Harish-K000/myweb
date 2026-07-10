import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const socials = [
  { label: "GitHub",   href: PORTFOLIO_DATA.profile.social.github,   Icon: Github,   external: true },
  { label: "LinkedIn", href: PORTFOLIO_DATA.profile.social.linkedin, Icon: Linkedin, external: true },
  { label: "Email",    href: PORTFOLIO_DATA.profile.social.email,    Icon: Mail,     external: false },
];

export default function Footer() {
  return (
    <footer
      className="py-12 px-6 text-sm"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="font-bold text-lg cursor-pointer transition-colors duration-200"
              style={{ color: "var(--text)" }}
            >
              {PORTFOLIO_DATA.profile.name}.
            </Link>
            <p className="max-w-xs text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Full Stack Developer · Building production-grade systems from frontend to cloud.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex gap-6" style={{ color: "var(--text-muted)" }}>
            {[
              { label: "Projects",  href: "/projects" },
              { label: "About",     href: "/about" },
              { label: "Contact",   href: "/contact" },
              { label: "Resume",    href: "/resume" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm transition-colors duration-200 cursor-pointer hover:text-[var(--text)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-subtle)",
          }}
        >
          <p>© {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name}. All rights reserved.</p>
          <a
            href={PORTFOLIO_DATA.profile.social.email}
            className="flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-[var(--text)]"
          >
            Open to opportunities <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </footer>
  );
}

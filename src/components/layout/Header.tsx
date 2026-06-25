"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { name: "About", href: "/#forge" },
  { name: "Experience", href: "/#path" },
  { name: "Projects", href: "/#quests" },
  { name: "Skills", href: "/#grimoire" },
  { name: "Contact", href: "/#portal" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl site-header shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold text-lg tracking-tight text-[var(--color-brand-text)] hover:text-[var(--color-brand-primary)] transition-colors"
          >
            HK
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "font-display text-xs uppercase tracking-[0.18em] transition-colors hover:text-[var(--color-brand-primary)] relative group",
                  pathname === link.href
                    ? "text-[var(--color-brand-primary)]"
                    : "text-[var(--color-brand-muted)]"
                )}
              >
                {link.name}
                <span
                  className={clsx(
                    "absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                  style={{ background: "var(--color-brand-primary)" }}
                />
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/#portal"
              id="header-hire-btn"
              className="hidden sm:flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.15em] border px-4 py-2 rounded-md transition-colors"
              style={{ borderColor: "rgba(214,168,79,0.4)", color: "var(--color-brand-primary)" }}
            >
              <span>Work With Me</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-full border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] transition-colors"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="relative mt-16 bg-[var(--color-brand-bg)] border-b border-[var(--color-brand-border)] px-6 py-6 space-y-4"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "block font-display text-lg py-2 transition-colors hover:text-[var(--color-brand-primary)]",
                  pathname === link.href
                    ? "text-[var(--color-brand-primary)]"
                    : "text-[var(--color-brand-text)]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/#portal"
              className="flex items-center gap-1.5 mt-2 font-display text-sm uppercase tracking-[0.15em] py-2"
              style={{ color: "var(--color-brand-primary)" }}
            >
              Work With Me
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

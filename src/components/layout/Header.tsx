"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
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
            ? "backdrop-blur-xl site-header shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-[var(--color-brand-text)] hover:text-cyan-400 transition-colors"
          >
            Harish K.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-cyan-400 relative group",
                  pathname === link.href
                    ? "text-cyan-400"
                    : "text-[var(--color-brand-muted)]"
                )}
              >
                {link.name}
                <span
                  className={clsx(
                    "absolute -bottom-1 left-0 h-[2px] bg-cyan-400 rounded-full transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/resume"
              id="header-resume-btn"
              className="hidden sm:flex items-center gap-2 bg-[var(--color-brand-text)] text-[var(--color-brand-bg)] text-sm font-bold px-4 py-2 rounded-full hover:opacity-85 transition-opacity"
              title="View/Download Resume"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
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
                  "block text-lg font-medium py-2 transition-colors hover:text-cyan-400",
                  pathname === link.href
                    ? "text-cyan-400"
                    : "text-[var(--color-brand-text)]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/resume"
              className="flex items-center gap-2 mt-2 text-lg font-medium py-2 text-[var(--color-brand-muted)] hover:text-cyan-400 transition-colors"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticWrapper from "@/components/ui/MagneticWrapper";

const NAV_LINKS = [
  { name: "Experience", href: "/#experience" },
  { name: "Projects",   href: "/#projects" },
  { name: "Contact",    href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = document.documentElement.dataset.theme as "light" | "dark";
    setTheme(stored === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };

  const isDark = theme === "dark";
  const navBg = scrolled
    ? isDark ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.92)"
    : isDark ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.72)";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div
          className="flex items-center gap-1 px-3 py-2 rounded-full"
          style={{
            background: navBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border)",
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-sm px-3 py-1.5 rounded-full transition-colors duration-200"
            style={{ color: "var(--text)" }}
          >
            HK
          </Link>

          <div className="w-px h-4 mx-1" style={{ background: "var(--border-hover)" }} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block w-px h-4 mx-1" style={{ background: "var(--border-hover)" }} />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Hire Me CTA */}
          <MagneticWrapper>
            <a
              href="/#contact"
              className="hidden sm:flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ml-1 transition-all duration-200"
              style={{
                background: "var(--cta-bg)",
                color: "var(--cta-text)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cta-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cta-bg)"; }}
            >
              Hire Me
            </a>
          </MagneticWrapper>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex md:hidden w-8 h-8 rounded-full items-center justify-center cursor-pointer ml-1"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {menuOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl overflow-hidden md:hidden"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <nav className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium cursor-pointer transition-all duration-200"
                  style={{ color: "var(--text-muted)" }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-2 h-px" style={{ background: "var(--border)" }} />
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl text-base font-semibold text-center cursor-pointer transition-all duration-200"
                style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
              >
                Hire Me
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

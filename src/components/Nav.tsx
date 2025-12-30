"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { siteConfig } from "@/data/site";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            HK
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {siteConfig.name}
            </p>
            <p className="text-xs text-slate-600">{siteConfig.role}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {siteConfig.nav.map((item) => {
            const isActive =
              item.match === "/"
                ? pathname === "/"
                : pathname.startsWith(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900",
                  isActive ? "text-slate-900" : "text-slate-600",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={siteConfig.links.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-900 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            <Download className="h-4 w-4" aria-hidden />
            Resume
          </Link>
          <Link
            href={siteConfig.links.contact}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={siteConfig.links.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-900 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            Resume
          </Link>
          <Link
            href={siteConfig.links.contact}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            Contact
          </Link>
        </div>
      </Container>
    </header>
  );
}

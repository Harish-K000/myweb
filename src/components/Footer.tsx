import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white py-12">
      <Container className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Let&apos;s build
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">
            {siteConfig.role}
          </h3>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            {siteConfig.footerBlurb}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Location
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {siteConfig.location}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Connect
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
              {siteConfig.socials.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <Container className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </Container>
    </footer>
  );
}


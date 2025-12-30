"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type CTA = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  eventName?: string;
};

interface CTAButtonsProps {
  primary: CTA;
  secondary?: CTA;
  className?: string;
  tone?: "light" | "dark";
}

export function CTAButtons({
  primary,
  secondary,
  className,
  tone = "light",
}: CTAButtonsProps) {
  const primaryClasses =
    tone === "dark"
      ? "bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-white"
      : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900";

  const secondaryClasses =
    tone === "dark"
      ? "border-white/70 text-white hover:border-white focus-visible:ring-white"
      : "border-slate-300 text-slate-900 hover:border-slate-400 hover:text-slate-950 focus-visible:ring-slate-900";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
    >
      <Link
        href={primary.href}
        target={primary.external ? "_blank" : undefined}
        rel={primary.external ? "noreferrer" : undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          primaryClasses,
        )}
      >
        <span>{primary.label}</span>
        {primary.icon ?? <ArrowUpRight className="h-4 w-4" aria-hidden />}
      </Link>

      {secondary ? (
        <Link
          href={secondary.href}
          target={secondary.external ? "_blank" : undefined}
          rel={secondary.external ? "noreferrer" : undefined}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            secondaryClasses,
          )}
        >
          <span>{secondary.label}</span>
          {secondary.icon ?? <Calendar className="h-4 w-4" aria-hidden />}
        </Link>
      ) : null}
    </div>
  );
}

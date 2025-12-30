"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkillBadge } from "./SkillBadge";
import type { Project } from "@/data/site";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/60 transition hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {project.domain}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">
            {project.title}
          </h3>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          {project.year}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-600 sm:text-base">
        {project.summary}
      </p>

      <ul className="mt-6 grid gap-3">
        {project.metrics.map((metric) => (
          <li key={metric.label}>
            <span className="text-xl font-semibold text-slate-900">
              {metric.value}
            </span>
            <span className="ml-2 text-sm text-slate-600">{metric.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <SkillBadge key={item} label={item} className="bg-slate-50" />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {project.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            <span>{link.label}</span>
            <ArrowUpRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </motion.article>
  );
}


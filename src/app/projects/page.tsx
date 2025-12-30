import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { projects, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Projects · ${siteConfig.name}`,
  description:
    "Explore case studies that showcase shipping performant web apps, ML-powered mobile products, and research platforms with measurable outcomes.",
};

type ProjectsPageProps = {
  searchParams?: {
    domain?: string;
  };
};

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const domain = searchParams?.domain ?? "all";
  const domains = Array.from(new Set(projects.map((project) => project.domain)));

  const filteredProjects =
    domain === "all"
      ? projects
      : projects.filter(
          (project) => project.domain.toLowerCase() === domain.toLowerCase(),
        );

  return (
    <Section
      eyebrow="Projects"
      title="Case studies built for technical screens"
      description="Filter by domain to move from headline metrics to implementation detail. Every project includes architecture decisions, KPIs, and source links."
    >
      <ProjectsFilters domains={domains} active={domain} />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

function ProjectsFilters({
  domains,
  active,
}: {
  domains: string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterPill href="/projects" active={active === "all"}>
        All
      </FilterPill>
      {domains.map((domain) => (
        <FilterPill
          key={domain}
          href={`/projects?domain=${encodeURIComponent(domain)}`}
          active={active.toLowerCase() === domain.toLowerCase()}
        >
          {domain}
        </FilterPill>
      ))}
    </div>
  );
}

function FilterPill({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      )}
      prefetch
    >
      {children}
    </Link>
  );
}


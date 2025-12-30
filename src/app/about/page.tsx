import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { CTAButtons } from "@/components/CTAButtons";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `About · ${siteConfig.name}`,
  description:
    "Discover Harish Kannan’s background, principles, and impact across high-performing product teams.",
};

const timeline = [
  {
    period: "2025",
    role: "Scrum Master · Depth Training",
    impact:
      "Shipped ISR-powered marketing site refresh delivering 18% conversion lift and 95+ Lighthouse scores.",
  },
  {
    period: "APRIL 2025 - June 2025",
    role: "Android Engineer · TranslateEase",
    impact:
      "Built offline OCR translation app serving 50k+ MAU with 99.8% crash-free sessions and enterprise-grade security.",
  },
  {
    period: "2024 — 2025",
    role: "Research Assistant · FMASAC (IRS CRN)",
    impact:
      "Automated experiment workflows with reproducible pipelines and compliance-first infrastructure.",
  },
  {
    period: "2022 — 2024",
    role: "Software Engineer · Cognizant",
    impact:
      "Delivered modernization projects across banking and healthcare, introducing CI/CD and observability for squads.",
  },
];

const principles = [
  {
    title: "Speed with discipline",
    description:
      "Ship fast, but never without guardrails—feature flags, automated testing, and observability are default.",
  },
  {
    title: "Design from the numbers",
    description:
      "Metrics frame every roadmap: Lighthouse baselines, retention goals, conversion rates, and error budgets.",
  },
  {
    title: "Communicate for trust",
    description:
      "Clear updates and decision logs keep stakeholders aligned and unblock teams in fast-moving environments.",
  },
];

const strengths = [
  {
    label: "Technical Strategy",
    detail:
      "Translate business goals into architecture choices that balance time-to-market with long-term maintainability.",
  },
  {
    label: "Developer Experience",
    detail:
      "Level up teams with shared component libraries, linting conventions, and CI pipelines that prevent regressions.",
  },
  {
    label: "Cross-functional Alignment",
    detail:
      "Work tightly with design, marketing, and data to ensure shipped features hit business and UX targets.",
  },
];

export default function AboutPage() {
  const resumeExternal = siteConfig.links.resume.startsWith("http");

  return (
    <div className="pb-24 pt-16">
      <Container>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            About
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold text-slate-900 sm:text-5xl">
            Building products that perform, persuade, and persist.
          </h1>
          <p className="mt-6 text-base text-slate-600 sm:text-lg">
            I’m Harish Kannan—an end-to-end engineer experienced in taking web
            and mobile products from zero-to-one and into scale. I move between
            architecture discussions, metrics dashboards, and code reviews with
            ease, keeping teams focused on outcomes.
          </p>
        </header>
      </Container>

      <Section
        eyebrow="Career timeline"
        title="Impact across roles"
        description="Key chapters that shaped how I build and lead."
      >
        <div className="space-y-8">
          {timeline.map((entry) => (
            <div
              key={entry.period}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/60"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {entry.period}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {entry.role}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{entry.impact}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Operating principles"
        title="How I approach building teams & products"
        description="Guiding ideas that keep projects focused, resilient, and measurable."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/60"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Strengths"
        title="What teams lean on me for"
        description="I thrive where there’s a need to connect strategy, implementation, and measurable success."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {strengths.map((strength) => (
            <div
              key={strength.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/60"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {strength.label}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{strength.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Let’s collaborate"
        title="Tell me about the roadmap"
        description="Whether you need a short-term specialist or a long-term hire, I bring structure, empathy, and data-driven craft."
      >
        <div className="rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-xl">
          <p className="text-lg font-semibold">
            I respond within 24 hours on weekdays.
          </p>
          <p className="mt-3 text-sm text-white/80">
            Send over a spec, job description, or pain point—we’ll quickly map
            next steps.
          </p>
          <CTAButtons
            className="mt-8"
            primary={{
              label: "Contact",
              href: siteConfig.links.contact,
            }}
            secondary={{
              label: "View resume",
              href: siteConfig.links.resume,
              external: resumeExternal,
            }}
            tone="dark"
          />
        </div>
      </Section>
    </div>
  );
}


import { CTAButtons } from "@/components/CTAButtons";
import { Container } from "@/components/Container";
import { Metric } from "@/components/Metric";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { SkillBadge } from "@/components/SkillBadge";
import {
  coreMetrics,
  featuredProjects,
  heroCopy,
  siteConfig,
  skills,
} from "@/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <SkillsSection />
      <FeaturedProjectsSection />
      <MetricsSection />
      <ContactSection />
    </>
  );
}

function Hero() {
  const resumeExternal = siteConfig.links.resume.startsWith("http");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pb-24 pt-28 sm:pt-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-96 w-full bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),transparent_55%)]" />
      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {heroCopy.eyebrow}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl">
              {heroCopy.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
              {heroCopy.subheadline}
            </p>
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
              <CTAButtons
                primary={{
                  label: "View Resume",
                  href: siteConfig.links.resume,
                  external: resumeExternal,
                }}
                secondary={{
                  label: "Book intro call",
                  href: siteConfig.links.calendly,
                  external: true,
                }}
              />
              <p className="text-sm text-slate-500">{heroCopy.availability}</p>
            </div>
            <dl className="mt-12 grid gap-6 sm:grid-cols-3">
              {coreMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-slate-100/80">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {metric.label}
                  </dt>
                  <dd className="mt-3 text-2xl font-semibold text-slate-900">
                    {metric.value}
                  </dd>
                  {metric.description ? (
                    <p className="mt-2 text-xs text-slate-600">
                      {metric.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Impact Highlights
            </p>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">Depth Training</span>{" "}
                — Lifted marketing conversions 18% with ISR + structured data.
              </li>
              <li>
                <span className="font-semibold text-slate-900">TranslateEase</span>{" "}
                — Delivered offline OCR pipeline powering 50k+ monthly translations.
              </li>
              <li>
                <span className="font-semibold text-slate-900">FMASAC</span>{" "}
                — Built compliant experimentation infra with automated QA gating.
              </li>
            </ul>
            <div className="rounded-2xl bg-slate-900 px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                Trusted By
              </p>
              <p className="mt-3 text-lg font-semibold">
                Cognizant · IRS CRN · Mobility Startups
              </p>
              <p className="mt-2 text-sm text-white/80">
                Partnered with cross-functional teams to ship secure, high-uptime platforms.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SkillsSection() {
  return (
    <Section
      eyebrow="Core skills"
      title="Full-stack range, production-hardened delivery"
      description="From marketing sites and growth experiments to ML-backed mobile experiences, I plug into teams that need measurable impact and clean execution."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {skills.map((group) => (
          <div
            key={group.label}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/60"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {group.label}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <SkillBadge key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FeaturedProjectsSection() {
  return (
    <Section
      eyebrow="Featured work"
      title="Case studies that ship outcomes in 60 seconds"
      description="Each project pairs a crisp narrative with the architecture, constraints, and metrics recruiters want. Tap through for full case studies."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

function MetricsSection() {
  return (
    <Section
      eyebrow="Proof at a glance"
      title="The KPIs recruiters check first"
      description="Performance, retention, and accessibility baked into launch checklists—validated through analytics and monitoring."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coreMetrics.map((metric) => (
          <Metric
            key={metric.label}
            label={metric.label}
            value={metric.value}
            description={metric.description}
          />
        ))}
      </div>
    </Section>
  );
}

function ContactSection() {
  const resumeExternal = siteConfig.links.resume.startsWith("http");

  return (
    <Section
      eyebrow="Ready to talk?"
      title="Send the brief or grab 15 minutes to scope fit"
      description="Recruiters, engineering managers, and founders rely on me when they need production-ready execution with thoughtful communication."
    >
      <div className="grid items-center gap-8 rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-xl sm:grid-cols-[1fr_auto] sm:gap-12">
        <div>
          <p className="text-lg font-semibold">Fast responses, timezone-friendly.</p>
          <p className="mt-3 text-sm text-white/80">
            Drop details via the contact page or grab time directly on my calendar.
          </p>
        </div>
        <CTAButtons
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
  );
}

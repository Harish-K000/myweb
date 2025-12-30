import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { siteConfig, skills } from "@/data/site";

export const metadata: Metadata = {
  title: `Resume · ${siteConfig.name}`,
  description:
    "ATS-friendly HTML resume for Harish Kannan with experience, skills, and education.",
};

const experience = [
  {
    company: "Depth Training",
    role: "Lead Frontend Engineer",
    period: "Jan 2024 – Apr 2024",
    achievements: [
      "Launched ISR marketing platform lifting conversions 18% and Lighthouse SEO scores to 99.",
      "Built booking flow instrumentation with analytics events powering weekly growth reviews.",
      "Partnered with marketing to roll out schema.org structured data and OG assets in <2 weeks.",
    ],
    stack: ["Next.js 14", "Contentful", "Vercel", "Resend", "Algolia"],
  },
  {
    company: "TranslateEase",
    role: "Android Engineer",
    period: "Jul 2022 – Dec 2023",
    achievements: [
      "Delivered offline OCR translation app for 50k+ MAU with 99.8% crash-free sessions.",
      "Implemented modular MVVM architecture with feature toggles for enterprise rollouts.",
      "Automated release QA via Espresso + Firebase Test Lab, catching 92% of regressions pre-release.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "ML Kit", "Room", "Firebase"],
  },
  {
    company: "FMASAC (IRS CRN)",
    role: "Research Platform Engineer",
    period: "Oct 2021 – Aug 2022",
    achievements: [
      "Developed reproducible experiment pipeline cutting cycle time by 4x.",
      "Created compliance-ready audit logs and encryption strategy for sensitive tax data.",
      "Established CI/CD with infrastructure-as-code and automated security scanning.",
    ],
    stack: ["FastAPI", "PostgreSQL", "Redis", "Airflow", "AWS"],
  },
  {
    company: "Cognizant",
    role: "Software Engineer",
    period: "Jun 2019 – Sep 2021",
    achievements: [
      "Modernized Angular + .NET applications for enterprise clients with improved performance SLAs.",
      "Introduced unit & integration testing practices across two squads, reducing escaped defects by 35%.",
      "Championed observability rollout using Datadog dashboards & alerting.",
    ],
    stack: ["Angular", ".NET", "SQL Server", "Docker"],
  },
];

const education = [
  {
    school: "Anna University",
    degree: "B.E. Computer Science",
    period: "2015 – 2019",
  },
];

const certifications = [
  "AWS Certified Solutions Architect – Associate",
  "Certified Kubernetes Administrator (in progress)",
];

export default function ResumePage() {
  return (
    <div className="pb-24 pt-16">
      <Container>
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900">
              {siteConfig.name}
            </h1>
            <p className="text-base text-slate-600">{siteConfig.role}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
              <a
                href={siteConfig.links.email}
                className="underline decoration-slate-200 underline-offset-4 hover:decoration-slate-400"
              >
                harish.kannan.dev@gmail.com
              </a>
              <span>·</span>
              <Link
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-slate-200 underline-offset-4 hover:decoration-slate-400"
              >
                LinkedIn
              </Link>
              <span>·</span>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-slate-200 underline-offset-4 hover:decoration-slate-400"
              >
                GitHub
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-slate-600">
              Full-stack engineer focused on shipping performant apps and growth
              loops. I collaborate across product, design, and marketing to
              deliver measurable KPIs and resilient systems.
            </p>
          </div>
          <a
            href={siteConfig.links.resume}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-900 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            download
          >
            Download PDF
          </a>
        </header>

        <section className="mt-10 space-y-10">
          <h2 className="text-2xl font-semibold text-slate-900">Experience</h2>
          <div className="space-y-8">
            {experience.map((item) => (
              <div key={item.company} className="space-y-3">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.role}
                    </h3>
                    <p className="text-sm text-slate-600">{item.company}</p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.period}
                  </p>
                </header>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Stack: {item.stack.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Skills</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {skills.map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100/60"
              >
                <p className="font-semibold text-slate-900">{group.label}</p>
                <p className="mt-2">{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Education</h2>
          <div className="mt-4 space-y-4">
            {education.map((item) => (
              <div key={item.school}>
                <p className="text-sm font-semibold text-slate-900">
                  {item.school}
                </p>
                <p className="text-sm text-slate-600">{item.degree}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {item.period}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Certifications</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}


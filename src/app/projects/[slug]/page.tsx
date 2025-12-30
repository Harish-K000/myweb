import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { siteConfig, projects } from "@/data/site";

type CaseStudyPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    return {
      title: `Project not found · ${siteConfig.name}`,
    };
  }

  return {
    title: `${project.title} · Case Study`,
    description: project.summary,
  };
}

export default function ProjectCaseStudy({ params }: CaseStudyPageProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project || !project.caseStudy) {
    notFound();
  }

  const { caseStudy } = project;

  return (
    <article className="pb-24 pt-16">
      <Container>
        <header className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {project.domain}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold text-slate-900 sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {project.summary}
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-100/60">
          <dl className="grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Role
              </dt>
              <dd className="mt-2 text-sm text-slate-700">{caseStudy.role}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Duration
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                {caseStudy.duration}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Stack
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                {caseStudy.stack.join(" · ")}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-16">
          <CaseStudySection title="Problem">
            {caseStudy.problem.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
          </CaseStudySection>

          <CaseStudySection title="Constraints">
            <ul className="list-disc space-y-3 pl-5 text-base text-slate-600">
              {caseStudy.constraints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CaseStudySection>

          <CaseStudySection title="Architecture">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Approach
                </p>
                <ul className="mt-3 space-y-3 text-base text-slate-600">
                  {caseStudy.architecture.overview.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Highlights
                </p>
                <ul className="mt-3 space-y-3 text-base text-slate-600">
                  {caseStudy.architecture.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CaseStudySection>

          <CaseStudySection title="Key Decisions">
            <div className="space-y-6">
              {caseStudy.keyDecisions.map((decision) => (
                <div
                  key={decision.decision}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/60"
                >
                  <p className="text-base font-semibold text-slate-900">
                    {decision.decision}
                  </p>
                  <dl className="mt-4 space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="font-semibold text-slate-900">
                        Alternative
                      </dt>
                      <dd>{decision.alternative}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Why this</dt>
                      <dd>{decision.rationale}</dd>
                    </div>
                    {decision.tradeOffs ? (
                      <div>
                        <dt className="font-semibold text-slate-900">
                          Trade-offs
                        </dt>
                        <dd>{decision.tradeOffs}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection title="Results">
            <ul className="space-y-4">
              {caseStudy.results.map((result) => (
                <li key={result.label} className="text-base text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {result.value}
                  </span>{" "}
                  — {result.label}
                </li>
              ))}
            </ul>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-base text-slate-600">
              {caseStudy.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </CaseStudySection>

          <CaseStudySection title="Code & Live">
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {[...project.links, ...caseStudy.code].map((link) => (
                <Link
                  key={`${project.slug}-${link.href}`}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-slate-300 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {caseStudy.assets?.length ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Assets
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  {caseStudy.assets.map((asset) => (
                    <Link
                      key={asset.href}
                      href={asset.href}
                      target={asset.external ? "_blank" : undefined}
                      rel={asset.external ? "noreferrer" : undefined}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-slate-300 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                    >
                      {asset.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </CaseStudySection>
        </div>
      </Container>
    </article>
  );
}

function CaseStudySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

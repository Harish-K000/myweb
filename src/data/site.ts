export type NavigationItem = {
  label: string;
  href: string;
  match: string;
};

export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Metric = {
  label: string;
  value: string;
  description?: string;
};

export type CaseStudyDecision = {
  decision: string;
  alternative: string;
  rationale: string;
  tradeOffs?: string;
};

export type CaseStudy = {
  role: string;
  duration: string;
  stack: string[];
  problem: string[];
  constraints: string[];
  architecture: {
    overview: string[];
    highlights: string[];
  };
  keyDecisions: CaseStudyDecision[];
  results: Metric[];
  outcomes: string[];
  code: SiteLink[];
  assets?: SiteLink[];
};

export type Project = {
  slug: string;
  title: string;
  domain: string;
  year: string;
  summary: string;
  metrics: Metric[];
  tech: string[];
  links: SiteLink[];
  caseStudy?: CaseStudy;
};

export type SkillCategory = {
  label: string;
  items: string[];
};

export const projects: Project[] = [
  {
    slug: "depth-training-website",
    title: "Depth Training Platform",
    domain: "EdTech",
    year: "2024",
    summary:
      "Rebuilt an SEO-critical marketing and booking experience for a sports training brand, combining Contentful + Next.js ISR to deliver sub 2s LCP and a 18% uptick in trial conversions.",
    metrics: [
      { label: "Conversion lift", value: "+18% booking rate" },
      { label: "Lighthouse SEO", value: "95 → 99" },
    ],
    tech: [
      "Next.js 14",
      "React",
      "Tailwind CSS",
      "Contentful",
      "ISR",
      "Vercel",
    ],
    links: [
      { label: "View case study", href: "/projects/depth-training-website" },
      {
        label: "Live site",
        href: "https://depth-training.example.com",
        external: true,
      },
    ],
    caseStudy: {
      role: "Lead Frontend & Platform Engineer",
      duration: "Jan 2024 – Apr 2024",
      stack: ["Next.js 14", "Contentful", "Vercel", "Algolia", "Resend"],
      problem: [
        "Depth Training’s WordPress marketing site scored sub-70 Lighthouse SEO, causing organic drop-off and bloated booking hand-offs. Editorial teams needed faster iteration cycles without sacrificing performance.",
      ],
      constraints: [
        "SEO uplift to 95+ without losing existing organic rankings.",
        "CMS handoff for non-technical editors that still enforced design guardrails.",
        "Booking APIs with <300ms latency from APAC edge regions.",
        "Migration completed inside a 10-week off-season window.",
      ],
      architecture: {
        overview: [
          "Next.js App Router with ISR for high-traffic pages and on-demand revalidation hooked into Contentful webhooks.",
          "Edge middleware for geo-personalised testimonials and Algolia-backed location search.",
        ],
        highlights: [
          "Shared UI package with Tailwind tokens consumed by both marketing and booking flows.",
          "Dynamic sitemap + JSON-LD generation piped through a single metadata utility.",
          "Rate-limited route handlers proxying booking requests with audit logging.",
        ],
      },
      keyDecisions: [
        {
          decision: "ISR cache window set to 60 minutes with manual revalidation on publish.",
          alternative: "Full SSR on every request.",
          rationale:
            "Balanced SEO freshness with stable performance; editors trigger revalidation when launching campaigns.",
          tradeOffs: "Requires monitoring to ensure revalidation webhooks fire; added retry logic.",
        },
        {
          decision: "Adopted Contentful rich-text rendering pipeline with custom components.",
          alternative: "MDX-based content stored in repo.",
          rationale:
            "Editorial team already onboarded to Contentful; custom renderer kept layout consistent while empowering marketers.",
          tradeOffs: "Higher upfront integration but reduced ongoing dev lift.",
        },
      ],
      results: [
        { label: "Conversion lift", value: "+18% booking rate" },
        { label: "Lighthouse SEO", value: "95 → 99" },
        { label: "Lead response time", value: "-42% time-to-contact" },
      ],
      outcomes: [
        "Established design system primitives consumed across marketing and app surfaces.",
        "Cut content publish time from days to under 2 hours with automated QA gating.",
        "Implemented error budgets with Vercel Analytics + Sentry alerts for regressions.",
      ],
      code: [
        {
          label: "GitHub repo",
          href: "https://github.com/harishkannan/depth-training-platform",
          external: true,
        },
        {
          label: "Content model handoff",
          href: "https://www.figma.com/file/placeholder/depth-content-model",
          external: true,
        },
      ],
      assets: [
        {
          label: "Performance report",
          href: "https://harishkannan.dev/assets/depth-lighthouse.pdf",
          external: true,
        },
      ],
    },
  },
  {
    slug: "translate-ease",
    title: "TranslateEase Mobile",
    domain: "Mobile AI",
    year: "2023",
    summary:
      "Delivered OCR-powered offline translation for logistics teams. Built reliable sync + caching yielding 50k+ monthly translations with >99.8% crash-free sessions.",
    metrics: [
      { label: "Crash-free sessions", value: "99.8%" },
      { label: "MAU", value: "50k+" },
    ],
    tech: [
      "Kotlin",
      "Android",
      "ML Kit",
      "Room DB",
      "Espresso",
      "Firebase",
    ],
    links: [
      { label: "View case study", href: "/projects/translate-ease" },
      {
        label: "GitHub",
        href: "https://github.com/harishkannan/translate-ease",
        external: true,
      },
    ],
    caseStudy: {
      role: "Android Engineer",
      duration: "Jul 2022 – Dec 2023",
      stack: [
        "Kotlin",
        "Jetpack Compose",
        "ML Kit",
        "Dagger Hilt",
        "Room",
        "Firebase App Distribution",
      ],
      problem: [
        "Field ops teams needed reliable offline translation to service multi-lingual clients. Existing SaaS tool required connectivity and leaked sensitive customer data.",
      ],
      constraints: [
        "Strict offline-first usage with encrypted on-device cache.",
        "Translation accuracy within ±3% of cloud APIs.",
        "Sub-1s scan-to-translation latency on mid-tier Android devices.",
        "Compliance with enterprise MDM rollout and zero crashes over 30-day windows.",
      ],
      architecture: {
        overview: [
          "Modularised MVVM architecture with feature modules for capture, translation, and history persisted via Room.",
          "On-device ML Kit models bundled with delta updates managed through Firebase App Distribution.",
        ],
        highlights: [
          "Background worker syncing translations when LTE or Wi-Fi detected with exponential backoff.",
          "Custom canvas pre-processing pipeline to denoise scans before OCR.",
          "Espresso + Paparazzi snapshot coverage blocking regressions in localization layouts.",
        ],
      },
      keyDecisions: [
        {
          decision: "Embedded ML Kit translation models with periodic background updates.",
          alternative: "Server-side translation via REST API.",
          rationale:
            "Guaranteed offline functionality and predictable latency regardless of connectivity.",
          tradeOffs:
            "Larger binary size managed by trimming language packs during installation.",
        },
        {
          decision: "Adopted Jetpack Compose for the translation workspace.",
          alternative: "XML-based UI kit already in production at company.",
          rationale:
            "Compose delivered faster iteration for dynamic states (scanning, reviewing, offline banners).",
          tradeOffs:
            "Invested in internal design tokens + training for the team, paid off via velocity gains.",
        },
      ],
      results: [
        { label: "Crash-free sessions", value: "99.8%" },
        { label: "Monthly active users", value: "50k+" },
        { label: "Latency", value: "0.8s scan → translation" },
      ],
      outcomes: [
        "Rolled into national operations with 4.8★ Play Store rating from pilot markets.",
        "Reduced translation costs by 72% compared with prior SaaS contract.",
        "Instrumented analytics funnel to track translation completion + retention cohorts.",
      ],
      code: [
        {
          label: "GitHub repo",
          href: "https://github.com/harishkannan/translate-ease",
          external: true,
        },
        {
          label: "Design spec",
          href: "https://www.figma.com/file/placeholder/translate-ease-spec",
          external: true,
        },
      ],
    },
  },
  {
    slug: "fmasac-research",
    title: "FMASAC Research Platform",
    domain: "Applied Research",
    year: "2022",
    summary:
      "Engineered a reproducible experimentation pipeline for an IRS collaborative research network. Automated data ingestion + visualization with strict compliance controls.",
    metrics: [
      { label: "Experiment velocity", value: "4x faster" },
      { label: "Data accuracy", value: "99.5%" },
    ],
    tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
    links: [
      { label: "View case study", href: "/projects/fmasac" },
      {
        label: "Architecture deep-dive",
        href: "https://www.linkedin.com/in/harish-kannan/details/projects/",
        external: true,
      },
    ],
    caseStudy: {
      role: "Research Platform Engineer",
      duration: "Oct 2021 – Aug 2022",
      stack: [
        "FastAPI",
        "Python",
        "PostgreSQL",
        "Redis",
        "Apache Airflow",
        "AWS ECS",
        "Terraform",
      ],
      problem: [
        "IRS-funded researchers required a consistent experimentation pipeline for FMASAC studies. Existing workflows relied on spreadsheets and manual scripts, causing reproducibility gaps and compliance risk.",
      ],
      constraints: [
        "FedRAMP boundary with strict logging + data retention policies.",
        "Orchestrate GPU-heavy simulations without impacting analyst tooling.",
        "Deliver reproducible experiment histories with signed artifacts.",
        "Onboard cross-functional researchers with minimal DevOps overhead.",
      ],
      architecture: {
        overview: [
          "Domain-driven service split: ingestion API, experiment orchestrator, analytics dashboard deployed as ECS services.",
          "Airflow DAGs orchestrated ETL pipelines and triggered simulation workloads on demand.",
        ],
        highlights: [
          "Event-sourced audit trail stored in PostgreSQL with nightly snapshots stored to S3 + Glacier.",
          "Redis-backed task queue smoothing burst simulation requests with circuit breakers.",
          "Grafana dashboards + alerting exposing experiment SLAs and anomaly detection.",
        ],
      },
      keyDecisions: [
        {
          decision: "Adopted FastAPI with Pydantic schemas for typed contracts.",
          alternative: "Retain existing Flask blueprint scripts.",
          rationale:
            "Improved validation, async support for streaming large experiment batches, and generated OpenAPI docs for partners.",
          tradeOffs:
            "Required migrating legacy scripts; mitigated via compat layer for first release.",
        },
        {
          decision: "Implemented event-sourcing pattern for experiment lifecycle.",
          alternative: "Simple CRUD per experiment run.",
          rationale:
            "Guaranteed reproducibility and easy diffing between iterations; satisfied audit requirements.",
          tradeOffs:
            "Higher storage footprint; offset via archived snapshots and partitioning.",
        },
      ],
      results: [
        { label: "Experiment velocity", value: "4x faster" },
        { label: "Data accuracy", value: "99.5%" },
        { label: "Time to onboard", value: "-60%" },
      ],
      outcomes: [
        "Enabled parallel experimentation across three IRS research teams without platform collisions.",
        "Delivered compliance-ready reporting pack used for grant re-authorization.",
        "Established CI/CD with infrastructure testing preventing misconfigured IAM roles.",
      ],
      code: [
        {
          label: "Systems diagram",
          href: "https://harishkannan.dev/assets/fmasac-architecture.pdf",
          external: true,
        },
      ],
      assets: [
        {
          label: "Experiment template",
          href: "https://harishkannan.dev/assets/fmasac-template.xlsx",
          external: true,
        },
      ],
    },
  },
];

export const featuredProjects = projects.slice(0, 3);

export const navigation: NavigationItem[] = [
  { label: "Projects", href: "/projects", match: "/projects" },
  { label: "About", href: "/about", match: "/about" },
  { label: "Contact", href: "/contact", match: "/contact" },
  { label: "Resume", href: "/resume", match: "/resume" },
];

export const heroCopy = {
  eyebrow: "Full-stack Developer — Next.js / Angular / Node.js",
  headline: "I build performant, data-driven products that convert.",
  subheadline:
    "Ex-Cognizant engineer focused on marketing sites and product experiences that ship 95+ Lighthouse scores, reach 50k+ MAU, and keep operations secure.",
  availability: "Open to senior full-stack roles · Remote / Chennai, IN",
};

export const coreMetrics: Metric[] = [
  {
    label: "Lighthouse SEO",
    value: "95+",
    description: "Consistent scores on production marketing surfaces.",
  },
  {
    label: "Performance gains",
    value: "-30% LCP",
    description: "Achieved through caching, ISR, and critical CSS tuning.",
  },
  {
    label: "Product reach",
    value: "50k+ MAU",
    description: "Across education, mobility, and civic tech launches.",
  },
];

export const skills: SkillCategory[] = [
  {
    label: "Frontend",
    items: [
      "Next.js 14",
      "React 18/19",
      "App Router",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Angular",
    ],
  },
  {
    label: "Backend & DevOps",
    items: ["Node.js", "NestJS", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    label: "Quality & Analytics",
    items: [
      "Playwright",
      "Lighthouse CI",
      "Vercel Analytics",
      "Datadog",
      "Automation Testing",
    ],
  },
];

export const siteConfig = {
  name: "Harish Kannan",
  role: "Full-Stack Developer",
  location: "Chennai, India · Remote-friendly",
  description:
    "Harish Kannan is a full-stack engineer specializing in Next.js, Angular, and data-driven product development. He partners with growth and product teams to launch performant apps that scale.",
  headline: heroCopy.eyebrow,
  nav: navigation,
  links: {
    resume: "/resume.pdf",
    contact: "/contact",
    email: "mailto:harish.kannan.dev@gmail.com",
    github: "https://github.com/harishkannan",
    linkedin: "https://www.linkedin.com/in/harish-kannan",
    calendly: "https://cal.com/harishkannan/intro",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/harishkannan", external: true },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/harish-kannan",
      external: true,
    },
    {
      label: "Email",
      href: "mailto:harish.kannan.dev@gmail.com",
    },
    {
      label: "Calendly",
      href: "https://cal.com/harishkannan/intro",
      external: true,
    },
  ] as SiteLink[],
  footerBlurb:
    "Let’s collaborate on products where performance, accessibility, and measurable impact are non-negotiable.",
};

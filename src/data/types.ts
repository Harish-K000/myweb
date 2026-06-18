export type NavigationItem = {
  label: string;
  href: string;
  match?: string;
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

export type Skill = {
  name: string;
  proficiency?: "Primary" | "Secondary" | "Support";
  usedIn?: string[];
};

export type SkillCategory = {
  label: string;
  description?: string;
  items: Skill[];
};

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  impact: string;
  highlights: string[];
  stack: string[];
};

import type { NavigationItem, SiteLink } from "./types";

export const navigation: NavigationItem[] = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Proof", href: "#metrics" },
  { label: "Contact", href: "#contact" },
];

export const heroCopy = {
  eyebrow: "Full-Stack Developer — React / Three.js / TypeScript",
  headline: "I build premium, performance-first products that convert.",
  subheadline:
    "Ex-Cognizant engineer delivering cinematic UX, 95+ Lighthouse scores, and measurable growth across web and mobile platforms.",
  availability: "Open to senior full-stack roles · Remote / Chennai, IN",
};

export const siteConfig = {
  name: "Harish Kannan",
  role: "Full-Stack Developer",
  title: "Premium Full-Stack Portfolio",
  location: "Chennai, India · Remote-friendly",
  summary:
    "Full-stack engineer focused on shipping cinematic product experiences, measurable growth loops, and scalable architectures.",
  description:
    "Harish Kannan is a full-stack engineer specializing in React, Three.js, and data-driven product development. He partners with growth and product teams to launch performant apps that scale.",
  nav: navigation,
  links: {
    resume: "/resume.pdf",
    contact: "#contact",
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

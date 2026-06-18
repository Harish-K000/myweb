export type LifecycleChapter = {
  id: string;
  label: string;
  caption: string;
  title: string;
  description: string;
  highlight: string;
};

export const lifecycleChapters: LifecycleChapter[] = [
  {
    id: "hero",
    label: "Genesis",
    caption: "Signal",
    title: "Origin story, distilled into a single signal.",
    description:
      "The opening chapter sets the tone: premium build quality, cinematic UI, and measurable outcomes.",
    highlight: "Full-stack craft · Performance-first UX",
  },
  {
    id: "projects",
    label: "Build",
    caption: "Case studies",
    title: "From brief to launch, every decision is deliberate.",
    description:
      "Projects are framed like product stories — architecture, outcomes, and the why behind each solution.",
    highlight: "Shipped systems · Real-world impact",
  },
  {
    id: "skills",
    label: "Craft",
    caption: "Capability",
    title: "Deep technical range with a product mindset.",
    description:
      "The stack is curated around reliability, speed, and the ability to scale without compromise.",
    highlight: "Frontend, backend, platform",
  },
  {
    id: "experience",
    label: "Scale",
    caption: "Leadership",
    title: "The work expands from features to platforms.",
    description:
      "Experience is presented as a sequence of outcomes — scope, ownership, and measurable lift.",
    highlight: "Delivery · Collaboration · Velocity",
  },
  {
    id: "metrics",
    label: "Proof",
    caption: "Impact",
    title: "Signals that recruiters check first.",
    description:
      "The proof chapter anchors the narrative: reliability, growth, and execution that holds up.",
    highlight: "Performance · Retention · Accessibility",
  },
  {
    id: "contact",
    label: "Connect",
    caption: "Launch",
    title: "Bring the next mission to life.",
    description:
      "A quiet, confident close — the call to action stands clear against a calm backdrop.",
    highlight: "Ready to build",
  },
];

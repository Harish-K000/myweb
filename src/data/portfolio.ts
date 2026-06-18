export interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string[];
}

export interface ProjectItem {
    id: string;
    title: string;
    subtitle: string;
    description: string; // Short summary for card
    problem: string;
    solution: string;
    techStack: string[];
    metrics: string[]; // e.g. "20% faster load time"
    image?: string; // path to image
    repoUrl?: string;
    liveUrl?: string;
}

export const PORTFOLIO_DATA = {
    profile: {
        name: "Harish K",
        title: "Full-Stack Software Engineer",
        summary: "I build production-grade web systems — UI, APIs, data, and deployment.",
        social: {
            github: "https://github.com/harishkannan",
            linkedin: "https://www.linkedin.com/in/harish-kannan",
            email: "mailto:harish.kannan.dev@gmail.com",
        },
    },
    techStack: [
        { key: "React", color: "#61dafb" },
        { key: "TypeScript", color: "#3178c6" },
        { key: "Next.js", color: "#ffffff" },
        { key: "Spring Boot", color: "#6db33f" },
        { key: "Java", color: "#f89820" },
        { key: "Python", color: "#3776ab" },
        { key: "Node.js", color: "#339933" },
        { key: "AWS", color: "#ff9900" },
        { key: "Docker", color: "#2496ed" },
        { key: "PostgreSQL", color: "#4169e1" },
        { key: "Tailwind", color: "#38bdf8" },
    ],
    experience: [
        {
            id: "job-1",
            role: "Research Assistant",
            company: "Wilfrid Laurier University",
            period: "Sept 2024 – Present",
            description: [
                "Conduct research on multimedia communication systems and federated learning for next-generation wireless networks.",
                "Co-authoring two papers: Mulsemedia Communication Systems and Joint Optimization of IRS Configuration and Spectrum Access via Federated Multi-Agent SAC in CRNs.",
                "Developed Python simulation pipelines for real-time data analysis and model evaluation; improved model convergence by 25% through optimized preprocessing.",
                "Collaborate with professors to produce IEEE-style research manuscripts with diagrams, graphs, and analytical insights.",
            ],
        },
        {
            id: "job-2",
            role: "Software Engineer",
            company: "Cognizant Technology Solutions (Client: Verizon)",
            period: "Jul 2022 – Aug 2024",
            description: [
                "Developed microservices for Verizon e-commerce cart, checkout, and payment systems using Spring Boot and reactive programming.",
                "Refactored asynchronous workflows to boost checkout performance by 20% and reduced payment failures by 25% via robust error handling and retry logic.",
                "Built and optimized REST APIs, achieving significant latency reduction, with 98% unit test coverage using JUnit/Mockito and CI/CD integration.",
                "Worked in Agile sprints with frontend and DevOps teams to deliver scalable features for millions of daily users.",
            ],
        },
        {
            id: "job-3",
            role: "Full Stack Developer Intern",
            company: "Cognizant Technology Solutions",
            period: "Feb 2022 – Jun 2022",
            description: [
                "Assisted in developing backend modules for shopping cart and order management systems.",
                "Built SQL-backed order tracking flows and implemented asynchronous logic for concurrency handling during peak load.",
                "Collaborated across frontend and backend teams to debug integration issues, document workflows, and enhance deployment stability.",
                "Improved code reuse and reliability through modular service components.",
            ],
        },
        {
            id: "job-4",
            role: "Full Stack Developer (Capstone Project)",
            company: "Depth Training & Physiotherapy",
            period: "Jan 2025 – Apr 2025",
            description: [
                "Led architecture planning, sprint cycles, and backend development for a fitness membership and physiotherapy booking platform.",
                "Built backend APIs with NestJS and PostgreSQL, integrated Stripe payments, designed animated React UI pages, and managed cloud deployment.",
                "Ensured seamless UX with responsive UI transitions and robust error handling.",
            ],
        },
    ] as ExperienceItem[],
    projects: [
        {
            id: "depth-training-website",
            title: "Depth Training Website",
            subtitle: "Immersive learning platform",
            description: "A cinematic training experience that blends storytelling with adaptive lesson plans.",
            problem: "Learners needed a high-retention course format with measurable progress signals.",
            solution: "Delivered a 3D-enhanced curriculum with milestone analytics and modular content delivery.",
            techStack: ["Next.js", "Three.js", "TypeScript", "Tailwind", "Vercel"],
            metrics: ["42% increase in completion rate", "Sub-2s median load time"],
            repoUrl: "https://github.com",
        },
        {
            id: "translate-ease",
            title: "Translate Ease",
            subtitle: "Realtime language assistant",
            description: "A translation workflow that helps distributed teams collaborate without delays.",
            problem: "Cross-border teams struggled with context switching and inconsistent translations.",
            solution: "Built a guided translation flow with glossary memory and real-time reviewer feedback.",
            techStack: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Redis"],
            metrics: ["95% translation consistency", "30% faster review cycles"],
            repoUrl: "https://github.com",
        },
        {
            id: "fmasac-research",
            title: "FMASAC Research",
            subtitle: "Research archive + visualization",
            description: "A digital archive that turns complex research into approachable stories.",
            problem: "Researchers needed a public-facing portal that could highlight dense datasets.",
            solution: "Designed a searchable archive with interactive visual layers and editorial storytelling.",
            techStack: ["Next.js", "D3.js", "TypeScript", "Tailwind", "AWS"],
            metrics: ["3x increase in reader engagement", "50+ research artifacts indexed"],
            repoUrl: "https://github.com",
        },
    ] as ProjectItem[],
};

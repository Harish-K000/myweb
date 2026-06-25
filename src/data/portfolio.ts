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

export interface EducationItem {
    id: string;
    degree: string;
    field: string;
    school: string;
    location: string;
    period: string;
}

export const PORTFOLIO_DATA = {
    profile: {
        name: "Harish K",
        title: "Software Developer | Python, Azure & AI Engineer",
        tagline: "Software Developer with 3+ years building scalable web apps, APIs, and cloud-based enterprise solutions.",
        summary: "Software Developer with 3+ years of experience building scalable web applications, APIs, and cloud-based enterprise solutions. Skilled in Python, JavaScript/TypeScript, React, Spring Boot, SQL, Azure/AWS, Docker, and CI/CD. Hands-on with AI/Generative AI concepts, prompt engineering, and LLM applications.",
        social: {
            github: "https://github.com/Harish-K000",
            linkedin: "https://www.linkedin.com/in/harish-kannan-95811918b/",
            email: "mailto:hkannan.dev@gmail.com",
            phone: "tel:+16476433063",
            phoneDisplay: "+1 (647) 643-3063",
        },
    },
    techStack: [
        { key: "React", color: "#61dafb" },
        { key: "TypeScript", color: "#3178c6" },
        { key: "JavaScript", color: "#f7df1e" },
        { key: "Next.js", color: "#ffffff" },
        { key: "Java", color: "#f89820" },
        { key: "Spring Boot", color: "#6db33f" },
        { key: "Python", color: "#3776ab" },
        { key: "Node.js", color: "#339933" },
        { key: "Azure", color: "#0078d4" },
        { key: "AWS", color: "#ff9900" },
        { key: "Docker", color: "#2496ed" },
        { key: "Kubernetes", color: "#326ce5" },
        { key: "PostgreSQL", color: "#4169e1" },
        { key: "MongoDB", color: "#47a248" },
    ],
    experience: [
        {
            id: "job-1",
            role: "Research Assistant",
            company: "Wilfrid Laurier University",
            period: "Sept 2024 – Dec 2025",
            description: [
                "Conducted research on multimedia communication systems and federated learning for next-generation wireless networks.",
                "Co-authored two papers: Mulsemedia Communication Systems and Joint Optimization of IRS Configuration and Spectrum Access via Federated Multi-Agent SAC in CRNs.",
                "Developed Python simulation pipelines for real-time data analysis and model evaluation; improved model convergence by 25% through optimized preprocessing.",
                "Collaborated with professors to produce IEEE-style research manuscripts with diagrams, graphs, and analytical insights.",
            ],
        },
        {
            id: "job-2",
            role: "Software Developer",
            company: "Cognizant Technology Solutions Pvt. Ltd. (India)",
            period: "Feb 2022 – Aug 2024",
            description: [
                "Developed 15+ enterprise web application modules using Java, Spring Boot, React, and WebFlux, supporting 8,000+ users across business functions.",
                "Built REST APIs and reactive backend services, improving data retrieval performance by 35% through query optimization and database tuning.",
                "Integrated third-party and internal systems, automating 10,000+ monthly transactions and improving data accuracy.",
                "Refactored legacy applications into microservices and containerized services with Docker/Jenkins CI/CD, reducing deployment effort by 40%.",
                "Implemented JUnit/Postman testing, resolved production issues, and optimized reactive workflows, helping maintain 99.8% application availability.",
            ],
        },
    ] as ExperienceItem[],
    education: [
        {
            id: "edu-laurier",
            degree: "Master's in Applied Computing",
            field: "Applied Computing",
            school: "Wilfrid Laurier University",
            location: "Ontario, Canada",
            period: "Sept 2024 – Dec 2025",
        },
        {
            id: "edu-sairam",
            degree: "Bachelor of Engineering",
            field: "Computer Science",
            school: "Sri Sairam Engineering College",
            location: "Chennai, India",
            period: "Sept 2018 – May 2022",
        },
    ] as EducationItem[],
    certifications: [
        "Career Essentials in Generative AI — Microsoft & LinkedIn Learning (2026)",
        "Red Hat Certified System Administrator (RHCSA)",
        "Programming for Everybody (Getting Started with Python) — Coursera",
    ],
    projects: [
        {
            id: "depth-training-website",
            title: "Depth Training & Physiotherapy",
            subtitle: "Healthcare booking platform · Capstone Project",
            description: "A full healthcare booking platform with secure payments, delivered on schedule by a 4-member Scrum team.",
            problem: "The clinic needed online booking with secure payments, but manual scheduling was slow and deploys were risky and slow to ship.",
            solution: "Led the team as Scrum Master across 3 two-week sprints, integrated Stripe for payments, built Node.js booking APIs, added Redis caching on high-traffic endpoints, and configured Docker-based CI/CD.",
            techStack: ["React", "Node.js", "Stripe", "Redis", "Docker"],
            metrics: ["~60% less manual scheduling effort", "Deploy time cut from ~45 min to under 8 min"],
        },
        {
            id: "patient-queue-management",
            title: "AI-Powered Patient Queue Management System",
            subtitle: "Microservices-based patient prioritization system",
            description: "A severity-based patient queue and SMS notification system that cuts wait times and missed appointments.",
            problem: "Clinics needed a fairer, faster way to triage patients and notify them without manual queue management.",
            solution: "Built a microservices-based prioritization system in Spring Boot and Node.js, with Twilio-powered SMS notifications and fault-tolerant, distributed components across multiple service nodes.",
            techStack: ["Spring Boot", "Node.js", "Twilio", "Microservices"],
            metrics: ["~30% reduction in average wait times", "~25% fewer missed appointments (test scenarios)", "99.5% uptime across 3 service nodes under load testing"],
        },
        {
            id: "agentic-browser-automation",
            title: "Agentic Browser Automation",
            subtitle: "AI agent for autonomous job-application workflows",
            description: "An AI-powered browser agent that autonomously navigates and completes online job applications.",
            problem: "Job seekers repeatedly lose hours manually filling out near-identical application forms across many sites.",
            solution: "Built a perception-action-verification agent using Chrome DevTools Protocol, accessibility-tree analysis, and prompt-engineered tool-calling for autonomous form filling, document uploads, and intelligent error recovery — with safety controls and action caching to prevent unintended submissions.",
            techStack: ["Python", "TypeScript", "LLM Tool Calling", "Chrome DevTools Protocol"],
            metrics: [],
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

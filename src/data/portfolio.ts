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
        title: "Software Engineer | Full-Stack, Agentic AI & Cloud Systems",
        tagline: "Software Engineer with 3+ years shipping production systems — now applying that full-stack, cloud-native foundation to agentic LLM automation and applied ML research.",
        summary: "Software engineer with 3+ years of production experience across full-stack development, cloud infrastructure, and applied ML research. Built enterprise-grade Spring Boot microservices and React applications serving 8,000+ users, AWS-based CI/CD pipelines, and RESTful APIs integrating multiple systems. Specializes in agentic LLM systems — autonomous agents with tool calling, multi-step workflow orchestration, and safety verification — alongside hands-on ML pipeline development and validation on research datasets. Comfortable across the stack, from relational database design to model training to production deployment, with a track record of Agile delivery, code review, and cross-functional collaboration.",
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
            id: "job-siemens",
            role: "Software Developer",
            company: "Siemens (Canada)",
            period: "Nov 2025 – Present",
            description: [
                "Designed and integrated 6 Spring Boot REST APIs for a SaaS platform, automating manual data workflows and reducing internal processing effort by ~3 hours per week.",
                "Migrated 3 legacy modules into independently deployable AWS-based microservices, improving deployment frequency from bi-weekly releases to on-demand.",
                "Built GitHub Actions/Docker CI/CD pipelines that cut environment setup from 2 hours to under 20 minutes, and increased automated test coverage from 54% to 81% with JUnit and Cypress.",
                "Delivered 2 major releases with zero critical post-release defects, collaborating in a 9-member Agile team through sprint planning, estimation, and peer code review.",
            ],
        },
        {
            id: "job-1",
            role: "Research Assistant — AI & Machine Learning",
            company: "Wilfrid Laurier University",
            period: "Jan 2025 – Present",
            description: [
                "Developed object-oriented Python data-processing and simulation pipelines for AI and wireless-networking research, building repeatable automated workflows for model training, evaluation, and experiment tracking.",
                "Implemented and validated machine learning model pipelines across 1–2GB research datasets, optimizing preprocessing and improving model convergence by ~25%.",
                "Co-authored 3 IEEE/SSRN research papers spanning blockchain, multimedia communication systems, and federated multi-agent optimization in cognitive radio networks (FMASAC), designing reproducible experimental methodologies with faculty researchers.",
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
        "Machine Learning for All — Coursera",
        "Career Essentials in Generative AI — Microsoft & LinkedIn Learning (2026)",
        "Red Hat Certified System Administrator (RHCSA)",
        "Programming for Everybody (Getting Started with Python) — Coursera",
    ],
    projects: [
        {
            id: "agentic-browser-automation",
            title: "Agentic AI Workflow Automation System",
            subtitle: "Autonomous LLM agent for end-to-end job applications",
            description: "An autonomous LLM agent that completes multi-step job applications end-to-end across Workday, Greenhouse, and Lever ATS platforms.",
            problem: "Job seekers repeatedly lose hours manually filling out near-identical application forms across many ATS platforms.",
            solution: "Built a perception-action-verification agent over Chrome DevTools Protocol combining accessibility-tree snapshots, vision-assisted numbered screenshots, and shadow DOM/iframe traversal for self-healing across React re-renders. Engineered structured tool calling across a 12-tool action space, provider-agnostic LLM integration (AWS Bedrock, Ollama, NVIDIA) with layout-fingerprint action caching, safety gates blocking sensitive fields and final submission, and a unit + browser integration test suite.",
            techStack: ["Python", "TypeScript", "LLM Tool Calling", "Chrome DevTools Protocol", "AWS Bedrock"],
            metrics: [],
        },
        {
            id: "predictive-diabetes-analytics",
            title: "Predictive Analytics for Diabetes",
            subtitle: "ML risk-scoring pipeline + clinical dashboard",
            description: "A diabetes risk classification model served through a REST API with a clinician-facing dashboard.",
            problem: "Clinical staff needed an accessible way to surface diabetes risk scores from patient data without a data-science background.",
            solution: "Trained a classification model in scikit-learn and XGBoost on 50,000+ patient records, then served predictions through a Flask REST API with sub-200ms average response times, with a React.js dashboard surfacing model outputs to non-technical clinical staff.",
            techStack: ["Python", "scikit-learn", "XGBoost", "Flask", "React"],
            metrics: ["85% accuracy on risk classification", "Sub-200ms average API response time"],
        },
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ProjectDetailClient from "./ProjectDetailClient";

type ProjectParams = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return PORTFOLIO_DATA.projects.map((project) => ({
        slug: project.id,
    }));
}

export async function generateMetadata({ params }: ProjectParams): Promise<Metadata> {
    const { slug } = await params;
    const project = PORTFOLIO_DATA.projects.find((item) => item.id === slug);

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: project.title,
        description: project.description,
    };
}

export default async function ProjectDetailPage({ params }: ProjectParams) {
    const { slug } = await params;
    const project = PORTFOLIO_DATA.projects.find((item) => item.id === slug);

    if (!project) {
        notFound();
    }

    return <ProjectDetailClient project={project} />;
}

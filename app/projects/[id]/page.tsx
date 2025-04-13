"use client";
import ProjectDetail from "@/components/layout/project-detail";
import {
  fetchProjectContributors,
  fetchProjects,
  Project,
} from "@/lib/github-api";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ProjectPage({ params }: PageProps) {
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        const res = data?.find(
          (proj) => proj.id === Number.parseInt(params.id)
        );
        setProject(res as Project);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  if (!project) {
    return <div>Project not found</div>;
  }

  const fullProject = {
    ...project,
    // readme,
  };

  return <ProjectDetail project={fullProject} />;
}

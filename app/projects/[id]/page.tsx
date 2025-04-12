import ProjectDetail from "@/components/layout/project-detail";
import { fetchProjectContributors, fetchProjects } from "@/lib/github-api";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  const projects = await fetchProjects();
  const project = projects.find(
    (proj) => proj.id === Number.parseInt(param.id)
  );

  console.log(project?.issues_url);

  if (!project) {
    return <div>Project not found</div>;
  }

  const fullProject = {
    ...project,
    // readme,
  };

  return <ProjectDetail project={fullProject} />;
}

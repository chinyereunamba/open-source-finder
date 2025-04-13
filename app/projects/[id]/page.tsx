import ProjectDetail from "@/components/layout/project-detail";
import {
  fetchProject,
  fetchProjectContributors,
  fetchProjects,
  Project,
} from "@/lib/github-api";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ProjectPage({ params }: any) {
  const param = await params;
  const project = await fetchProject(param.id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const fullProject = {
    ...project,
    // readme,
  };

  return <ProjectDetail project={fullProject} />;
}

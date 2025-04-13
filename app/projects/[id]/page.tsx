import ProjectDetail from "@/components/layout/project-detail";
import {
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
  const data = await fetchProjects();
  const project = data?.find((proj) => proj.id === Number.parseInt(param.id));

  if (!project) {
    return <div>Project not found</div>;
  }

  const fullProject = {
    ...project,
    // readme,
  };

  return <ProjectDetail project={fullProject} />;
}

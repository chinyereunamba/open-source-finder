import EnhancedProjectDetail from "@/components/layout/enhanced-project-detail";
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Project not found
          </h1>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <EnhancedProjectDetail project={project} />;
}

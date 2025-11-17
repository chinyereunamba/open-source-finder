"use client";

import { Suspense, useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import AdvancedSearchDiscovery from "@/components/custom/advanced-search-discovery";
import { fetchProjects, Project } from "@/lib/github-api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function DiscoverPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects(1, "", "All", []);
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:px-6 mx-auto">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Discover Projects
            </h1>
            <p className="text-muted-foreground mt-2">
              Use advanced search, clustering, and trending analysis to find the
              perfect open source projects
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AdvancedSearchDiscovery projects={projects} />
            </Suspense>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

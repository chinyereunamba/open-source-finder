/**
 * Lazy-loaded components for code splitting
 */

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Loading fallback for project list
const ProjectListLoader = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-32 rounded animate-pulse" />
      <Skeleton className="h-8 w-24 rounded animate-pulse" />
    </div>
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg animate-pulse" />
      ))}
    </div>
  </div>
);

// Lazy load the infinite scroll component
export const LazyInfiniteScrollProjects = dynamic(
  () => import("./infinite-scroll-projects"),
  {
    loading: () => <ProjectListLoader />,
    ssr: false,
  }
);

// Lazy load the advanced filter panel (heavy component)
export const LazyAdvancedFilterPanel = dynamic(
  () => import("./advanced-filter-panel"),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-lg" />,
    ssr: false,
  }
);

// Lazy load markdown renderer for README
export const LazyMarkdownRenderer = dynamic(
  () => import("react-markdown").then((mod) => mod.default),
  {
    loading: () => <Skeleton className="h-96 w-full rounded-lg" />,
    ssr: false,
  }
);

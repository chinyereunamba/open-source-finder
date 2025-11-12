import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  ProjectListSkeleton,
  FilterBarSkeleton,
} from "@/components/ui/loading-states";

export default function Loading() {
  return (
    <div className="container px-4 py-8 md:px-6 mx-auto">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Filter Bar */}
        <FilterBarSkeleton />

        {/* Project List */}
        <ProjectListSkeleton viewMode="list" count={9} />
      </div>
    </div>
  );
}

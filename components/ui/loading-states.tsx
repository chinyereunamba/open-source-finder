import { Skeleton } from "./skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "./card";

// Project Card Skeleton
export function ProjectCardSkeleton({
  viewMode = "grid",
}: {
  viewMode?: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2 p-6 md:border-l">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
}

// Project List Skeleton
export function ProjectListSkeleton({
  viewMode = "grid",
  count = 9,
}: {
  viewMode?: "grid" | "list";
  count?: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {[...Array(count)].map((_, i) => (
          <ProjectCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}

// Featured Projects Skeleton
export function FeaturedProjectsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <ProjectCardSkeleton key={i} viewMode="grid" />
      ))}
    </div>
  );
}

// Profile Stats Skeleton
export function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Search Bar Skeleton
export function SearchBarSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-12 flex-1" />
      <Skeleton className="h-12 w-24" />
    </div>
  );
}

// Filter Bar Skeleton
export function FilterBarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  );
}

// Project Detail Skeleton
export function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-4 border-b">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

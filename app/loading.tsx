import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedProjectsSkeleton } from "@/components/ui/loading-states";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {/* Hero Section Skeleton */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl space-y-8">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section Skeleton */}
        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto" />
                  <Skeleton className="h-6 w-48 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects Section Skeleton */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
              <div className="space-y-4">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-6 w-96" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
            <FeaturedProjectsSkeleton count={6} />
          </div>
        </section>
      </main>
    </div>
  );
}

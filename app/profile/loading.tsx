import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Sidebar Skeleton */}
          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-4 w-28 mb-4" />
                  <div className="flex justify-center mt-4 space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <div className="mt-6 w-full">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="md:w-2/3 space-y-6">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-1/4 rounded-md" />
                <Skeleton className="h-10 w-1/4 rounded-md" />
                <Skeleton className="h-10 w-1/4 rounded-md" />
                <Skeleton className="h-10 w-1/4 rounded-md" />
              </div>
              <div className="space-y-4 mt-6">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-md" />
                  <Skeleton className="h-24 w-full rounded-md" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

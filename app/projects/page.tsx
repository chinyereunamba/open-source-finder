import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import FilterBar from "@/components/custom/filter-bar";
import ProjectList from "@/components/custom/list";

export default function ProjectsPage() {
  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Discover open source projects that need contributors
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-8 md:w-[300px]"
              />
            </div>
            <Button asChild>
              <Link href="/submit">Submit a Project</Link>
            </Button>
          </div>
        </div>

        <FilterBar />

        <ProjectList />

        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

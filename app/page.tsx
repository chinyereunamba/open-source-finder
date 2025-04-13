import Link from "next/link";
import { Github, Search } from "lucide-react";
import FeaturedProjects from "@/components/layout/featured-projects";
import FilterBar from "@/components/custom/filter-bar";
import Nav from "@/app/nav";
import HowItWorks from "@/components/layout/how-it-works";
import Footer from "@/components/layout/footer";

import { Button, Input } from "@/components/custom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Discover Open Source Projects That Need Your Help
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto">
                  Find meaningful projects to contribute to and make an impact
                  in the open source community.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container px-4 md:px-6 mx-auto mt-6">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse open source projects
            </h2>
            <div className="flex justify-between gap-2">
              <div className="relative text-xl w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="w-full pl-8 sm:w-[300px] md:w-full text-xl"
                />
              </div>
              <Button>Search</Button>
            </div>
          </div>
        </section>

        <section className="container px-4 py-12 md:px-6 mx-auto">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Projects
              </h2>
              <Link
                href="/projects"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all projects
              </Link>
            </div>
            <FilterBar />
            <FeaturedProjects />
          </div>
        </section>

        <section className="container px-4 py-12 md:px-6 border-t mx-auto">
          <HowItWorks />
        </section>
      </main>
    </div>
  );
}

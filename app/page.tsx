import Link from "next/link";
import {  Github } from "lucide-react";
import FeaturedProjects from "@/components/layout/featured-projects";
import FilterBar from "@/components/custom/filter-bar";
import Nav from "@/components/custom/nav";
import HowItWorks from "@/components/layout/how-it-works";

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
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto  md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js and Tailwind CSS. Data from GitHub API.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

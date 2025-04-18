import Link from "next/link";
import { Github, Search, Sparkles, Users } from "lucide-react";
import FeaturedProjects from "@/components/layout/featured-projects";
import FilterBar from "@/components/custom/filter-bar";
import HowItWorks from "@/components/layout/how-it-works";
import Footer from "@/components/layout/footer";

import { Button, Input } from "@/components/custom";
import Header from "@/app/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

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
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold  mb-12 text-gray-900 dark:text-white">
              Why Contribute to Open Source?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Improve Your Skills
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Work on real-world projects, learn from experienced
                  developers, and improve your coding skills.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Build Your Network
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with like-minded developers, collaborate on projects,
                  and build meaningful relationships.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mb-4">
                  <Github className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Make an Impact
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Help build software used by millions of developers worldwide
                  and make a lasting impact on the community.
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

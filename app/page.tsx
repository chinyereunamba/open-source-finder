"use client";

import Link from "next/link";
import FeaturedProjects from "@/components/layout/featured-projects";
import SearchBarHome from "@/components/SearchBarHome";
import Features from "@/components/layout/features";
import EnhancedHowItWorks from "@/components/layout/enhanced-how-it-works";
import HeroSection from "@/components/layout/hero-section";
import { Button } from "@/components/custom";
import { FadeTransition } from "@/components/ui/page-transition";

export default function Home() {
  return (
    <FadeTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <HeroSection />

          {/* Enhanced Features Section */}
          <Features />

          {/* Featured Projects Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold  mb-6">
                    Featured Projects
                  </h2>
                  <p className="text-xl leading-relaxed">
                    Discover popular projects that are actively looking for
                    contributors
                  </p>
                </div>
                <Button className="hidden md:inline-flex">
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
              <FeaturedProjects />
              <div className="text-center mt-16 md:hidden">
                <Button className="inline-flex">
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Enhanced How It Works Section */}
          <EnhancedHowItWorks />

          {/* Search Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Start Contributing?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Browse thousands of open source projects and find the perfect
                  match for your skills and interests
                </p>
              </div>
              <div className="w-full">
                <SearchBarHome />
              </div>
            </div>
          </section>
        </main>
      </div>
    </FadeTransition>
  );
}

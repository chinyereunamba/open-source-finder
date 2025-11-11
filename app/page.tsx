import Link from "next/link";
import FeaturedProjects from "@/components/layout/featured-projects";
import SearchBarHome from "@/components/SearchBarHome";
import EnhancedHero from "@/components/layout/enhanced-hero";
import EnhancedFeatures from "@/components/layout/enhanced-features";
import EnhancedHowItWorks from "@/components/layout/enhanced-how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <EnhancedHero />

        {/* Enhanced Features Section */}
        <EnhancedFeatures />

        {/* Search Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Start Contributing?
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Browse thousands of open source projects and find the perfect
                match for your skills and interests
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBarHome />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Featured Projects
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover popular projects that are actively looking for
                  contributors
                </p>
              </div>
              <Link
                href="/projects"
                className="hidden md:inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 hover:shadow-lg transition-all duration-300"
              >
                View All Projects
              </Link>
            </div>
            <FeaturedProjects />
            <div className="text-center mt-16 md:hidden">
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 hover:shadow-lg transition-all duration-300"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced How It Works Section */}
        <EnhancedHowItWorks />
      </main>
    </div>
  );
}

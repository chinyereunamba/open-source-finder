"use client";

import { motion } from "framer-motion";
import TypingAnimation from "@/components/ui/typing-animation";
import SearchBarHome from "@/components/SearchBarHome";

export default function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-federal-blue-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* <TypingAnimation
                text="Discover Open Source Projects"
                speed={80}
                className="block"
              /> */}
              <span className="block text-olivine-500 mt-2">
                Find your next open-source project — fast.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-[800px] text-federal-blue-200 text-lg md:text-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Find meaningful projects to contribute to and make an impact in
              the open source community. Connect with developers worldwide and
              build something amazing together.
            </motion.p>
          </motion.div>

          {/* Stats section */}
          {/* <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-blue-500">10K+</div>
              <div className="text-federal-blue-300 mt-1">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-blue-500">50K+</div>
              <div className="text-federal-blue-300 mt-1">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-blue-500">100K+</div>
              <div className="text-federal-blue-300 mt-1">Issues Resolved</div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}

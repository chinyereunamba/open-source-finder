"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, Star, GitBranch, Heart } from "lucide-react";
import Link from "next/link";

export const typingTexts = [
  "Build amazing software together",
  "Learn from experienced developers",
  "Make an impact on millions of users",
  "Grow your skills with real projects",
  "Connect with the global dev community",
];

export default function EnhancedHero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentText = typingTexts[currentTextIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentTextIndex]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-3/4 right-1/3 w-3 h-3 bg-gray-400 rounded-full opacity-20"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-blue-200 rounded-full opacity-25"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Discover Open Source</span>
              <br />
              <span className="text-blue-700">Projects that Need</span>
              <br />
              <span className="text-navy-blue-500">Your Help</span>
            </h1>
          </motion.div>

          {/* Typing Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Join thousands of developers who
            </p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-xl md:text-2xl font-semibold text-blue-700 min-h-[2rem]">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-gray-400"
                >
                  |
                </motion.span>
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/projects">
                  Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-blue-700 hover:text-blue-700 font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                <Link href="/submit">Submit Your Project</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full mr-3">
                  <Code className="h-6 w-6 text-blue-700" />
                </div>
                <span className="text-3xl font-bold text-gray-900">1000+</span>
              </div>
              <p className="text-gray-600 font-medium">Active Projects</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gray-100 rounded-full mr-3">
                  <Users className="h-6 w-6 text-gray-700" />
                </div>
                <span className="text-3xl font-bold text-gray-900">5000+</span>
              </div>
              <p className="text-gray-600 font-medium">Contributors</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-yellow-100 rounded-full mr-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">50k+</span>
              </div>
              <p className="text-gray-600 font-medium">GitHub Stars</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 opacity-10"
      >
        <Code className="h-16 w-16 text-blue-700" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 opacity-10"
      >
        <GitBranch className="h-20 w-20 text-gray-600" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-20 opacity-10"
      >
        <Heart className="h-12 w-12 text-blue-500" />
      </motion.div>
    </section>
  );
}

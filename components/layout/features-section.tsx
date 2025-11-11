"use client";

import { motion } from "framer-motion";
import { Github, Search, Sparkles, Users } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Improve Your Skills",
      description:
        "Work on real-world projects, learn from experienced developers, and improve your coding skills through hands-on contribution.",
      color: "olivine",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Build Your Network",
      description:
        "Connect with like-minded developers, collaborate on projects, and build meaningful relationships in the tech community.",
      color: "navy-blue",
    },
    {
      icon: <Github className="h-8 w-8" />,
      title: "Make an Impact",
      description:
        "Help build software used by millions of developers worldwide and make a lasting impact on the open source community.",
      color: "cinnabar",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-federal-blue-100">
            Why Contribute to Open Source?
          </h2>
          <p className="text-federal-blue-300 text-lg max-w-2xl mx-auto">
            Join millions of developers who are building the future of
            technology together
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center h-full">
                <motion.div
                  className={`w-16 h-16 mx-auto flex items-center justify-center bg-${feature.color}-100 text-${feature.color}-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-4 text-federal-blue-100">
                  {feature.title}
                </h3>
                <p className="text-federal-blue-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

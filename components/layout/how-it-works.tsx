"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Flag, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-12 w-12" />,
      title: "Find Projects",
      description:
        "Discover open source projects that need contributors, filter by language, stars, and more.",
      color: "olivine",
      step: "01",
    },
    {
      icon: <Flag className="h-12 w-12" />,
      title: "Choose an Issue",
      description:
        "Pick an issue that matches your skills and interests from the project's open issues.",
      color: "navy-blue",
      step: "02",
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Start Contributing",
      description:
        "Follow the project's contribution guidelines and become part of the open source community.",
      color: "cinnabar",
      step: "03",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-olivine-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-federal-blue-100">
            How It Works
          </h2>
          <p className="text-federal-blue-300 max-w-2xl mx-auto text-lg">
            Getting started with open source contributions is easier than you
            think. Follow these simple steps:
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-olivine-500 transform -translate-y-1/2"></div>
          <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-olivine-500 transform -translate-y-1/2"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="relative"
            >
              <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8 text-center relative">
                  {/* Step number */}
                  <div
                    className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-${step.color}-500 text-white rounded-full flex items-center justify-center text-sm font-bold`}
                  >
                    {step.step}
                  </div>

                  <motion.div
                    className={`flex justify-center mb-6 text-${step.color}-500`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.icon}
                  </motion.div>

                  <h3 className="text-xl font-bold mb-4 text-federal-blue-100">
                    {step.title}
                  </h3>
                  <p className="text-federal-blue-300 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

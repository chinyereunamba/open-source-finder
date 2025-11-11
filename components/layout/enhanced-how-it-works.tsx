"use client";

import { motion } from "framer-motion";
import { Search, Flag, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    icon: Search,
    title: "Discover Projects",
    description:
      "Browse through thousands of open source projects filtered by language, difficulty level, and your interests.",
    details:
      "Use our advanced search and filtering system to find projects that match your skill level and interests. Filter by programming language, project size, activity level, and contribution difficulty.",
    color: "blue",
  },
  {
    icon: Flag,
    title: "Choose an Issue",
    description:
      "Pick an issue that matches your skills from the project's open issues, including beginner-friendly options.",
    details:
      "Look for issues labeled 'good first issue' or 'help wanted'. Read the issue description carefully and check if it aligns with your current skill level and available time.",
    color: "gray",
  },
  {
    icon: Users,
    title: "Start Contributing",
    description:
      "Follow the project's contribution guidelines and become part of the vibrant open source community.",
    details:
      "Fork the repository, create a branch, make your changes, and submit a pull request. Engage with maintainers and other contributors for feedback and collaboration.",
    color: "slate",
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "blue":
      return {
        iconBg: "bg-blue-700",
        iconText: "text-white",
        stepBg: "bg-blue-100",
        stepText: "text-blue-700",
        border: "border-blue-300",
        activeBg: "bg-blue-50",
        progressBg: "bg-blue-600",
      };
    case "gray":
      return {
        iconBg: "bg-gray-700",
        iconText: "text-white",
        stepBg: "bg-gray-100",
        stepText: "text-gray-700",
        border: "border-gray-300",
        activeBg: "bg-gray-50",
        progressBg: "bg-gray-600",
      };
    case "slate":
      return {
        iconBg: "bg-slate-700",
        iconText: "text-white",
        stepBg: "bg-slate-100",
        stepText: "text-slate-700",
        border: "border-slate-300",
        activeBg: "bg-slate-50",
        progressBg: "bg-slate-600",
      };
    default:
      return {
        iconBg: "bg-blue-700",
        iconText: "text-white",
        stepBg: "bg-blue-100",
        stepText: "text-blue-700",
        border: "border-blue-300",
        activeBg: "bg-blue-50",
        progressBg: "bg-blue-600",
      };
  }
};

export default function EnhancedHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting started with open source contributions is easier than you
            think. Follow these simple steps to begin your journey.
          </p>
        </motion.div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 transform -translate-y-1/2 rounded-full"></div>
            <motion.div
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-600 to-slate-600 transform -translate-y-1/2 transition-all duration-1000 rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
            ></motion.div>

            <div className="relative flex justify-between items-center">
              {steps.map((step, index) => {
                const colorClasses = getColorClasses(step.color);
                const Icon = step.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center cursor-pointer group"
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    {/* Step Circle */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-24 h-24 ${colorClasses.iconBg} ${colorClasses.iconText} rounded-full flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-shadow duration-300 relative z-10 border-4 border-white`}
                    >
                      <Icon className="h-12 w-12" />
                    </motion.div>

                    {/* Step Content */}
                    <div className="text-center max-w-xs">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow (except for last step) */}
                    {index < steps.length - 1 && (
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-12 -right-8 text-gray-400"
                      >
                        <ArrowRight className="h-6 w-6" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-20 p-8 rounded-3xl ${
              getColorClasses(steps[activeStep].color).activeBg
            } border-2 ${
              getColorClasses(steps[activeStep].color).border
            } max-w-4xl mx-auto`}
          >
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Step {activeStep + 1}: {steps[activeStep].title}
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed">
              {steps[activeStep].details}
            </p>
          </motion.div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-8 max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const colorClasses = getColorClasses(step.color);
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`bg-white p-8 rounded-3xl shadow-lg border-2 ${colorClasses.border}`}
              >
                <div className="flex items-start space-x-6">
                  <div
                    className={`w-16 h-16 ${colorClasses.iconBg} ${colorClasses.iconText} rounded-2xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span
                        className={`text-sm font-bold ${colorClasses.stepText} ${colorClasses.stepBg} px-3 py-1 rounded-full mr-3`}
                      >
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <p className="text-gray-500 text-sm">{step.details}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

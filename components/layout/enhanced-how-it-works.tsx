"use client";

import { motion } from "framer-motion";
import { Search, Flag, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../custom";

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
  useEffect(() => {
    setInterval(() => {
      if (activeStep < 4) {
        setActiveStep((prev) => prev + 1);
      }
      if (activeStep > 4) {
        setActiveStep(0);
      }
    }, 10000);
  }, [activeStep]);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl  max-w-3xl leading-relaxed">
            Getting started with open source contributions is easier than you
            think. Follow these simple steps to begin your journey.
          </p>
        </motion.div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}

            <div className="flex justify-between items-start gap-6">
              {steps.map((step, index) => {
                const colorClasses = getColorClasses(step.color);
                const Icon = step.icon;

                return (
                  <Card
                    key={index}
                    className={`px-6 bg-transparent flex flex-col border-2 group min-h-[405px] hover:border-primary transition-all duration-300 w-full ${
                      activeStep == index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    {/* Step Circle */}
                    <div className="grid place-items-center">
                      <Icon className="h-12 w-12" />
                    </div>

                    {/* Step Content */}
                    <div className="">
                      <h3 className="text-xl font-bold text-center mb-4">
                        {step.title}
                      </h3>
                      <p className=" text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={` ${
                        activeStep == index ? "block" : "hidden"
                      } `}
                    >
                      <p className="text-lg leading-relaxed">{step.details}</p>
                    </motion.div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Active Step Details */}
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
                className={` p-8 rounded-3xl shadow-lg border-2 ${colorClasses.border}`}
              >
                <div className="flex items-start space-x-6">
                  <div className={``}>
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
                    <h3 className="text-xl font-bold  mb-3">{step.title}</h3>
                    <p className=" mb-4">{step.description}</p>
                    <p className=" text-sm">{step.details}</p>
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

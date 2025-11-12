"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Github, Code, Heart, Zap } from "lucide-react";
import { Card } from "../custom";

const features = [
  {
    icon: Sparkles,
    title: "Improve Your Skills",
    description:
      "Work on real-world projects, learn from experienced developers, and improve your coding skills through hands-on contribution.",
    color: "blue",
    delay: 0.1,
  },
  {
    icon: Users,
    title: "Build Your Network",
    description:
      "Connect with like-minded developers, collaborate on projects, and build meaningful relationships in the tech community.",
    color: "gray",
    delay: 0.2,
  },
  {
    icon: Github,
    title: "Make an Impact",
    description:
      "Help build software used by millions of developers worldwide and make a lasting impact on the open source community.",
    color: "slate",
    delay: 0.3,
  },
  {
    icon: Code,
    title: "Learn Best Practices",
    description:
      "Discover industry standards, code review processes, and development workflows used by top-tier projects.",
    color: "indigo",
    delay: 0.4,
  },
  {
    icon: Heart,
    title: "Give Back",
    description:
      "Contribute to the tools and libraries you use daily, helping to maintain and improve the software ecosystem.",
    color: "blue",
    delay: 0.5,
  },
  {
    icon: Zap,
    title: "Accelerate Career",
    description:
      "Build a strong portfolio, gain recognition in the community, and open doors to new career opportunities.",
    color: "gray",
    delay: 0.6,
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "blue":
      return {
        iconBg: "bg-blue-100",
        iconText: "text-blue-700",
        hoverBg: "hover:bg-blue-50",
        borderHover: "hover:border-blue-300",
        titleHover: "group-hover:text-blue-700",
      };
    case "gray":
      return {
        iconBg: "bg-gray-100",
        // iconText: "text-gray-700",
        hoverBg: "hover:bg-gray-50",
        borderHover: "hover:border-gray-300",
        // titleHover: "group-hover:text-gray-700",
      };
    case "slate":
      return {
        iconBg: "bg-slate-100",
        // iconText: "text-slate-700",
        hoverBg: "hover:bg-slate-50",
        borderHover: "hover:border-slate-300",
        // titleHover: "group-hover:text-slate-700",
      };
    case "indigo":
      return {
        iconBg: "bg-indigo-100",
        // iconText: "text-indigo-700",
        hoverBg: "hover:bg-indigo-50",
        borderHover: "hover:border-indigo-300",
        // titleHover: "group-hover:text-indigo-700",
      };
    default:
      return {
        iconBg: "bg-blue-100",
        // iconText: "text-blue-700",
        hoverBg: "hover:bg-blue-50",
        borderHover: "hover:border-blue-300",
        // titleHover: "group-hover:text-blue-700",
      };
  }
};

export default function Features() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className=" mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Why Contribute to Open Source?
          </h2>
          <p className="text-xl text-text max-w-3xl leading-relaxed">
            Join a global community of developers and discover the countless
            benefits of contributing to open source projects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            const Icon = feature.icon;

            return (
              <Card key={index} className={"group px-6"}>
                <div className="text-center">
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 },
                    }}
                    className={`w-18 h-18 mx-auto flex items-center justify-center rounded-2xl mb-6 group-hover:shadow-lg transition-shadow duration-300`}
                  >
                    <Icon className="h-9 w-9" />
                  </motion.div>

                  <h3
                    className={`text-xl font-bold  mb-4 transition-colors duration-300`}
                  >
                    {feature.title}
                  </h3>

                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

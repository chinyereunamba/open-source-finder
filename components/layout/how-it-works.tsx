import { Card, CardContent } from "@/components/ui/card";
import { Search, Flag, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-primary" />,
      title: "Find Projects",
      description:
        "Discover open source projects that need contributors, fits by language, stars, and more.",
    },
    {
      icon: <Flag className="h-12 w-12 text-primary" />,
      title: "Choose an Issue",
      description:
        "Pick an issue that matches your skills and interests from the project's open issues.",
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Start Contributing",
      description:
        "Follow the project's contribution guidelines and become part of the open source community.",
    },
  ];

  return (
    <section className="container py-16">
      <div className="text-left mb-12">
        <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl">
          Getting started with open source contributions is easier than you
          think. Follow these simple steps:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="bg-card border-transparent shadow-none hover:shadow-md hover:border-border cursor-pointer transition-all">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;

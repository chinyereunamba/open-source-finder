"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  GitFork,
  GitPullRequest,
  Award,
  TrendingUp,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  index: number;
}

function StatCard({ icon, label, value, change, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
            {change && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>{change}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardStats() {
  const stats = [
    {
      icon: <GitPullRequest className="h-5 w-5 text-primary" />,
      label: "Total Contributions",
      value: 47,
      change: "+12%",
    },
    {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      label: "Projects Starred",
      value: 23,
      change: "+5",
    },
    {
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      label: "Current Streak",
      value: "15 days",
      change: "🔥",
    },
    {
      icon: <Award className="h-5 w-5 text-purple-500" />,
      label: "Badges Earned",
      value: 8,
      change: "+2",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
}

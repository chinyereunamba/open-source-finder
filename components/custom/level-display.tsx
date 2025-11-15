"use client";

import { UserStats } from "@/lib/achievement-system";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LevelDisplayProps {
  stats: UserStats;
  variant?: "compact" | "detailed";
  showExperience?: boolean;
}

export function LevelDisplay({
  stats,
  variant = "detailed",
  showExperience = true,
}: LevelDisplayProps) {
  const experienceInCurrentLevel =
    stats.experience - (stats.experience - stats.experienceToNextLevel);
  const experienceNeededForLevel =
    stats.experienceToNextLevel + experienceInCurrentLevel;
  const progressPercentage =
    (experienceInCurrentLevel / experienceNeededForLevel) * 100;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg">
          {stats.level}
        </div>
        {showExperience && (
          <div className="flex-1 min-w-0">
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-text mt-1">
              {experienceInCurrentLevel} / {experienceNeededForLevel} XP
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br bg-card rounded-xl p-6 border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {/* Level Badge */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <div className="text-xs text-white/80 font-medium">Level</div>
              <div className="text-2xl font-bold text-white">{stats.level}</div>
            </div>
          </div>
          {/* Decorative Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse" />
        </motion.div>

        {/* Progress Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-lg font-semibold text-text">
              {getLevelTitle(stats.level)}
            </h3>
            <span className="text-sm text-muted-foreground">
              {stats.experienceToNextLevel} XP to next level
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Progress value={progressPercentage} className="h-3" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{ width: "50%" }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {experienceInCurrentLevel.toLocaleString()} XP
              </span>
              <span className="text-gray-600">
                {experienceNeededForLevel.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalContributions}
              </div>
              <div className="text-xs text-gray-600">Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.unlockedAchievements}
              </div>
              <div className="text-xs text-gray-600">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                {stats.contributionStreak}
                <span className="text-base">🔥</span>
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getLevelTitle(level: number): string {
  if (level >= 25) return "Master Contributor";
  if (level >= 20) return "Expert Developer";
  if (level >= 15) return "Senior Contributor";
  if (level >= 10) return "Veteran";
  if (level >= 5) return "Rising Star";
  if (level >= 3) return "Active Member";
  return "Newcomer";
}

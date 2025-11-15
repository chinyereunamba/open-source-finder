"use client";

import { UserAchievement } from "@/lib/achievement-system";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AchievementProgressProps {
  achievement: UserAchievement;
  showDetails?: boolean;
}

export function AchievementProgress({
  achievement,
  showDetails = true,
}: AchievementProgressProps) {
  const progressPercentage =
    (achievement.progress / achievement.maxProgress) * 100;
  const isComplete = achievement.isUnlocked;

  return (
    <motion.div
      className={cn(
        "p-4 rounded-lg border transition-all",
        isComplete
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
          : "bg-card border hover:bg-card/80"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "text-3xl flex-shrink-0",
            !isComplete && "opacity-50 grayscale"
          )}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-text flex items-center gap-2">
                {achievement.title}
                {isComplete && <span className="text-green-600">✓</span>}
              </h4>
              {showDetails && (
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>
              )}
            </div>

            {/* Rarity Badge */}
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                achievement.rarity === "legendary" &&
                  "bg-orange-100 text-orange-700",
                achievement.rarity === "epic" &&
                  "bg-pink-100 text-purple-700",
                achievement.rarity === "rare" &&
                  "bg-cyan-100 text-blue-700",
                achievement.rarity === "common" && "bg-accent text-text"
              )}
            >
              {achievement.rarity}
            </span>
          </div>

          {/* Progress Bar */}
          {!isComplete && (
            <div className="space-y-1">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {achievement.progress} / {achievement.maxProgress}
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          )}

          {/* Completion Info */}
          {isComplete && achievement.unlockedAt && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                🎉 Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                +{achievement.experienceReward} XP
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

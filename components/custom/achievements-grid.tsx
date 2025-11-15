"use client";

import { UserAchievement, AchievementCategory } from "@/lib/achievement-system";
import { AchievementBadge } from "./achievement-badge";
import { AchievementProgress } from "./achievement-progress";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AchievementsGridProps {
  achievements: UserAchievement[];
  viewMode?: "grid" | "list";
  filterCategory?: AchievementCategory | "all";
  showProgress?: boolean;
  onAchievementClick?: (achievement: UserAchievement) => void;
}

const categoryLabels: Record<AchievementCategory | "all", string> = {
  all: "All Achievements",
  contribution: "Contribution",
  social: "Social",
  exploration: "Exploration",
  milestone: "Milestone",
};

const categoryIcons: Record<AchievementCategory | "all", string> = {
  all: "🏆",
  contribution: "💻",
  social: "🤝",
  exploration: "🔍",
  milestone: "🎯",
};

export function AchievementsGrid({
  achievements,
  viewMode = "grid",
  filterCategory = "all",
  showProgress = true,
  onAchievementClick,
}: AchievementsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    AchievementCategory | "all"
  >(filterCategory);

  // Filter achievements by category
  const filteredAchievements = achievements.filter((achievement) =>
    selectedCategory === "all"
      ? true
      : achievement.category === selectedCategory
  );

  // Sort achievements: unlocked first, then by rarity, then by progress
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // Unlocked achievements first
    if (a.isUnlocked !== b.isUnlocked) {
      return a.isUnlocked ? -1 : 1;
    }

    // Then by rarity (legendary > epic > rare > common)
    const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
    const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
    if (rarityDiff !== 0) return rarityDiff;

    // Then by progress percentage
    const aProgress = (a.progress / a.maxProgress) * 100;
    const bProgress = (b.progress / b.maxProgress) * 100;
    return bProgress - aProgress;
  });

  const unlockedCount = filteredAchievements.filter((a) => a.isUnlocked).length;
  const totalCount = filteredAchievements.length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
            {categoryIcons[selectedCategory]} {categoryLabels[selectedCategory]}
          </h2>
          <p className="text-muted-foreground mt-1">
            {unlockedCount} of {totalCount} achievements unlocked
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="w-32 bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-text">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(
          ["all", "contribution", "social", "exploration", "milestone"] as const
        ).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-secondary text-text hover:bg-gray-200"
            )}
          >
            <span>{categoryIcons[category]}</span>
            {categoryLabels[category]}
            <span className="text-xs opacity-75">
              (
              {
                achievements.filter(
                  (a) => category === "all" || a.category === category
                ).length
              }
              )
            </span>
          </button>
        ))}
      </div>

      {/* Achievements Display */}
      {viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          layout
        >
          {sortedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              layout
            className="grid place-items-center bg-card p-6 rounded-md"
            >
              <div className="text-center space-y-2">
                <AchievementBadge
                  achievement={achievement}
                  size="lg"
                  showProgress={showProgress}
                  onClick={() => onAchievementClick?.(achievement)}
                />
                <div>
                  <h4 className="font-medium text-sm text-text truncate">
                    {achievement.title}
                  </h4>
                  {showProgress && !achievement.isUnlocked && (
                    <p className="text-xs text-gray-500">
                      {achievement.progress}/{achievement.maxProgress}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sortedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <AchievementProgress
                achievement={achievement}
                showDetails={true}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedAchievements.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-text mb-2">
            No achievements in this category yet
          </h3>
          <p className="text-muted-foreground">
            Start contributing to projects to unlock your first achievements!
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Compact version for dashboard
interface AchievementsPreviewProps {
  achievements: UserAchievement[];
  maxDisplay?: number;
  onViewAll?: () => void;
}

export function AchievementsPreview({
  achievements,
  maxDisplay = 6,
  onViewAll,
}: AchievementsPreviewProps) {
  const recentUnlocked = achievements
    .filter((a) => a.isUnlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return b.unlockedAt.getTime() - a.unlockedAt.getTime();
    })
    .slice(0, maxDisplay);

  const inProgress = achievements
    .filter((a) => !a.isUnlocked && a.progress > 0)
    .sort((a, b) => {
      const aProgress = (a.progress / a.maxProgress) * 100;
      const bProgress = (b.progress / b.maxProgress) * 100;
      return bProgress - aProgress;
    })
    .slice(0, maxDisplay - recentUnlocked.length);

  const displayAchievements = [...recentUnlocked, ...inProgress];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">
          Recent Achievements
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {displayAchievements.map((achievement) => (
          <div key={achievement.id} className="text-center">
            <AchievementBadge
              achievement={achievement}
              size="md"
              showProgress={true}
            />
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {achievement.title}
            </p>
          </div>
        ))}
      </div>

      {displayAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">🎯</div>
          <p>Start exploring to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}

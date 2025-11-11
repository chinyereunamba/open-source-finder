"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterChip {
  id: string;
  label: string;
  value: string;
  type: "language" | "topic" | "difficulty" | "status";
  removable?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (chipId: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function FilterChips({
  chips,
  onRemove,
  onClear,
  className,
}: FilterChipsProps) {
  if (chips.length === 0) {
    return null;
  }

  const getChipColor = (type: FilterChip["type"]) => {
    switch (type) {
      case "language":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      case "topic":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "difficulty":
        return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
      case "status":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getTypeIcon = (type: FilterChip["type"]) => {
    switch (type) {
      case "language":
        return "🔧";
      case "topic":
        return "🏷️";
      case "difficulty":
        return "📊";
      case "status":
        return "🔄";
      default:
        return "🔍";
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 animate-in fade-in-0 slide-in-from-left-2",
              getChipColor(chip.type)
            )}
          >
            <span className="text-xs">{getTypeIcon(chip.type)}</span>
            <span>{chip.label}</span>
            {chip.removable !== false && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(chip.id)}
                className="h-4 w-4 p-0 ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {chip.label} filter</span>
              </Button>
            )}
          </div>
        ))}
      </div>

      {onClear && chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground text-sm h-8 px-2"
        >
          Clear all
          <X className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

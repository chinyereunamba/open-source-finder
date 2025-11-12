"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
      <Button
        size="sm"
        variant={viewMode === "list" ? "default" : "ghost"}
        className={`h-8 px-3 ${
          viewMode === "list"
            ? "bg-secondary text-text hover:bg-secondary"
            : "text-text hover:text-text hover:bg-secondary"
        }`}
        onClick={() => onViewModeChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === "grid" ? "default" : "ghost"}
        className={`h-8 px-3 ${
          viewMode === "grid"
            ? "bg-secondary text-text hover:bg-secondary"
            : "text-text hover:text-text hover:bg-secondary"
        }`}
        onClick={() => onViewModeChange("grid")}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
}

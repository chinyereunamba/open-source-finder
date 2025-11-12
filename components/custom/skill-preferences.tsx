"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Settings, Plus, X } from "lucide-react";

interface SkillPreferencesProps {
  skills: {
    languages: string[];
    skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
    interests: string[];
  };
  editable?: boolean;
  onUpdate?: (skills: any) => void;
}

const skillLevelColors = {
  beginner: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  intermediate: "bg-olivine-500/10 text-olivine-700 dark:text-olivine-400",
  advanced:
    "bg-federal_blue-500/10 text-federal_blue-700 dark:text-federal_blue-400",
  expert: "bg-cinnabar-500/10 text-cinnabar-700 dark:text-cinnabar-400",
};

export function SkillPreferences({
  skills,
  editable = false,
  onUpdate,
}: SkillPreferencesProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-olivine-500" />
            Skills & Preferences
          </CardTitle>
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Skill Level</h4>
          <Badge
            className={skillLevelColors[skills.skillLevel]}
            variant="secondary"
          >
            {skills.skillLevel.charAt(0).toUpperCase() +
              skills.skillLevel.slice(1)}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Programming Languages</h4>
          <div className="flex flex-wrap gap-2">
            {skills.languages.map((lang) => (
              <Badge key={lang} variant="outline" className="gap-1">
                {lang}
                {isEditing && (
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                )}
              </Badge>
            ))}
            {isEditing && (
              <Button variant="outline" size="sm" className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {skills.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1">
                {interest}
                {isEditing && (
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                )}
              </Badge>
            ))}
            {isEditing && (
              <Button variant="outline" size="sm" className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

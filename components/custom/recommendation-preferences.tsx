"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Save, Sparkles } from "lucide-react";
import { UserInterestTracker } from "@/lib/user-interests";
import { UserPreferences } from "@/lib/recommendation-engine";
import { toast } from "sonner";

const POPULAR_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
];

const POPULAR_TOPICS = [
  "web-development",
  "machine-learning",
  "data-science",
  "devops",
  "mobile",
  "blockchain",
  "game-development",
  "security",
  "cloud",
  "ai",
  "frontend",
  "backend",
  "fullstack",
  "api",
  "database",
];

export function RecommendationPreferences() {
  const { data: session } = useSession();
  const userId = session?.user?.email || "";

  const [preferences, setPreferences] = useState<UserPreferences>(
    UserInterestTracker.getUserPreferences(userId)
  );
  const [newLanguage, setNewLanguage] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userId) {
      const prefs = UserInterestTracker.getUserPreferences(userId);
      setPreferences(prefs);
    }
  }, [userId]);

  const handleAddLanguage = (language: string) => {
    if (language && !preferences.preferredLanguages.includes(language)) {
      const updated = {
        ...preferences,
        preferredLanguages: [...preferences.preferredLanguages, language],
      };
      setPreferences(updated);
      setNewLanguage("");
      setHasChanges(true);
    }
  };

  const handleRemoveLanguage = (language: string) => {
    const updated = {
      ...preferences,
      preferredLanguages: preferences.preferredLanguages.filter(
        (l) => l !== language
      ),
    };
    setPreferences(updated);
    setHasChanges(true);
  };

  const handleAddInterest = (interest: string) => {
    if (interest && !preferences.interests.includes(interest)) {
      const updated = {
        ...preferences,
        interests: [...preferences.interests, interest],
      };
      setPreferences(updated);
      setNewInterest("");
      setHasChanges(true);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updated = {
      ...preferences,
      interests: preferences.interests.filter((i) => i !== interest),
    };
    setPreferences(updated);
    setHasChanges(true);
  };

  const handleSkillLevelChange = (
    skillLevel: "beginner" | "intermediate" | "advanced"
  ) => {
    const updated = { ...preferences, skillLevel };
    setPreferences(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!userId) {
      toast.error("You must be signed in to save preferences");
      return;
    }

    UserInterestTracker.saveUserPreferences(userId, preferences);
    setHasChanges(false);
    toast.success("Preferences saved! Your recommendations will be updated.");
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Sign in to customize your recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Recommendation Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skill Level */}
        <div className="space-y-2">
          <Label>Skill Level</Label>
          <Select
            value={preferences.skillLevel}
            onValueChange={(value) =>
              handleSkillLevelChange(
                value as "beginner" | "intermediate" | "advanced"
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            We'll recommend projects that match your experience level
          </p>
        </div>

        {/* Preferred Languages */}
        <div className="space-y-2">
          <Label>Preferred Languages</Label>
          <div className="flex gap-2">
            <Select value={newLanguage} onValueChange={setNewLanguage}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_LANGUAGES.filter(
                  (lang) => !preferences.preferredLanguages.includes(lang)
                ).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => newLanguage && handleAddLanguage(newLanguage)}
              disabled={!newLanguage}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.preferredLanguages.map((lang) => (
              <Badge key={lang} variant="secondary" className="gap-1">
                {lang}
                <button
                  onClick={() => handleRemoveLanguage(lang)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {preferences.preferredLanguages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No languages selected
              </p>
            )}
          </div>
        </div>

        {/* Interests/Topics */}
        <div className="space-y-2">
          <Label>Interests & Topics</Label>
          <div className="flex gap-2">
            <Select value={newInterest} onValueChange={setNewInterest}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_TOPICS.filter(
                  (topic) => !preferences.interests.includes(topic)
                ).map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => newInterest && handleAddInterest(newInterest)}
              disabled={!newInterest}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1">
                {interest}
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {preferences.interests.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No interests selected
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </div>

        {/* Stats */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium">Your Activity</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">
                {preferences.viewedProjects.length}
              </p>
              <p className="text-xs text-muted-foreground">Viewed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {preferences.bookmarkedProjects.length}
              </p>
              <p className="text-xs text-muted-foreground">Bookmarked</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {preferences.contributedProjects.length}
              </p>
              <p className="text-xs text-muted-foreground">Contributed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

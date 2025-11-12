"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Settings, Bell, User, Code, Save } from "lucide-react";
import { toast } from "sonner";
import { RecommendationPreferences } from "@/components/custom/recommendation-preferences";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [skillLevel, setSkillLevel] = useState("intermediate");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([
    "JavaScript",
    "TypeScript",
    "Python",
  ]);
  const [interests, setInterests] = useState<string[]>([
    "web-development",
    "machine-learning",
  ]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [projectRecommendations, setProjectRecommendations] = useState(true);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">
          You must be signed in to access settings.
        </h2>
        <Link href="/auth/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const availableLanguages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "Ruby",
    "PHP",
    "Swift",
  ];

  const availableInterests = [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "devops", label: "DevOps" },
    { value: "data-science", label: "Data Science" },
    { value: "game-development", label: "Game Development" },
    { value: "blockchain", label: "Blockchain" },
    { value: "security", label: "Security" },
  ];

  const toggleLanguage = (language: string) => {
    if (preferredLanguages.includes(language)) {
      setPreferredLanguages(preferredLanguages.filter((l) => l !== language));
    } else {
      setPreferredLanguages([...preferredLanguages, language]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast.success("Settings saved successfully!");
  };

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:px-6 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Settings & Preferences</h1>
          </div>
          <p className="text-muted-foreground">
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Recommendation Preferences */}
          <RecommendationPreferences />

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email updates about your activity
                  </p>
                </div>
                <Checkbox
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={(checked) =>
                    setEmailNotifications(checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-xs text-muted-foreground">
                    Get a weekly summary of recommended projects
                  </p>
                </div>
                <Checkbox
                  id="weekly-digest"
                  checked={weeklyDigest}
                  onCheckedChange={(checked) =>
                    setWeeklyDigest(checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="project-recommendations">
                    Project Recommendations
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive personalized project suggestions
                  </p>
                </div>
                <Checkbox
                  id="project-recommendations"
                  checked={projectRecommendations}
                  onCheckedChange={(checked) =>
                    setProjectRecommendations(checked as boolean)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Palette, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

interface ProfileCustomizationProps {
  settings: {
    showEmail: boolean;
    showLocation: boolean;
    showActivity: boolean;
    showStats: boolean;
    profileVisibility: "public" | "private" | "connections";
  };
  onSave?: (settings: any) => void;
}

export function ProfileCustomization({
  settings: initialSettings,
  onSave,
}: ProfileCustomizationProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(settings);
    setHasChanges(false);
    toast.success("Profile settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-olivine-500" />
          Profile Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Privacy Settings</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Show Email</Label>
              <p className="text-xs text-muted-foreground">
                Display your email on your profile
              </p>
            </div>
            <Switch
              id="show-email"
              checked={settings.showEmail}
              onCheckedChange={() => handleToggle("showEmail")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-location">Show Location</Label>
              <p className="text-xs text-muted-foreground">
                Display your location on your profile
              </p>
            </div>
            <Switch
              id="show-location"
              checked={settings.showLocation}
              onCheckedChange={() => handleToggle("showLocation")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-activity">Show Activity</Label>
              <p className="text-xs text-muted-foreground">
                Display your recent activity timeline
              </p>
            </div>
            <Switch
              id="show-activity"
              checked={settings.showActivity}
              onCheckedChange={() => handleToggle("showActivity")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-stats">Show Statistics</Label>
              <p className="text-xs text-muted-foreground">
                Display your contribution statistics
              </p>
            </div>
            <Switch
              id="show-stats"
              checked={settings.showStats}
              onCheckedChange={() => handleToggle("showStats")}
            />
          </div>
        </div>

        {hasChanges && (
          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

const languages = [
  "All",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "PHP",
  "Ruby",
  "C#",
];

const topics = [
  "good-first-issue",
  "help-wanted",
  "beginner-friendly",
  "documentation",
  "bug",
  "enhancement",
  "frontend",
  "backend",
  "mobile",
  "web",
];

export default function FilterBar() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicClick = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const clearFilters = () => {
    setSelectedLanguage("All");
    setSelectedTopics([]);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        {(selectedLanguage !== "All" || selectedTopics.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            Clear filters
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Language:</span>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Topics:</span>
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 5).map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopics.includes(topic) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
                {selectedTopics.includes(topic) && (
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopics(
                        selectedTopics.filter((t) => t !== topic)
                      );
                    }}
                  />
                )}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              More...
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

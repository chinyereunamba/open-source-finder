"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { fetchProjectReadme } from "@/lib/github-api";

interface ReadmeProps {
  projectId: number;
  projectUrl: string;
}

export default function ProjectReadme({ projectId, projectUrl }: ReadmeProps) {
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getReadme = async () => {
      try {
        setLoading(true);
        const content = await fetchProjectReadme(projectId);
        if (content) {
          // Decode base64 content
          const decodedContent = atob(content);
          setReadme(decodedContent);
        } else {
          setError("README not found");
        }
      } catch (err) {
        console.error("Error fetching README:", err);
        setError("Failed to load README");
      } finally {
        setLoading(false);
      }
    };

    getReadme();
  }, [projectId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            README
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading README...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            README
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" asChild>
              <a
                href={`${projectUrl}/blob/main/README.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simple markdown-like rendering for demo
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-6 mb-4 first:mt-0">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      }

      // Code blocks
      if (line.startsWith("```")) {
        return <div key={index} className="my-2" />; // Simplified for demo
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="ml-6 mt-1 list-disc">
            {line.substring(2)}
          </li>
        );
      }

      // Empty lines
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Regular paragraphs
      return (
        <p key={index} className="mt-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            README
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`${projectUrl}/blob/main/README.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none dark:prose-invert">
          {readme ? (
            <div className="space-y-2">{renderMarkdown(readme)}</div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No README content available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

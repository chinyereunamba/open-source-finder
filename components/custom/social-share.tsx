"use client";

import { useState } from "react";
import { Share2, Twitter, Linkedin, Facebook, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface SocialShareProps {
  project: {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
  };
  trigger?: React.ReactNode;
}

export default function SocialShare({ project, trigger }: SocialShareProps) {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const projectUrl = `${window.location.origin}/projects/${project.id}`;
  const shareText = `Check out ${project.full_name} - ${project.description} ⭐ ${project.stargazers_count} stars`;

  const trackShare = async (platform: string) => {
    if (session) {
      try {
        await fetch("/api/community/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project.id,
            platform,
          }),
        });
      } catch (error) {
        console.error("Error tracking share:", error);
      }
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(projectUrl)}&hashtags=opensource,github`;
    window.open(url, "_blank", "width=600,height=400");
    trackShare("twitter");
    setOpen(false);
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      projectUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
    trackShare("linkedin");
    setOpen(false);
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      projectUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
    trackShare("facebook");
    setOpen(false);
  };

  const shareToReddit = () => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(
      projectUrl
    )}&title=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
    trackShare("reddit");
    setOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      trackShare("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      action: shareToTwitter,
      color: "hover:bg-blue-50 hover:text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: shareToLinkedIn,
      color: "hover:bg-blue-50 hover:text-blue-700",
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: shareToFacebook,
      color: "hover:bg-blue-50 hover:text-blue-800",
    },
    {
      name: "Reddit",
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
      action: shareToReddit,
      color: "hover:bg-orange-50 hover:text-orange-600",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-1">{project.full_name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                ⭐ {project.stargazers_count.toLocaleString()} stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                className={`justify-start ${option.color}`}
                onClick={option.action}
              >
                <option.icon className="w-4 h-4 mr-2" />
                {option.name}
              </Button>
            ))}
          </div>

          <div className="border-t pt-4">
            <label className="text-sm font-medium mb-2 block">Copy Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="px-3"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

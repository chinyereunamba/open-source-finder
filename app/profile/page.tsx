"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Star,
  GitFork,
  Code,
  CheckCircle2,
  Award,
  BookOpen,
  MessageSquare,
  Edit,
} from "lucide-react";
import UserContributions from "@/components/custom/user-contributions";
import UserProjects from "@/components/custom/user-projects";
import UserActivity from "@/components/custom/user-activity";
import RecommendedProjects from "@/components/custom/recommended-projects";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">
          You must be signed in to view your profile.
        </h2>
        <Link href="/auth/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }
  const user = session.user as any;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="h-5 w-5" />;
      case "CheckCircle2":
        return <CheckCircle2 className="h-5 w-5" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5" />;
      case "GitFork":
        return <GitFork className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:px-6 mx-auto">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Sidebar */}
            <div className="md:w-1/3 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage
                        src={user?.image || "/placeholder.svg"}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>
                        {user?.name?.substring(0, 2).toUpperCase() || "US"}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">
                      {user?.name || "User"}
                    </h2>
                    <p className="text-muted-foreground">
                      <a
                        href={user?.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        @{user?.login || "username"}
                      </a>
                    </p>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{user?.location || ""}</span>
                    </div>
                    {user?.company && (
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span className="font-medium mr-1">Company:</span>
                        <span>{user.company}</span>
                      </div>
                    )}
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Github className="h-4 w-4 mr-1" />
                      <a
                        href={user?.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user?.html_url}
                      </a>
                    </div>
                    {user?.blog && (
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 mr-1" />
                        <a
                          href={user.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {user.blog}
                        </a>
                      </div>
                    )}
                    {user?.twitter_username && (
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Twitter className="h-4 w-4 mr-1" />
                        <a
                          href={`https://twitter.com/${user.twitter_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          @{user.twitter_username}
                        </a>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                      <span className="text-xs text-muted-foreground">
                        <b>Followers:</b> {user?.followers ?? 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <b>Following:</b> {user?.following ?? 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <b>Public Repos:</b> {user?.public_repos ?? 0}
                      </span>
                    </div>
                    <div className="mt-4 w-full">
                      <p className="text-sm text-muted-foreground">
                        {user?.bio || "No bio provided."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Main Content */}
            <div className="md:w-2/3 space-y-6 flex flex-col items-center justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Welcome to your profile!</CardTitle>
                  <CardDescription>
                    This is your GitHub-connected profile. More features coming
                    soon.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

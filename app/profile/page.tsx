"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export default function ProfilePage() {
  const [user] = useState({
    username: "sarahjohnson",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Full-stack developer passionate about open source. Contributing to React, Next.js, and TypeScript projects. Always learning and sharing knowledge with the community.",
    location: "San Francisco, CA",
    joinedDate: "January 2020",
    socialLinks: {
      github: "https://github.com/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      website: "https://sarahjohnson.dev",
      email: "sarah@example.com",
    },
    stats: {
      contributions: 247,
      pullRequests: 83,
      issuesReported: 56,
      projectsContributed: 12,
    },
    badges: [
      {
        id: 1,
        name: "Top Contributor",
        description: "Among the top 5% of contributors",
        icon: "Award",
        date: "June 2023",
      },
      {
        id: 2,
        name: "Bug Hunter",
        description: "Reported and fixed 50+ bugs",
        icon: "CheckCircle2",
        date: "March 2023",
      },
      {
        id: 3,
        name: "Documentation Hero",
        description: "Improved documentation in 10+ projects",
        icon: "BookOpen",
        date: "January 2023",
      },
      {
        id: 4,
        name: "First Pull Request",
        description: "Successfully merged your first PR",
        icon: "GitFork",
        date: "February 2020",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "GraphQL",
      "CSS",
      "Tailwind",
    ],
    languages: [
      { name: "JavaScript", percentage: 40 },
      { name: "TypeScript", percentage: 30 },
      { name: "HTML/CSS", percentage: 15 },
      { name: "Python", percentage: 10 },
      { name: "Other", percentage: 5 },
    ],
  });

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
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={user.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Website</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={`mailto:${user.socialLinks.email}`}>
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </a>
                    </Button>
                  </div>
                  <div className="mt-6 w-full">
                    <Button className="w-full" asChild>
                      <Link href="/profile/edit">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{user.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contribution Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <Code className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-xl font-bold">
                      {user.stats.contributions}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Contributions
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <GitFork className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-xl font-bold">
                      {user.stats.pullRequests}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Pull Requests
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <MessageSquare className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-xl font-bold">
                      {user.stats.issuesReported}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Issues
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <Star className="h-5 w-5 mb-1 text-primary" />
                    <span className="text-xl font-bold">
                      {user.stats.projectsContributed}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Projects
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.languages.map((language) => (
                  <div key={language.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{language.name}</span>
                      <span className="text-muted-foreground">
                        {language.percentage}%
                      </span>
                    </div>
                    <Progress value={language.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 space-y-6">
            <Tabs defaultValue="contributions">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
              </TabsList>
              <TabsContent value="contributions" className="mt-6">
                <UserContributions />
              </TabsContent>
              <TabsContent value="projects" className="mt-6">
                <UserProjects />
              </TabsContent>
              <TabsContent value="activity" className="mt-6">
                <UserActivity />
              </TabsContent>
              <TabsContent value="badges" className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.badges.map((badge) => (
                    <Card key={badge.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            {getBadgeIcon(badge.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{badge.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {badge.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned {badge.date}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Projects</CardTitle>
                <CardDescription>
                  Based on your skills and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedProjects />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

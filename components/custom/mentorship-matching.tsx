"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Star,
  MessageCircle,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Heart,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  githubUsername: string;
  bio: string;
  expertise: string[];
  languages: string[];
  experience: number; // years
  rating: number;
  totalMentees: number;
  activeMentees: number;
  availability: "available" | "limited" | "unavailable";
  responseTime: string;
  specialties: string[];
  timezone: string;
}

interface MentorshipRequest {
  id: string;
  mentorId: string;
  projectId: number;
  issueNumber?: number;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
}

interface MentorshipMatchingProps {
  projectId: number;
  issueNumber?: number;
  isGoodFirstIssue?: boolean;
}

export default function MentorshipMatching({
  projectId,
  issueNumber,
  isGoodFirstIssue = false,
}: MentorshipMatchingProps) {
  const { data: session } = useSession();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  useEffect(() => {
    // Simulate fetching mentors
    const fetchMentors = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const demoMentors: Mentor[] = [
        {
          id: "1",
          name: "Sarah Chen",
          avatar: "https://github.com/github.png",
          githubUsername: "sarahchen",
          bio: "Senior React developer with 8+ years experience. Love helping newcomers get started with open source!",
          expertise: ["React", "TypeScript", "JavaScript", "Node.js"],
          languages: ["JavaScript", "TypeScript", "Python"],
          experience: 8,
          rating: 4.9,
          totalMentees: 45,
          activeMentees: 3,
          availability: "available",
          responseTime: "< 2 hours",
          specialties: ["Frontend", "React Ecosystem", "Accessibility"],
          timezone: "PST (UTC-8)",
        },
        {
          id: "2",
          name: "Alex Rodriguez",
          avatar: "https://github.com/github.png",
          githubUsername: "alexrod",
          bio: "Full-stack engineer passionate about clean code and mentoring. Specialized in React and backend systems.",
          expertise: ["React", "Node.js", "GraphQL", "PostgreSQL"],
          languages: ["JavaScript", "TypeScript", "Go"],
          experience: 6,
          rating: 4.8,
          totalMentees: 32,
          activeMentees: 2,
          availability: "available",
          responseTime: "< 4 hours",
          specialties: ["Full-stack", "API Design", "Testing"],
          timezone: "EST (UTC-5)",
        },
        {
          id: "3",
          name: "Jordan Kim",
          avatar: "https://github.com/github.png",
          githubUsername: "jordankim",
          bio: "Open source maintainer and React core contributor. Happy to help with complex React issues and performance optimization.",
          expertise: ["React", "Performance", "Webpack", "Babel"],
          languages: ["JavaScript", "TypeScript", "Rust"],
          experience: 10,
          rating: 5.0,
          totalMentees: 67,
          activeMentees: 5,
          availability: "limited",
          responseTime: "< 1 day",
          specialties: ["Performance", "Build Tools", "Core React"],
          timezone: "JST (UTC+9)",
        },
        {
          id: "4",
          name: "Maria Santos",
          avatar: "https://github.com/github.png",
          githubUsername: "mariasantos",
          bio: "Frontend architect with expertise in React, accessibility, and design systems. Beginner-friendly mentor.",
          expertise: ["React", "CSS", "Design Systems", "Accessibility"],
          languages: ["JavaScript", "TypeScript", "CSS"],
          experience: 7,
          rating: 4.9,
          totalMentees: 38,
          activeMentees: 4,
          availability: "available",
          responseTime: "< 3 hours",
          specialties: ["Design Systems", "Accessibility", "CSS-in-JS"],
          timezone: "CET (UTC+1)",
        },
      ];

      setMentors(demoMentors);
      setLoading(false);
    };

    fetchMentors();
  }, [projectId]);

  const handleRequestMentorship = async (mentor: Mentor) => {
    if (!session) {
      // Show sign-in prompt
      return;
    }

    // In a real app, this would send the request to the backend
    console.log(
      "Requesting mentorship from:",
      mentor.name,
      "Message:",
      requestMessage
    );

    // Reset form
    setRequestMessage("");
    setShowRequestDialog(false);
    setSelectedMentor(null);

    // Show success message (in a real app, use toast)
    alert(
      `Mentorship request sent to ${mentor.name}! They'll respond within ${mentor.responseTime}.`
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "limited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "limited":
        return "Limited";
      case "unavailable":
        return "Unavailable";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Finding Mentors...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Available Mentors
        </CardTitle>
        <CardDescription>
          Get guidance from experienced contributors
          {isGoodFirstIssue && " - Perfect for first-time contributors!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors
            .filter((m) => m.availability !== "unavailable")
            .map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-start space-x-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {mentor.name}
                        <Badge
                          className={getAvailabilityColor(mentor.availability)}
                        >
                          {getAvailabilityText(mentor.availability)}
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        @{mentor.githubUsername} • {mentor.experience} years
                        experience
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{mentor.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mentor.totalMentees} mentees
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 4).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-xs text-muted-foreground"
                      >
                        +{mentor.expertise.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Responds {mentor.responseTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {mentor.activeMentees} active mentees
                      </span>
                    </div>

                    <Dialog
                      open={
                        showRequestDialog && selectedMentor?.id === mentor.id
                      }
                      onOpenChange={setShowRequestDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedMentor(mentor)}
                          disabled={!session}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Request Mentorship
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Request Mentorship</DialogTitle>
                          <DialogDescription>
                            Send a message to {mentor.name} requesting
                            mentorship for this issue.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={mentor.avatar}
                                alt={mentor.name}
                              />
                              <AvatarFallback>
                                {mentor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{mentor.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Responds {mentor.responseTime}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">
                              Your message:
                            </label>
                            <textarea
                              className="w-full mt-1 p-3 border rounded-md resize-none"
                              rows={4}
                              placeholder={`Hi ${
                                mentor.name.split(" ")[0]
                              }, I'm working on ${
                                issueNumber
                                  ? `issue #${issueNumber}`
                                  : "this project"
                              } and would love your guidance. I'm ${
                                isGoodFirstIssue
                                  ? "new to open source"
                                  : "looking to contribute"
                              } and could use some help getting started.`}
                              value={requestMessage}
                              onChange={(e) =>
                                setRequestMessage(e.target.value)
                              }
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowRequestDialog(false);
                                setSelectedMentor(null);
                                setRequestMessage("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleRequestMentorship(mentor)}
                              disabled={!requestMessage.trim()}
                            >
                              Send Request
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}

          {mentors.filter((m) => m.availability !== "unavailable").length ===
            0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No mentors available</h3>
              <p className="text-muted-foreground mb-4">
                All mentors are currently busy, but you can still contribute!
              </p>
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                View Contribution Guide
              </Button>
            </div>
          )}
        </div>

        {!session && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Want mentorship?</h4>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Sign in to request guidance from experienced contributors and get
              personalized help with your contributions.
            </p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Sign In to Request Mentorship
            </Button>
          </div>
        )}

        {/* Mentorship Benefits */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Why Get a Mentor?
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Faster Learning</p>
                <p className="text-muted-foreground">
                  Get personalized guidance and avoid common pitfalls
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Code Reviews</p>
                <p className="text-muted-foreground">
                  Receive detailed feedback on your contributions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Network Building</p>
                <p className="text-muted-foreground">
                  Connect with the open source community
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

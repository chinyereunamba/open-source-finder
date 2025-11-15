"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Star,
  MessageSquare,
  GitFork,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  githubUsername?: string;
  score: number;
  rank: number;
  contributions: number;
  reviewsCount: number;
  helpfulVotes: number;
  streak: number;
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  userRank?: number;
  totalUsers: number;
}

export default function CommunityLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<
    Record<string, LeaderboardData>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("contributions");

  useEffect(() => {
    fetchLeaderboard("contributions");
    fetchLeaderboard("reviews");
    fetchLeaderboard("helpful");
  }, []);

  const fetchLeaderboard = async (type: string) => {
    try {
      const response = await fetch(
        `/api/community/leaderboard?type=${type}&limit=50`
      );
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData((prev) => ({ ...prev, [type]: data }));
      }
    } catch (error) {
      console.error(`Error fetching ${type} leaderboard:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getScoreLabel = (type: string) => {
    switch (type) {
      case "contributions":
        return "Contributions";
      case "reviews":
        return "Reviews";
      case "helpful":
        return "Helpful Votes";
      default:
        return "Score";
    }
  };

  const getScoreValue = (entry: LeaderboardEntry, type: string) => {
    switch (type) {
      case "contributions":
        return entry.contributions;
      case "reviews":
        return entry.reviewsCount;
      case "helpful":
        return entry.helpfulVotes;
      default:
        return entry.score;
    }
  };

  const LeaderboardList = ({ type }: { type: string }) => {
    const data = leaderboardData[type];

    if (!data) {
      return (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {data.entries.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              entry.rank <= 3
                ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank)}
            </div>

            <Avatar className="w-10 h-10">
              <AvatarImage src={entry.avatar} alt={entry.username} />
              <AvatarFallback>
                {entry.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{entry.username}</span>
                {entry.githubUsername && (
                  <Badge variant="secondary" className="text-xs">
                    @{entry.githubUsername}
                  </Badge>
                )}
                {entry.streak > 0 && (
                  <Badge variant="outline" className="text-xs">
                    🔥 {entry.streak} day streak
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  {entry.contributions}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {entry.reviewsCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {entry.helpfulVotes}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-lg">
                {getScoreValue(entry, type)}
              </div>
              <div className="text-xs text-muted-foreground">
                {getScoreLabel(type)}
              </div>
            </div>
          </div>
        ))}

        {data.entries.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Community Leaderboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Top contributors in the open source community
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contributions" className="text-xs">
              <GitFork className="w-4 h-4 mr-1" />
              Contributions
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">
              <Star className="w-4 h-4 mr-1" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="helpful" className="text-xs">
              <MessageSquare className="w-4 h-4 mr-1" />
              Helpful
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributions" className="mt-4">
            <LeaderboardList type="contributions" />
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <LeaderboardList type="reviews" />
          </TabsContent>

          <TabsContent value="helpful" className="mt-4">
            <LeaderboardList type="helpful" />
          </TabsContent>
        </Tabs>

        {leaderboardData[activeTab] && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Showing top contributors out of{" "}
              {leaderboardData[activeTab].totalUsers} total users
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

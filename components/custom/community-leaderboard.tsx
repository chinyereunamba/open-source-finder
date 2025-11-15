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
import { Progress } from "@/components/ui/progress";

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
        setLeaderboardData((prev) => ({
          ...prev,
          [type]: data,
        }));
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

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600";
    }
  };

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  };

  const LeaderboardList = ({
    type,
    data,
  }: {
    type: string;
    data: LeaderboardData;
  }) => {
    if (!data?.entries) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.entries.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
              entry.rank <= 3
                ? "bg-gradient-to-r from-blue-50 to-purple-50"
                : "bg-card"
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar */}
            <Avatar className="w-10 h-10">
              <AvatarImage src={entry.avatar} alt={entry.username} />
              <AvatarFallback>
                {entry.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{entry.username}</h4>
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
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  {entry.contributions} contributions
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {entry.reviewsCount} reviews
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {entry.helpfulVotes} helpful
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div
                className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getRankBadgeColor(
                  entry.rank
                )}`}
              >
                {formatScore(entry.score)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">points</div>
            </div>
          </div>
        ))}

        {/* Stats Footer */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total active contributors: {data.totalUsers.toLocaleString()}
            </span>
            {data.userRank && (
              <span className="font-medium">Your rank: #{data.userRank}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
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
              <MessageSquare className="w-4 h-4 mr-1" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="helpful" className="text-xs">
              <Star className="w-4 h-4 mr-1" />
              Helpful
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributions" className="mt-6">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Top Contributors</h3>
              <p className="text-sm text-muted-foreground">
                Ranked by total contributions to open source projects
              </p>
            </div>
            <LeaderboardList
              type="contributions"
              data={leaderboardData.contributions}
            />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Top Reviewers</h3>
              <p className="text-sm text-muted-foreground">
                Ranked by number of project reviews written
              </p>
            </div>
            <LeaderboardList type="reviews" data={leaderboardData.reviews} />
          </TabsContent>

          <TabsContent value="helpful" className="mt-6">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Most Helpful</h3>
              <p className="text-sm text-muted-foreground">
                Ranked by helpful votes received on reviews and comments
              </p>
            </div>
            <LeaderboardList type="helpful" data={leaderboardData.helpful} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

import { Metadata } from "next";
import CommunityLeaderboard from "@/components/custom/community-leaderboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Users,
  Star,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Community - Enhanced OSS Finder",
  description: "Discover top contributors and community leaders in open source",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container px-4 py-8 md:px-6 mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Community Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrate the amazing contributors who make open source thrive.
              Discover top reviewers, helpful community members, and rising
              stars.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">1,250</div>
                <div className="text-sm text-muted-foreground">
                  Active Contributors
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold">3,847</div>
                <div className="text-sm text-muted-foreground">
                  Reviews Written
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <MessageSquare className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold">12,456</div>
                <div className="text-sm text-muted-foreground">
                  Helpful Comments
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-3xl font-bold">89%</div>
                <div className="text-sm text-muted-foreground">
                  Positive Feedback
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Contributors */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CommunityLeaderboard />
            </div>

            <div className="space-y-6">
              {/* Community Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Community Highlights
                  </CardTitle>
                  <CardDescription>
                    Recent achievements and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Top Reviewer</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sarah Chen earned the "Super Reviewer" badge for writing
                      50+ helpful reviews this month!
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Rising Star</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Alex Rodriguez joined the top 10 contributors with amazing
                      project contributions!
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Community Helper</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mike Johnson reached 1000+ helpful votes for his
                      insightful comments!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* How to Contribute */}
              <Card>
                <CardHeader>
                  <CardTitle>Join the Community</CardTitle>
                  <CardDescription>
                    Start contributing and climb the leaderboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Write Reviews</h4>
                        <p className="text-xs text-muted-foreground">
                          Share your experience with projects you've used
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Help Others</h4>
                        <p className="text-xs text-muted-foreground">
                          Comment on projects and help newcomers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Contribute Code</h4>
                        <p className="text-xs text-muted-foreground">
                          Submit pull requests and fix issues
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          4
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Stay Active</h4>
                        <p className="text-xs text-muted-foreground">
                          Maintain streaks and engage regularly
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

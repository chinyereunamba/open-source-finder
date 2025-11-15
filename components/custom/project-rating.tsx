"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProjectRatingProps {
  projectId: number;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
  userRating?: number;
}

export default function ProjectRating({ projectId }: ProjectRatingProps) {
  const { data: session } = useSession();
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [projectId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `/api/community/ratings?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRatingData(data);
        setUserRating(data.userRating || 0);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating: number) => {
    if (!session) {
      toast.error("Please sign in to rate this project");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/community/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          rating,
        }),
      });

      if (response.ok) {
        setUserRating(rating);
        await fetchRatings(); // Refresh the data
        toast.success("Rating submitted successfully!");
      } else {
        toast.error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    size = "w-5 h-5"
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={interactive ? () => submitRating(star) : undefined}
            onMouseEnter={
              interactive ? () => setHoveredRating(star) : undefined
            }
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ratingData) {
    return null;
  }

  const displayRating = hoveredRating || userRating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Community Rating
          <div className="flex items-center gap-2">
            {renderStars(ratingData.averageRating)}
            <span className="text-sm text-muted-foreground">
              {ratingData.averageRating.toFixed(1)} ({ratingData.totalRatings}{" "}
              reviews)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingData.ratingDistribution[stars] || 0;
            const percentage =
              ratingData.totalRatings > 0
                ? (count / ratingData.totalRatings) * 100
                : 0;

            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-8">{stars}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* User Rating */}
        {session && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Your Rating:</span>
              {userRating > 0 && (
                <span className="text-sm text-muted-foreground">
                  You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {renderStars(displayRating, true)}
              {isSubmitting && (
                <span className="text-sm text-muted-foreground">
                  Submitting...
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click a star to rate this project
            </p>
          </div>
        )}

        {!session && (
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to rate this project
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

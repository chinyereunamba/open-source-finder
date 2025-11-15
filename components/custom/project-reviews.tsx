"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProjectReviewsProps {
  projectId: number;
}

interface Review {
  id: string;
  projectId: number;
  userId: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    avatar: string;
    githubUsername?: string;
  };
}

interface ReviewsData {
  reviews: Review[];
  totalCount: number;
  averageRating: number;
  hasMore: boolean;
}

export default function ProjectReviews({ projectId }: ProjectReviewsProps) {
  const { data: session } = useSession();
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [projectId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `/api/community/reviews?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviewsData(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!session) {
      toast.error("Please sign in to write a review");
      return;
    }

    if (!newReview.rating || !newReview.title || !newReview.content) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/community/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          ...newReview,
        }),
      });

      if (response.ok) {
        setNewReview({ rating: 0, title: "", content: "" });
        setShowAddReview(false);
        await fetchReviews();
        toast.success("Review submitted successfully!");
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              interactive ? "cursor-pointer" : ""
            } transition-colors ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <div className="flex items-center justify-between">
          <CardTitle>
            Community Reviews ({reviewsData?.totalCount || 0})
          </CardTitle>
          {session && (
            <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rating
                    </label>
                    {renderStars(newReview.rating, true, (rating) =>
                      setNewReview({ ...newReview, rating })
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Title
                    </label>
                    <Input
                      placeholder="Summarize your experience..."
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview({ ...newReview, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Review
                    </label>
                    <Textarea
                      placeholder="Share your detailed experience with this project..."
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview({ ...newReview, content: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddReview(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={submitReview} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviewsData?.reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to share your experience with this project
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewsData?.reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={review.user.avatar}
                      alt={review.user.name}
                    />
                    <AvatarFallback>
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.user.name}</span>
                      {review.user.githubUsername && (
                        <Badge variant="secondary" className="text-xs">
                          @{review.user.githubUsername}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5 stars
                      </span>
                    </div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-sm leading-relaxed mb-3">
                      {review.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {reviewsData?.hasMore && (
              <div className="text-center">
                <Button variant="outline" onClick={fetchReviews}>
                  Load More Reviews
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

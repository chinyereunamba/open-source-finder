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
  const [page, setPage] = useState(1);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [projectId, page]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `/api/community/reviews?projectId=${projectId}&page=${page}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setReviewsData(data);
        } else {
          setReviewsData((prev) =>
            prev
              ? {
                  ...data,
                  reviews: [...prev.reviews, ...data.reviews],
                }
              : data
          );
        }
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
        setShowReviewDialog(false);
        setPage(1);
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
    size = "w-4 h-4"
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              interactive ? "cursor-pointer" : ""
            } transition-colors ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={
              interactive
                ? () => setNewReview((prev) => ({ ...prev, rating: star }))
                : undefined
            }
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

  if (loading && !reviewsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
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
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews ({reviewsData?.totalCount || 0})
          </CardTitle>
          {session && (
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
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
                    {renderStars(newReview.rating, true, "w-6 h-6")}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Title
                    </label>
                    <Input
                      placeholder="Summarize your experience..."
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Review
                    </label>
                    <Textarea
                      placeholder="Share your detailed experience with this project..."
                      rows={6}
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowReviewDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitReview}
                      disabled={
                        submitting ||
                        !newReview.rating ||
                        !newReview.title ||
                        !newReview.content
                      }
                    >
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
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to share your experience with this project
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewsData?.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={review.user.avatar}
                      alt={review.user.name}
                    />
                    <AvatarFallback>
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                    <h4 className="font-medium">{review.title}</h4>
                    <p className="text-sm leading-relaxed">{review.content}</p>
                    <div className="flex items-center gap-4 pt-2">
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
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More Reviews"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

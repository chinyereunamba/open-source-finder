"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Reply, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProjectCommentsProps {
  projectId: number;
}

interface Comment {
  id: string;
  projectId: number;
  userId: string;
  content: string;
  parentId?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    avatar: string;
    githubUsername?: string;
  };
  replies?: Comment[];
}

interface CommentsData {
  comments: Comment[];
  totalCount: number;
  hasMore: boolean;
}

export default function ProjectComments({ projectId }: ProjectCommentsProps) {
  const { data: session } = useSession();
  const [commentsData, setCommentsData] = useState<CommentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/community/comments?projectId=${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCommentsData(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (content: string, parentId?: string) => {
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          content: content.trim(),
          parentId,
        }),
      });

      if (response.ok) {
        if (parentId) {
          setReplyContent("");
          setReplyTo(null);
        } else {
          setNewComment("");
        }
        await fetchComments();
        toast.success("Comment posted successfully!");
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div className={`${isReply ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
          <AvatarFallback className="text-xs">
            {comment.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user.name}</span>
            {comment.user.githubUsername && (
              <Badge variant="secondary" className="text-xs">
                @{comment.user.githubUsername}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Heart className="w-3 h-3 mr-1" />
              {comment.likes}
            </Button>
            {!isReply && session && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => submitComment(replyContent, comment.id)}
                  disabled={submitting || !replyContent.trim()}
                >
                  {submitting ? "Posting..." : "Reply"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
          <MessageCircle className="w-5 h-5" />
          Discussion ({commentsData?.totalCount || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add comment form */}
        {session ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                />
                <AvatarFallback className="text-xs">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Join the discussion..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => submitComment(newComment)}
                disabled={submitting || !newComment.trim()}
                size="sm"
              >
                <Send className="w-4 h-4 mr-1" />
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Sign in to join the discussion
            </p>
          </div>
        )}

        {/* Comments list */}
        {commentsData?.comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation about this project
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {commentsData?.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}

            {commentsData?.hasMore && (
              <div className="text-center">
                <Button variant="outline" onClick={fetchComments}>
                  Load More Comments
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

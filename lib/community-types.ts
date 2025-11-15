// Community feature types and interfaces

export interface ProjectRating {
  id: string;
  projectId: number;
  userId: string;
  rating: number; // 1-5 stars
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectReview {
  id: string;
  projectId: number;
  userId: string;
  rating: number;
  title: string;
  content: string;
  helpful: number; // number of helpful votes
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    avatar: string;
    githubUsername?: string;
  };
}

export interface ProjectComment {
  id: string;
  projectId: number;
  userId: string;
  content: string;
  parentId?: string; // for nested comments
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    avatar: string;
    githubUsername?: string;
  };
  replies?: ProjectComment[];
}

export interface LeaderboardEntry {
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

export interface CommunityStats {
  totalReviews: number;
  averageRating: number;
  totalComments: number;
  activeUsers: number;
  topContributors: LeaderboardEntry[];
}

export interface UserInteraction {
  userId: string;
  projectId: number;
  type: "view" | "bookmark" | "share" | "rate" | "review" | "comment";
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SocialShare {
  platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy";
  projectId: number;
  userId: string;
  timestamp: Date;
}

// API Response types
export interface ProjectRatingsResponse {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>; // rating -> count
  userRating?: number;
}

export interface ProjectReviewsResponse {
  reviews: ProjectReview[];
  totalCount: number;
  averageRating: number;
  hasMore: boolean;
}

export interface ProjectCommentsResponse {
  comments: ProjectComment[];
  totalCount: number;
  hasMore: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  userRank?: number;
  totalUsers: number;
}

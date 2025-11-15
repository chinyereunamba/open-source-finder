// Community service for managing ratings, reviews, comments, and leaderboards
// This is a mock implementation - in production, this would connect to a real database

import {
  ProjectRating,
  ProjectReview,
  ProjectComment,
  LeaderboardEntry,
  CommunityStats,
  UserInteraction,
  ProjectRatingsResponse,
  ProjectReviewsResponse,
  ProjectCommentsResponse,
  LeaderboardResponse,
} from "./community-types";

// Mock data storage (in production, this would be a database)
class MockCommunityStore {
  private ratings: ProjectRating[] = [];
  private reviews: ProjectReview[] = [];
  private comments: ProjectComment[] = [];
  private interactions: UserInteraction[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock ratings
    this.ratings = [
      {
        id: "1",
        projectId: 1296269,
        userId: "user1",
        rating: 5,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        projectId: 1296269,
        userId: "user2",
        rating: 4,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
      {
        id: "3",
        projectId: 1296269,
        userId: "user3",
        rating: 5,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
      },
    ];

    // Mock reviews
    this.reviews = [
      {
        id: "1",
        projectId: 1296269,
        userId: "user1",
        rating: 5,
        title: "Excellent project for beginners",
        content:
          "This project has great documentation and a welcoming community. Perfect for first-time contributors!",
        helpful: 12,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        user: {
          name: "Sarah Chen",
          avatar: "https://github.com/octocat.png",
          githubUsername: "sarahchen",
        },
      },
      {
        id: "2",
        projectId: 1296269,
        userId: "user2",
        rating: 4,
        title: "Good project with active maintainers",
        content:
          "The maintainers are very responsive and helpful. Code quality is high and the project is well-structured.",
        helpful: 8,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        user: {
          name: "Alex Rodriguez",
          avatar: "https://github.com/defunkt.png",
          githubUsername: "alexr",
        },
      },
    ];

    // Mock comments
    this.comments = [
      {
        id: "1",
        projectId: 1296269,
        userId: "user1",
        content:
          "Just started contributing to this project and the onboarding process was smooth!",
        likes: 5,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
        user: {
          name: "Sarah Chen",
          avatar: "https://github.com/octocat.png",
          githubUsername: "sarahchen",
        },
      },
      {
        id: "2",
        projectId: 1296269,
        userId: "user3",
        content:
          "Looking for a good first issue to work on. Any recommendations?",
        likes: 3,
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
        user: {
          name: "Mike Johnson",
          avatar: "https://github.com/pjhyett.png",
          githubUsername: "mikej",
        },
      },
    ];
  }

  // Ratings methods
  async getRatings(projectId: number): Promise<ProjectRatingsResponse> {
    const projectRatings = this.ratings.filter(
      (r) => r.projectId === projectId
    );

    if (projectRatings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {},
      };
    }

    const totalRatings = projectRatings.length;
    const averageRating =
      projectRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    const ratingDistribution: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = projectRatings.filter(
        (r) => r.rating === i
      ).length;
    }

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      ratingDistribution,
    };
  }

  async addRating(
    projectId: number,
    userId: string,
    rating: number
  ): Promise<ProjectRating> {
    // Remove existing rating if any
    this.ratings = this.ratings.filter(
      (r) => !(r.projectId === projectId && r.userId === userId)
    );

    const newRating: ProjectRating = {
      id: Date.now().toString(),
      projectId,
      userId,
      rating,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ratings.push(newRating);
    return newRating;
  }

  // Reviews methods
  async getReviews(
    projectId: number,
    page = 1,
    limit = 10
  ): Promise<ProjectReviewsResponse> {
    const projectReviews = this.reviews
      .filter((r) => r.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = projectReviews.slice(startIndex, endIndex);

    const averageRating =
      projectReviews.length > 0
        ? projectReviews.reduce((sum, r) => sum + r.rating, 0) /
          projectReviews.length
        : 0;

    return {
      reviews: paginatedReviews,
      totalCount: projectReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      hasMore: endIndex < projectReviews.length,
    };
  }

  async addReview(
    projectId: number,
    userId: string,
    rating: number,
    title: string,
    content: string,
    user: { name: string; avatar: string; githubUsername?: string }
  ): Promise<ProjectReview> {
    const newReview: ProjectReview = {
      id: Date.now().toString(),
      projectId,
      userId,
      rating,
      title,
      content,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    };

    this.reviews.push(newReview);
    return newReview;
  }

  // Comments methods
  async getComments(
    projectId: number,
    page = 1,
    limit = 20
  ): Promise<ProjectCommentsResponse> {
    const projectComments = this.comments
      .filter((c) => c.projectId === projectId && !c.parentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = projectComments.slice(startIndex, endIndex);

    // Add replies to comments
    const commentsWithReplies = paginatedComments.map((comment) => ({
      ...comment,
      replies: this.comments
        .filter((c) => c.parentId === comment.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    }));

    return {
      comments: commentsWithReplies,
      totalCount: projectComments.length,
      hasMore: endIndex < projectComments.length,
    };
  }

  async addComment(
    projectId: number,
    userId: string,
    content: string,
    user: { name: string; avatar: string; githubUsername?: string },
    parentId?: string
  ): Promise<ProjectComment> {
    const newComment: ProjectComment = {
      id: Date.now().toString(),
      projectId,
      userId,
      content,
      parentId,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    };

    this.comments.push(newComment);
    return newComment;
  }

  // Leaderboard methods
  async getLeaderboard(
    type: "contributions" | "reviews" | "helpful" = "contributions",
    limit = 50
  ): Promise<LeaderboardResponse> {
    // Mock leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        userId: "user1",
        username: "Sarah Chen",
        avatar: "https://github.com/octocat.png",
        githubUsername: "sarahchen",
        score: 1250,
        rank: 1,
        contributions: 45,
        reviewsCount: 12,
        helpfulVotes: 89,
        streak: 15,
      },
      {
        userId: "user2",
        username: "Alex Rodriguez",
        avatar: "https://github.com/defunkt.png",
        githubUsername: "alexr",
        score: 1180,
        rank: 2,
        contributions: 38,
        reviewsCount: 15,
        helpfulVotes: 76,
        streak: 12,
      },
      {
        userId: "user3",
        username: "Mike Johnson",
        avatar: "https://github.com/pjhyett.png",
        githubUsername: "mikej",
        score: 1050,
        rank: 3,
        contributions: 32,
        reviewsCount: 8,
        helpfulVotes: 65,
        streak: 8,
      },
      {
        userId: "user4",
        username: "Emma Wilson",
        avatar: "https://github.com/mojombo.png",
        githubUsername: "emmaw",
        score: 980,
        rank: 4,
        contributions: 28,
        reviewsCount: 11,
        helpfulVotes: 54,
        streak: 6,
      },
      {
        userId: "user5",
        username: "David Kim",
        avatar: "https://github.com/technoweenie.png",
        githubUsername: "davidk",
        score: 920,
        rank: 5,
        contributions: 25,
        reviewsCount: 9,
        helpfulVotes: 48,
        streak: 10,
      },
    ];

    return {
      entries: mockLeaderboard.slice(0, limit),
      totalUsers: 1250,
    };
  }

  // Interaction tracking
  async trackInteraction(
    interaction: Omit<UserInteraction, "timestamp">
  ): Promise<void> {
    this.interactions.push({
      ...interaction,
      timestamp: new Date(),
    });
  }

  // Community stats
  async getCommunityStats(): Promise<CommunityStats> {
    const topContributors = await this.getLeaderboard("contributions", 5);

    return {
      totalReviews: this.reviews.length,
      averageRating:
        this.reviews.length > 0
          ? this.reviews.reduce((sum, r) => sum + r.rating, 0) /
            this.reviews.length
          : 0,
      totalComments: this.comments.length,
      activeUsers: 1250,
      topContributors: topContributors.entries,
    };
  }
}

// Singleton instance
export const communityStore = new MockCommunityStore();

// Service functions
export class CommunityService {
  static async getProjectRatings(
    projectId: number,
    userId?: string
  ): Promise<ProjectRatingsResponse> {
    const ratings = await communityStore.getRatings(projectId);

    if (userId) {
      const userRating = await communityStore.getRatings(projectId);
      // In a real implementation, we'd fetch the user's specific rating
      ratings.userRating = undefined; // Mock: user hasn't rated yet
    }

    return ratings;
  }

  static async rateProject(
    projectId: number,
    userId: string,
    rating: number
  ): Promise<ProjectRating> {
    return communityStore.addRating(projectId, userId, rating);
  }

  static async getProjectReviews(
    projectId: number,
    page = 1,
    limit = 10
  ): Promise<ProjectReviewsResponse> {
    return communityStore.getReviews(projectId, page, limit);
  }

  static async addProjectReview(
    projectId: number,
    userId: string,
    rating: number,
    title: string,
    content: string,
    user: { name: string; avatar: string; githubUsername?: string }
  ): Promise<ProjectReview> {
    return communityStore.addReview(
      projectId,
      userId,
      rating,
      title,
      content,
      user
    );
  }

  static async getProjectComments(
    projectId: number,
    page = 1,
    limit = 20
  ): Promise<ProjectCommentsResponse> {
    return communityStore.getComments(projectId, page, limit);
  }

  static async addProjectComment(
    projectId: number,
    userId: string,
    content: string,
    user: { name: string; avatar: string; githubUsername?: string },
    parentId?: string
  ): Promise<ProjectComment> {
    return communityStore.addComment(
      projectId,
      userId,
      content,
      user,
      parentId
    );
  }

  static async getLeaderboard(
    type: "contributions" | "reviews" | "helpful" = "contributions",
    limit = 50
  ): Promise<LeaderboardResponse> {
    return communityStore.getLeaderboard(type, limit);
  }

  static async trackUserInteraction(
    interaction: Omit<UserInteraction, "timestamp">
  ): Promise<void> {
    return communityStore.trackInteraction(interaction);
  }

  static async getCommunityStats(): Promise<CommunityStats> {
    return communityStore.getCommunityStats();
  }
}

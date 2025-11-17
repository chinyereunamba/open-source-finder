import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  GitFork,
  Clock,
  MessageSquare,
  Filter,
  X,
  AlertCircle,
  ExternalLink,
  Github,
  Search,
  Bookmark,
  Share2,
  Eye,
  Users,
  Grid3X3,
  List,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export {
  Input,
  Link,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Star,
  GitFork,
  Clock,
  MessageSquare,
  Filter,
  X,
  AlertCircle,
  ExternalLink,
  Github,
  Search,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Bookmark,
  Share2,
  Eye,
  Users,
  Grid3X3,
  List,
};

export { RecommendationPreferences } from "./recommendation-preferences";
export { default as RecommendedProjects } from "./recommended-projects";
export { default as AdvancedSearchDiscovery } from "./advanced-search-discovery";
export { default as TrendingDashboard } from "./trending-dashboard";
export { default as SimilarProjectsEnhanced } from "./similar-projects-enhanced";
export { AnalyticsDashboard } from "./analytics-dashboard";
export { ProjectPopularityStats } from "./project-popularity-stats";
export { CommunityHealthIndicator } from "./community-health-indicator";
export { MaintainerAnalyticsDashboard } from "./maintainer-analytics-dashboard";

// Mobile-specific components
export { default as MobileProjectCard } from "./mobile-project-card";
export { default as MobileSearch } from "./mobile-search";
export { default as PullToRefresh } from "./pull-to-refresh";
export { default as OfflineIndicator } from "./offline-indicator";
export { default as PWAInstallPrompt } from "./pwa-install-prompt";

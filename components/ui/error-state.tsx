"use client";

import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  type?: "network" | "authentication" | "validation" | "server" | "notFound";
}

export function ErrorState({
  title,
  message,
  onRetry,
  showHomeButton = true,
  showBackButton = false,
  type = "server",
}: ErrorStateProps) {
  const router = useRouter();

  const errorConfig = {
    network: {
      title: "Connection Error",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
      icon: <AlertCircle className="h-16 w-16 text-destructive" />,
    },
    authentication: {
      title: "Authentication Required",
      message: "You need to be signed in to access this page.",
      icon: <AlertCircle className="h-16 w-16 text-warning" />,
    },
    validation: {
      title: "Invalid Request",
      message:
        "The request contains invalid data. Please check your input and try again.",
      icon: <AlertCircle className="h-16 w-16 text-warning" />,
    },
    server: {
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again later.",
      icon: <AlertCircle className="h-16 w-16 text-destructive" />,
    },
    notFound: {
      title: "Not Found",
      message: "The resource you're looking for doesn't exist.",
      icon: <AlertCircle className="h-16 w-16 text-muted-foreground" />,
    },
  };

  const config = errorConfig[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">{config.icon}</div>
          <CardTitle className="text-2xl">{displayTitle}</CardTitle>
          <CardDescription className="text-base">
            {displayMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showBackButton && (
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button
              onClick={() => router.push("/")}
              variant={onRetry ? "outline" : "default"}
              className="w-full"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Inline error state for smaller components
export function InlineErrorState({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}

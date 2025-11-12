"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

// Full page loading spinner
export function FullPageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
}

// Inline loading spinner for buttons
export function ButtonSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}

// Overlay loading spinner
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Dots loading animation
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
}

// Pulse loading animation
export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
      <div className="h-3 w-3 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="h-3 w-3 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
}

"use client";

import { Button, buttonVariants } from "./button";
import { ButtonSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

export function LoadingButton({
  children,
  loading = false,
  loadingText,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} className={cn(className)} {...props}>
      {loading && <ButtonSpinner className="mr-2" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}

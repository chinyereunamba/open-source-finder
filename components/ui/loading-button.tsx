"use client";

import { Button, ButtonProps } from "./button";
import { ButtonSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
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

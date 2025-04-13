"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Mock email for demo purposes
  const userEmail = "example@email.com";

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only process if it looks like a verification code
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 6);
    const newCode = [...verificationCode];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setVerificationCode(newCode);

    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(digits.length, 5);
    const lastInput = document.getElementById(`code-${lastIndex}`);
    if (lastInput) {
      lastInput.focus();
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      toast("Invalid code, Please enter a valid 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);

      toast("Email verified. Your email has been verified successfully.");

      router.push("/");
    }, 1500);
  };

  const handleResendCode = () => {
    setIsResending(true);

    // Simulate resending code
    setTimeout(() => {
      setIsResending(false);

      toast(
        "Verification code sent. A new verification code has been sent to your email."
      );
    }, 1500);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2"
      >
        <Github className="h-6 w-6" />
        <span className="font-bold">OpenSourceFinder</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto rounded-full bg-primary/10 p-3 mb-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification code to{" "}
            <span className="font-medium">{userEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-center mb-2">
              Enter the 6-digit verification code
            </div>
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="h-12 w-12 text-center text-lg"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={isLoading || verificationCode.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify email"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend code"
                )}
              </Button>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/auth/sign-in"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";
import { inter } from "@/app/layout";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Header from "./layout/header";
import { ThemeProvider } from "next-themes";

export default function SessionProviderWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        defaultTheme="system"
        attribute="class"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

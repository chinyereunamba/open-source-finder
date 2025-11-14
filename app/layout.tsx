import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Header from "../components/layout/header";
import { getServerSession } from "next-auth";
import { AchievementNotificationProvider } from "@/components/providers/achievement-notification-provider";
import { GlobalAchievementNotifications } from "@/components/custom/global-achievement-notifications";
export const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Open Source Finder",
  description: "Discover open source projects that need contributors",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OSS Finder",
  },
};

export const viewport = {
  themeColor: "#0e0e52",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <SessionProviderWrapper session={session}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0e0e52" />
        </head>
        <body className={inter.className}>
          <AchievementNotificationProvider>
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
            <ServiceWorkerRegistration />
            <Header />
            {children}
            <Footer />
            <Toaster />
            <GlobalAchievementNotifications />
            <Analytics />
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
            {/* </ThemeProvider> */}
          </AchievementNotificationProvider>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}

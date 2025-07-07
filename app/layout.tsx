import type { Metadata } from "next";
import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Header from "../components/layout/header";
import { getServerSession } from "next-auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Open Source Finder",
  description: "Discover open source projects that need contributors",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const session = await getServerSession()
  return (
    <SessionProviderWrapper session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <Header />
          {children}
          <Footer />
          <Toaster />
          <Analytics />
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          {/* </ThemeProvider> */}
        </body>
      </html>
    </SessionProviderWrapper>
  );
}

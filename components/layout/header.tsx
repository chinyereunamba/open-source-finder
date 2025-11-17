"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Github,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import MobileNav from "./mobile-nav";
import MobileSearch from "@/components/custom/mobile-search";

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-sm bg-background/95">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <Github className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">
              OpenSourceFinder
            </span>
            <span className="font-bold sm:hidden">OSS</span>
          </Link>
        </div>
        <div className="flex gap-6 md:gap-10">
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Projects
            </Link>
            <Link
              href="/discover"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Discover
            </Link>
            <Link
              href="/community"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Community
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>

                <Link
                  href="/submit"
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Submit
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 sm:space-x-4 sm:justify-end">
          <div className="flex-1 sm:grow-0 sm:w-72 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <MobileSearch
            open={mobileSearchOpen}
            onOpenChange={setMobileSearchOpen}
          />
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          session?.user?.image ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.substring(0, 2).toUpperCase() ||
                          "US"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/contributions">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Contributions</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/achievements">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Achievements</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/projects">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>My Projects</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/test-achievements">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Test Achievements</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild className="hidden md:flex">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Home,
  FolderGit2,
  Compass,
  Users,
  LayoutDashboard,
  Upload,
  User,
  Settings,
  LogOut,
  Bell,
  Award,
  BarChart3,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLoggedIn = !!session;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/community", label: "Community", icon: Users },
  ];

  const authenticatedItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/submit", label: "Submit Project", icon: Upload },
  ];

  const profileItems = [
    { href: "/profile", label: "Profile", icon: User },
    {
      href: "/dashboard/contributions",
      label: "Contributions",
      icon: BarChart3,
    },
    { href: "/dashboard/achievements", label: "Achievements", icon: Award },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6">
          {isLoggedIn && session.user && (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={session.user.image || "/placeholder.svg"}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback>
                    {session.user.name?.substring(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {isLoggedIn && (
            <>
              <Separator />
              <nav className="flex flex-col gap-2">
                {authenticatedItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <Separator />
              <nav className="flex flex-col gap-2">
                {profileItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <Separator />
              <Button
                variant="ghost"
                className="justify-start gap-3 px-3"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Log out</span>
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Separator />
              <Button asChild className="w-full">
                <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

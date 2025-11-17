"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  Compass,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const isLoggedIn = !!session;

  // Don't show on auth pages
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/community", label: "Community", icon: Users },
  ];

  if (isLoggedIn) {
    navItems.push({
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    });
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

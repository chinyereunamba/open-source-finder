import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Github, Search } from "lucide-react";
import { Input } from "../ui/input";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto md:px-6">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Github className="h-6 w-6" />
            <span className="inline-block font-bold">OpenSourceFinder</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-foreground"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="flex items-center text-sm font-medium text-muted-foreground"
            >
              Projects
            </Link>
            <Link
              href="/submit"
              className="flex items-center text-sm font-medium text-muted-foreground"
            >
              Submit
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-4 sm:justify-end">
          <div className="flex-1 sm:grow-0 sm:w-72">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
          <Button>Sign In</Button>
        </div>
      </div>
    </header>
  );
}

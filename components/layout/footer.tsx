import { Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto  md:px-6">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js and Tailwind CSS. Data from GitHub API.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

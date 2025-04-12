import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Link } from "./index";

export default function SimilarProjects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Link href="/projects/3" className="font-medium hover:underline">
            microsoft/vscode
          </Link>
          <p className="text-sm text-muted-foreground">Visual Studio Code</p>
        </div>
        <div className="space-y-2">
          <Link href="/projects/8" className="font-medium hover:underline">
            vercel/next.js
          </Link>
          <p className="text-sm text-muted-foreground">
            The React Framework for Production
          </p>
        </div>
        <div className="space-y-2">
          <Link href="/projects/4" className="font-medium hover:underline">
            flutter/flutter
          </Link>
          <p className="text-sm text-muted-foreground">
            Flutter makes it easy and fast to build beautiful apps for mobile
            and beyond
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

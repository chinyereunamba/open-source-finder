"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/service-worker";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register in production
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker();
    }
  }, []);

  return null;
}

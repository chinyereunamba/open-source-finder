/**
 * Service Worker registration and management
 */

export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log(
        "Service Worker registered successfully:",
        registration.scope
      );

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New service worker available
            console.log("New service worker available");

            // Optionally notify user about update
            if (
              confirm("A new version is available. Would you like to update?")
            ) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });

  // Handle controller change (new SW activated)
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Service Worker controller changed");
  });
}

export function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return Promise.resolve(false);
  }

  return navigator.serviceWorker
    .getRegistration()
    .then((registration) => {
      if (registration) {
        return registration.unregister();
      }
      return false;
    })
    .catch((error) => {
      console.error("Error unregistering service worker:", error);
      return false;
    });
}

export async function checkServiceWorkerStatus(): Promise<{
  registered: boolean;
  active: boolean;
}> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return { registered: false, active: false };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      registered: !!registration,
      active: !!registration?.active,
    };
  } catch (error) {
    console.error("Error checking service worker status:", error);
    return { registered: false, active: false };
  }
}

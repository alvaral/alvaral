"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function shouldTrack(path: string) {
  return !path.startsWith("/admin") && !path.startsWith("/api");
}

function postPageView(path: string, referrer: string | null) {
  const payload = JSON.stringify({ path, referrer });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/page-view", blob);
    return;
  }

  fetch("/api/analytics/page-view", {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    if (!shouldTrack(path)) {
      previousPath.current = path;
      return;
    }

    if (navigator.doNotTrack === "1") {
      previousPath.current = path;
      return;
    }

    const referrer =
      previousPath.current == null
        ? document.referrer || null
        : `${window.location.origin}${previousPath.current}`;

    postPageView(path, referrer);
    previousPath.current = path;
  }, [pathname, searchParams]);

  return null;
}

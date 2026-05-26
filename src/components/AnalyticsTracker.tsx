"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_ID_KEY = "alvaral.analytics.session_id";
const SESSION_LAST_SEEN_KEY = "alvaral.analytics.session_last_seen";
const VISITOR_ID_KEY = "alvaral.analytics.visitor_id";

type TrackingIds = {
  sessionId: string;
  visitorId: string;
};

function shouldTrack(path: string) {
  return !path.startsWith("/admin") && !path.startsWith("/api");
}

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function createTrackingId(prefix: "session" | "visitor") {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${random}`;
}

function readStorageValue(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
}

function getTrackingIds(): TrackingIds {
  const now = Date.now();
  const visitorId =
    readStorageValue(VISITOR_ID_KEY) ?? createTrackingId("visitor");
  const previousSessionId = readStorageValue(SESSION_ID_KEY);
  const lastSeen = Number(readStorageValue(SESSION_LAST_SEEN_KEY) ?? 0);
  const sessionId =
    previousSessionId && now - lastSeen < SESSION_TIMEOUT_MS
      ? previousSessionId
      : createTrackingId("session");

  writeStorageValue(VISITOR_ID_KEY, visitorId);
  writeStorageValue(SESSION_ID_KEY, sessionId);
  writeStorageValue(SESSION_LAST_SEEN_KEY, String(now));

  return { sessionId, visitorId };
}

function sanitizeReferrer(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (isLocalHost(url.hostname)) return null;
    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) {
      return null;
    }

    return `${url.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

function postPageView(
  path: string,
  referrer: string | null,
  trackingIds: TrackingIds
) {
  const payload = JSON.stringify({ path, referrer, ...trackingIds });

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
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname;

    if (isLocalHost(window.location.hostname)) {
      previousPath.current = null;
      return;
    }

    if (!shouldTrack(path)) {
      previousPath.current = null;
      return;
    }

    if (navigator.doNotTrack === "1") {
      previousPath.current = path;
      return;
    }

    const referrer =
      previousPath.current == null
        ? sanitizeReferrer(document.referrer || null)
        : `${window.location.origin}${previousPath.current}`;

    postPageView(path, sanitizeReferrer(referrer), getTrackingIds());
    previousPath.current = path;
  }, [pathname]);

  return null;
}

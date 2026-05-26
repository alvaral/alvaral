import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageViewPayload = {
  path?: unknown;
  referrer?: unknown;
  sessionId?: unknown;
  visitorId?: unknown;
};

function shortText(value: string | null, maxLength = 500) {
  if (!value) return null;
  return value.slice(0, maxLength);
}

function headerValue(request: NextRequest, name: string) {
  const value = request.headers.get(name);
  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isLocalHost(hostname: string) {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  );
}

function isNoisyQueryParam(name: string) {
  const normalizedName = name.toLowerCase();

  return (
    normalizedName.startsWith("utm_") ||
    [
      "fbclid",
      "gclid",
      "gbraid",
      "wbraid",
      "igshid",
      "mc_cid",
      "mc_eid",
      "msclkid",
    ].includes(normalizedName)
  );
}

function cleanUrlPath(url: URL) {
  Array.from(url.searchParams.keys()).forEach((key) => {
    if (isNoisyQueryParam(key)) {
      url.searchParams.delete(key);
    }
  });

  const query = url.searchParams.toString();
  return `${url.pathname}${query ? `?${query}` : ""}`;
}

function normalizePath(value: unknown) {
  if (typeof value !== "string") return null;
  const rawPath = value.trim();

  if (!rawPath.startsWith("/")) return null;

  const url = new URL(rawPath, "https://www.alvaral.dev");
  const path = cleanUrlPath(url);

  if (!path.startsWith("/")) return null;
  if (path.startsWith("/admin") || path.startsWith("/api")) return null;

  return shortText(path, 300);
}

function sanitizeReferrer(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { referrer: null, referrerHost: null };
  }

  try {
    const url = new URL(value);
    if (isLocalHost(url.hostname)) {
      return { referrer: null, referrerHost: null };
    }

    const path = cleanUrlPath(url);
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return { referrer: null, referrerHost: null };
    }

    return {
      referrer: shortText(`${url.origin}${path}`, 500),
      referrerHost: shortText(url.hostname, 200),
    };
  } catch {
    return { referrer: shortText(value.trim(), 500), referrerHost: null };
  }
}

function normalizeTrackingId(value: unknown) {
  if (typeof value !== "string") return null;

  const id = value.trim();
  if (!/^[a-z0-9_-]{8,120}$/i.test(id)) return null;

  return id;
}

function parseUserAgent(userAgent: string | null) {
  const value = userAgent ?? "";
  const lower = value.toLowerCase();

  const isBot = /bot|crawler|spider|crawling|preview|facebookexternalhit|slurp/.test(
    lower
  );
  const deviceType = isBot
    ? "bot"
    : /ipad|tablet/.test(lower)
      ? "tablet"
      : /mobi|android|iphone|ipod/.test(lower)
        ? "mobile"
        : "desktop";

  const browser = /edg\//i.test(value)
    ? "Edge"
    : /firefox\//i.test(value)
      ? "Firefox"
      : /chrome\//i.test(value) && !/chromium/i.test(value)
        ? "Chrome"
        : /safari\//i.test(value)
          ? "Safari"
          : "Unknown";

  const os = /iphone|ipad|ipod/i.test(value)
    ? "iOS"
    : /android/i.test(value)
      ? "Android"
      : /windows/i.test(value)
        ? "Windows"
        : /mac os x|macintosh/i.test(value)
          ? "macOS"
          : /linux/i.test(value)
            ? "Linux"
            : "Unknown";

  return { browser, deviceType, isBot, os };
}

export async function POST(request: NextRequest) {
  if (isLocalHost(request.nextUrl.hostname)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  let payload: PageViewPayload = {};

  try {
    payload = (await request.json()) as PageViewPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = normalizePath(payload.path);
  if (!path) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const userAgent = request.headers.get("user-agent");
  const { browser, deviceType, isBot, os } = parseUserAgent(userAgent);

  if (isBot) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const { referrer, referrerHost } = sanitizeReferrer(payload.referrer);
  const visitorId = normalizeTrackingId(payload.visitorId);
  const sessionId = normalizeTrackingId(payload.sessionId);

  const insertPayload = {
    path,
    referrer,
    referrer_host: referrerHost,
    visitor_id: visitorId,
    session_id: sessionId,
    country: shortText(headerValue(request, "x-vercel-ip-country"), 80),
    region: shortText(headerValue(request, "x-vercel-ip-country-region"), 120),
    city: shortText(headerValue(request, "x-vercel-ip-city"), 120),
    device_type: deviceType,
    browser,
    os,
  };

  const { error } = await supabase
    .from("analytics_page_views")
    .insert(insertPayload);

  if (
    error &&
    (error.message.includes("session_id") ||
      error.message.includes("visitor_id"))
  ) {
    const legacyPayload = {
      path: insertPayload.path,
      referrer: insertPayload.referrer,
      referrer_host: insertPayload.referrer_host,
      country: insertPayload.country,
      region: insertPayload.region,
      city: insertPayload.city,
      device_type: insertPayload.device_type,
      browser: insertPayload.browser,
      os: insertPayload.os,
    };
    await supabase.from("analytics_page_views").insert(legacyPayload);
  }

  return NextResponse.json({ ok: true });
}

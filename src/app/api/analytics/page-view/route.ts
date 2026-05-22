import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageViewPayload = {
  path?: unknown;
  referrer?: unknown;
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

function normalizePath(value: unknown) {
  if (typeof value !== "string") return null;
  const path = value.trim();

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
    return {
      referrer: shortText(`${url.origin}${url.pathname}`, 500),
      referrerHost: shortText(url.hostname, 200),
    };
  } catch {
    return { referrer: shortText(value.trim(), 500), referrerHost: null };
  }
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

  const os = /windows/i.test(value)
    ? "Windows"
    : /mac os x|macintosh/i.test(value)
      ? "macOS"
      : /iphone|ipad|ipod/i.test(value)
        ? "iOS"
        : /android/i.test(value)
          ? "Android"
          : /linux/i.test(value)
            ? "Linux"
            : "Unknown";

  return { browser, deviceType, isBot, os };
}

export async function POST(request: NextRequest) {
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

  await supabase.from("analytics_page_views").insert({
    path,
    referrer,
    referrer_host: referrerHost,
    country: shortText(headerValue(request, "x-vercel-ip-country"), 80),
    region: shortText(headerValue(request, "x-vercel-ip-country-region"), 120),
    city: shortText(headerValue(request, "x-vercel-ip-city"), 120),
    device_type: deviceType,
    browser,
    os,
  });

  return NextResponse.json({ ok: true });
}

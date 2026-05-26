import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_MAX_AGE_SECONDS,
  LOCALE_COOKIE_NAME,
  isSupportedLocale,
  localeFromPathname,
  stripLocaleFromPathname,
  withLocalePathname,
  type AppLocale,
} from "@/i18n/locale";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { withCookieDomain } from "@/lib/supabase/cookies";
import type { Database } from "@/lib/supabase/types";

const PUBLIC_FILE = /\/[^/]+\.[^/]+$/;

function isIgnoredPath(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/_vercel") ||
    PUBLIC_FILE.test(pathname)
  );
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function getPreferredLocale(request: NextRequest): AppLocale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptedLanguages = request.headers.get("accept-language") ?? "";

  for (const language of acceptedLanguages.split(",")) {
    const normalizedLanguage = language
      .split(";")[0]
      .trim()
      .toLowerCase()
      .split("-")[0];

    if (isSupportedLocale(normalizedLanguage)) {
      return normalizedLanguage;
    }
  }

  return DEFAULT_LOCALE;
}

function setLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
  });
}

async function protectAdmin(request: NextRequest) {
  const config = getSupabaseConfig();
  const host = request.headers.get("host");

  let response = NextResponse.next({ request });

  if (
    !config ||
    request.nextUrl.pathname === "/admin/login" ||
    !request.nextUrl.pathname.startsWith("/admin")
  ) {
    return response;
  }

  const supabase = createServerClient<Database>(
    config.url,
    config.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, withCookieDomain(options, host));
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("error", "not_admin");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isIgnoredPath(pathname)) {
    return NextResponse.next({ request });
  }

  const locale = localeFromPathname(pathname);
  const pathnameWithoutLocale = locale
    ? stripLocaleFromPathname(pathname)
    : pathname;

  if (locale && isAdminPath(pathnameWithoutLocale)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathnameWithoutLocale;
    const response = NextResponse.redirect(redirectUrl);
    setLocaleCookie(response, locale);
    return response;
  }

  if (isAdminPath(pathnameWithoutLocale)) {
    return protectAdmin(request);
  }

  if (!locale) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = withLocalePathname(pathname, getPreferredLocale(request));
    return NextResponse.redirect(redirectUrl);
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = pathnameWithoutLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-alvaral-locale", locale);

  request.cookies.set(LOCALE_COOKIE_NAME, locale);
  const response = NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  });
  setLocaleCookie(response, locale);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|apple-icon.png|favicon.ico|icon0.svg|icon1.png|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};

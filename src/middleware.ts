import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { withCookieDomain } from "@/lib/supabase/cookies";
import type { Database } from "@/lib/supabase/types";

export async function middleware(request: NextRequest) {
  const config = getSupabaseConfig();
  const host = request.headers.get("host");

  if (
    host?.toLowerCase() === "www.alvaral.dev" &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "alvaral.dev";
    return NextResponse.redirect(redirectUrl, 308);
  }

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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|apple-icon.png|favicon.ico|icon0.svg|icon1.png|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};

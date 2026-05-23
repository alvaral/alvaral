import { cookies } from "next/headers";
import { headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { withCookieDomain } from "@/lib/supabase/cookies";
import type { Database } from "@/lib/supabase/types";

export async function createSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();
  const headersStore = await headers();
  const host = headersStore.get("host");

  return createServerClient<Database>(
    config.url,
    config.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, withCookieDomain(options, host));
            });
          } catch {
            // Server Components cannot always write cookies. Server Actions can.
          }
        },
      },
    }
  );
}

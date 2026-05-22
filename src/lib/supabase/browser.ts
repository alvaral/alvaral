"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

export function createSupabaseBrowserClient() {
  const config = requireSupabaseConfig();

  return createBrowserClient<Database>(
    config.url,
    config.publishableKey
  );
}

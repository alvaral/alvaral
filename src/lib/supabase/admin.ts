import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login?error=config");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || !isAdmin) {
    redirect("/admin/login?error=not_admin");
  }

  return { supabase, user };
}

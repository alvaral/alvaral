import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  getCookieDomain,
  isSupabaseAuthCookie,
} from "@/lib/supabase/cookies";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

async function signOut() {
  "use server";

  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();

  const cookieStore = await cookies();
  const headersStore = await headers();
  const sharedDomain = getCookieDomain(headersStore.get("host"));

  cookieStore
    .getAll()
    .filter((cookie) => isSupabaseAuthCookie(cookie.name))
    .forEach((cookie) => {
      cookieStore.set(cookie.name, "", { maxAge: 0, path: "/" });

      if (sharedDomain) {
        cookieStore.set(cookie.name, "", {
          domain: sharedDomain,
          maxAge: 0,
          path: "/",
        });
      }
    });

  redirect("/admin/login");
}

export default function AdminShell({ children, userEmail }: AdminShellProps) {
  return (
    <section className="min-h-screen bg-white px-4 py-8 text-gray-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/admin" className="text-2xl font-bold">
              Backoffice
            </Link>
            {userEmail && (
              <p className="mt-1 text-sm text-gray-500">{userEmail}</p>
            )}
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Web</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/posts">Posts</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/photos">Fotos</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/about">Sobre mi</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/analytics">Analiticas</Link>
            </Button>
            <form action={signOut}>
              <SubmitButton variant="outline" size="sm">
                Salir
              </SubmitButton>
            </form>
          </nav>
        </header>

        {children}
      </div>
    </section>
  );
}

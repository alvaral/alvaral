import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const { supabase, user } = await getAdminContext();
  const [postsResult, photosResult] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("photos").select("id", { count: "exact", head: true }),
  ]);

  return (
    <AdminShell userEmail={user.email}>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Posts</p>
          <p className="mt-2 text-4xl font-bold">{postsResult.count ?? 0}</p>
          <div className="mt-5 flex gap-2">
            <Button asChild>
              <Link href="/admin/posts/new">Nuevo post</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/posts">Ver posts</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Fotos</p>
          <p className="mt-2 text-4xl font-bold">{photosResult.count ?? 0}</p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/admin/photos">Gestionar fotos</Link>
            </Button>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

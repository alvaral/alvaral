import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/lib/supabase/admin";
import type { ContentLocale, PostStatus } from "@/lib/supabase/types";

type AdminPostRow = {
  id: string;
  slug: string;
  status: PostStatus;
  published_at: string | null;
  updated_at: string;
  post_translations: {
    locale: ContentLocale;
    title: string;
  }[];
};

export default async function AdminPostsPage() {
  const { supabase, user } = await getAdminContext();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, status, published_at, updated_at, post_translations(locale, title)")
    .order("updated_at", { ascending: false })
    .returns<AdminPostRow[]>();

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crea borradores y publica cuando esten listos.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">Nuevo</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Titulo</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(posts ?? []).map((post) => {
              const title =
                post.post_translations.find(
                  (translation) => translation.locale === "es"
                )?.title ??
                post.post_translations[0]?.title ??
                post.slug;

              return (
                <tr key={post.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{title}</p>
                    <p className="text-xs text-gray-500">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {post.status === "published" ? "Publicado" : "Borrador"}
                  </td>
                  <td className="px-4 py-3">
                    {post.published_at?.slice(0, 10) ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts/${post.id}`}>Editar</Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

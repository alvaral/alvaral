import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PostForm, { type PostFormValues } from "@/components/admin/PostForm";
import SubmitButton from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/lib/supabase/admin";
import { getPublicMediaUrl } from "@/lib/supabase/storage";
import type { ContentLocale, PostStatus } from "@/lib/supabase/types";
import { deletePost, updatePost } from "@/app/admin/posts/actions";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
};

type AdminPostRow = {
  id: string;
  slug: string;
  status: PostStatus;
  published_at: string | null;
  cover_image_url: string | null;
  cover_image_path: string | null;
  post_translations: {
    locale: ContentLocale;
    title: string;
    description: string;
    content: string;
  }[];
};

const errorMessages: Record<string, string> = {
  duplicate: "Ya existe un post con ese slug.",
  permission:
    "Supabase ha rechazado el guardado por permisos. Revisa admin_users y las politicas RLS.",
  save: "No se pudo guardar. Revisa los logs de Vercel para ver el codigo exacto de Supabase.",
  schema: "Supabase no tiene la tabla o columna esperada. Revisa el schema SQL.",
  slug: "El slug no es valido.",
  translation: "No se pudieron guardar las traducciones.",
};

function valuesFromPost(post: AdminPostRow): PostFormValues {
  const es = post.post_translations.find(
    (translation) => translation.locale === "es"
  );
  const en = post.post_translations.find(
    (translation) => translation.locale === "en"
  );

  return {
    slug: post.slug,
    status: post.status,
    publishedAt: post.published_at?.slice(0, 10),
    coverImageUrl:
      post.cover_image_url ?? getPublicMediaUrl(post.cover_image_path) ?? undefined,
    titleEs: es?.title,
    descriptionEs: es?.description,
    contentEs: es?.content,
    titleEn: en?.title,
    descriptionEn: en?.description,
    contentEn: en?.content,
  };
}

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  const { id } = await params;
  const feedback = await searchParams;
  const { supabase, user } = await getAdminContext();
  const error = feedback?.error ? errorMessages[feedback.error] : null;
  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, slug, status, published_at, cover_image_url, cover_image_path, post_translations(locale, title, description, content)"
    )
    .eq("id", id)
    .single()
    .returns<AdminPostRow>();

  if (!post) {
    notFound();
  }

  const updatePostAction = updatePost.bind(null, id);
  const deletePostAction = deletePost.bind(null, id);
  const postFormId = "edit-post-form";

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editar post</h1>
          <p className="mt-1 text-sm text-gray-500">{post.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {post.status === "draft" && (
            <Button asChild variant="outline">
              <Link
                href={`/admin/posts/${post.id}/preview?locale=es`}
                target="_blank"
                rel="noreferrer"
              >
                Ver vista previa
              </Link>
            </Button>
          )}
          <SubmitButton form={postFormId}>Guardar cambios</SubmitButton>
          <form action={deletePostAction}>
            <SubmitButton variant="destructive">
              Eliminar
            </SubmitButton>
          </form>
        </div>
      </div>

      {feedback?.saved && (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Guardado.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <PostForm
        action={updatePostAction}
        formId={postFormId}
        values={valuesFromPost(post)}
        submitLabel="Guardar cambios"
      />
    </AdminShell>
  );
}

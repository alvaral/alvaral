import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";
import { getAdminContext } from "@/lib/supabase/admin";
import { createPost } from "@/app/admin/posts/actions";

type NewPostPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  duplicate: "Ya existe un post con ese slug. Usa otro slug o edita el post existente.",
  permission:
    "Supabase ha rechazado el guardado por permisos. Revisa que tu usuario este en admin_users y que las politicas RLS esten aplicadas.",
  save: "No se pudo crear el post. Revisa los logs de Vercel para ver el codigo exacto de Supabase.",
  schema:
    "Supabase no tiene la tabla o columna esperada. Revisa que hayas ejecutado el schema SQL.",
  slug: "El slug no es valido.",
};

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const params = await searchParams;
  const { user } = await getAdminContext();
  const error = params?.error ? errorMessages[params.error] : null;

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo post</h1>
        <p className="mt-1 text-sm text-gray-500">
          Puedes escribir el contenido en Markdown sencillo.
        </p>
      </div>
      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <PostForm action={createPost} submitLabel="Crear post" />
    </AdminShell>
  );
}

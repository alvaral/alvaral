import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";
import { getAdminContext } from "@/lib/supabase/admin";
import { createPost } from "@/app/admin/posts/actions";

export default async function NewPostPage() {
  const { user } = await getAdminContext();

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nuevo post</h1>
        <p className="mt-1 text-sm text-gray-500">
          Puedes escribir el contenido en Markdown sencillo.
        </p>
      </div>
      <PostForm action={createPost} submitLabel="Crear post" />
    </AdminShell>
  );
}

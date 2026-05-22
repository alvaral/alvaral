/* eslint-disable @next/next/no-img-element */
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/admin/AdminShell";
import SubmitButton from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAdminContext } from "@/lib/supabase/admin";
import { SUPABASE_MEDIA_BUCKET } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

type AboutProfileRow = Database["public"]["Tables"]["about_profile"]["Row"];

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function updateAboutProfile(formData: FormData) {
  "use server";

  const { supabase } = await getAdminContext();
  const file = formData.get("image");
  let imagePath = textValue(formData, "currentImagePath") || null;
  let imageUrl = textValue(formData, "currentImageUrl");

  if (file instanceof File && file.size > 0) {
    const path = `about/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (!uploadError) {
      const { data } = supabase.storage
        .from(SUPABASE_MEDIA_BUCKET)
        .getPublicUrl(path);

      imagePath = path;
      imageUrl = data.publicUrl;
    }
  }

  await supabase.from("about_profile").upsert({
    id: true,
    image_path: imagePath,
    image_url: imageUrl || "/assets/images/profile-photo.webp",
    title_es: textValue(formData, "titleEs") || "Sobre mí",
    title_en: textValue(formData, "titleEn") || "About Me",
    intro_es: textValue(formData, "introEs"),
    intro_en: textValue(formData, "introEn"),
    body_es: textValue(formData, "bodyEs"),
    body_en: textValue(formData, "bodyEn"),
  });

  revalidatePath("/about");
  revalidatePath("/admin/about");
}

const fallbackProfile: AboutProfileRow = {
  id: true,
  image_path: null,
  image_url: "/assets/images/profile-photo.webp",
  title_es: "Sobre mí",
  title_en: "About Me",
  intro_es:
    "¡Hola! Soy Álvaro Alonso, ingeniero de software con pasión por crear experiencias digitales útiles y agradables.",
  intro_en:
    "Hi! I'm Álvaro Alonso, a software engineer passionate about creating unique and functional digital experiences.",
  body_es:
    "Me encanta aprender nuevas herramientas y mejorar continuamente mis habilidades para ofrecer soluciones de alta calidad. Siempre busco combinar creatividad y eficiencia en mis proyectos.",
  body_en:
    "I love learning new tools and constantly improving my skills to deliver high-quality solutions. I always seek to combine creativity and efficiency in my projects.",
  created_at: "",
  updated_at: "",
};

export default async function AdminAboutPage() {
  const { supabase, user } = await getAdminContext();
  const { data } = await supabase
    .from("about_profile")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  const profile = data ?? fallbackProfile;

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sobre mi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Edita el texto y la foto que aparecen en la pagina Sobre mi.
        </p>
      </div>

      <form action={updateAboutProfile} className="space-y-8">
        <input
          type="hidden"
          name="currentImagePath"
          value={profile.image_path ?? ""}
        />
        <input type="hidden" name="currentImageUrl" value={profile.image_url} />

        <section className="grid gap-4 rounded-md border border-gray-200 p-4 md:grid-cols-[180px_1fr]">
          <img
            src={profile.image_url}
            alt={profile.title_es}
            className="aspect-square w-full rounded-md object-cover"
          />
          <div className="space-y-2">
            <Label htmlFor="image">Foto</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
            <p className="text-xs text-gray-500">
              Si no subes una nueva imagen, se conserva la actual.
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-md border border-gray-200 p-4">
          <h2 className="text-lg font-semibold">Contenido en espanol</h2>
          <div className="space-y-2">
            <Label htmlFor="titleEs">Titulo</Label>
            <Input
              id="titleEs"
              name="titleEs"
              defaultValue={profile.title_es}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="introEs">Descripcion corta</Label>
            <Textarea
              id="introEs"
              name="introEs"
              defaultValue={profile.intro_es}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyEs">Descripcion larga</Label>
            <Textarea
              id="bodyEs"
              name="bodyEs"
              defaultValue={profile.body_es}
              rows={6}
              required
            />
          </div>
        </section>

        <section className="space-y-4 rounded-md border border-gray-200 p-4">
          <h2 className="text-lg font-semibold">Contenido en ingles</h2>
          <div className="space-y-2">
            <Label htmlFor="titleEn">Titulo</Label>
            <Input
              id="titleEn"
              name="titleEn"
              defaultValue={profile.title_en}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="introEn">Descripcion corta</Label>
            <Textarea
              id="introEn"
              name="introEn"
              defaultValue={profile.intro_en}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyEn">Descripcion larga</Label>
            <Textarea
              id="bodyEn"
              name="bodyEn"
              defaultValue={profile.body_en}
              rows={6}
              required
            />
          </div>
        </section>

        <SubmitButton pendingLabel="Guardando...">
          Guardar Sobre mi
        </SubmitButton>
      </form>
    </AdminShell>
  );
}

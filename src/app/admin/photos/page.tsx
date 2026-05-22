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

type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalTextValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length > 0 ? value : null;
}

function numberValue(formData: FormData, key: string) {
  const value = Number.parseInt(textValue(formData, key), 10);
  return Number.isFinite(value) ? value : 0;
}

function safeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadPhoto(formData: FormData) {
  "use server";

  const { supabase } = await getAdminContext();
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return;
  }

  const path = `gallery/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return;
  }

  const { data } = supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .getPublicUrl(path);

  await supabase.from("photos").insert({
    image_path: path,
    image_url: data.publicUrl,
    alt_es: optionalTextValue(formData, "altEs"),
    alt_en: optionalTextValue(formData, "altEn"),
    caption_es: optionalTextValue(formData, "captionEs"),
    caption_en: optionalTextValue(formData, "captionEn"),
    visible: true,
    sort_order: numberValue(formData, "sortOrder"),
  });

  revalidatePath("/");
  revalidatePath("/admin/photos");
}

async function updatePhoto(formData: FormData) {
  "use server";

  const { supabase } = await getAdminContext();
  const id = textValue(formData, "id");

  if (!id) return;

  await supabase
    .from("photos")
    .update({
      alt_es: optionalTextValue(formData, "altEs"),
      alt_en: optionalTextValue(formData, "altEn"),
      caption_es: optionalTextValue(formData, "captionEs"),
      caption_en: optionalTextValue(formData, "captionEn"),
      visible: formData.get("visible") === "on",
      sort_order: numberValue(formData, "sortOrder"),
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/photos");
}

async function deletePhoto(formData: FormData) {
  "use server";

  const { supabase } = await getAdminContext();
  const id = textValue(formData, "id");

  if (!id) return;

  const { data: photo } = await supabase
    .from("photos")
    .select("image_path")
    .eq("id", id)
    .single();

  await supabase.from("photos").delete().eq("id", id);

  if (photo?.image_path) {
    await supabase.storage.from(SUPABASE_MEDIA_BUCKET).remove([photo.image_path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/photos");
}

export default async function AdminPhotosPage() {
  const { supabase, user } = await getAdminContext();
  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<PhotoRow[]>();

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Fotos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Las fotos visibles aparecen en la galeria de la home.
        </p>
      </div>

      <form
        action={uploadPhoto}
        className="mb-8 space-y-4 rounded-md border border-gray-200 p-4"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_120px]">
          <div className="space-y-2">
            <Label htmlFor="image">Nueva foto</Label>
            <Input id="image" name="image" type="file" accept="image/*" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Orden</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="altEs">Alt ES</Label>
            <Input id="altEs" name="altEs" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altEn">Alt EN</Label>
            <Input id="altEn" name="altEn" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="captionEs">Caption ES</Label>
            <Textarea id="captionEs" name="captionEs" rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="captionEn">Caption EN</Label>
            <Textarea id="captionEn" name="captionEn" rows={2} />
          </div>
        </div>
        <SubmitButton pendingLabel="Subiendo...">Subir foto</SubmitButton>
      </form>

      <div className="grid gap-4">
        {(photos ?? []).map((photo) => (
          <section
            key={photo.id}
            className="grid gap-4 rounded-md border border-gray-200 p-4 md:grid-cols-[180px_1fr]"
          >
            <img
              src={photo.image_url}
              alt={photo.alt_es ?? photo.alt_en ?? ""}
              className="aspect-square w-full rounded-md object-cover"
            />

            <div className="space-y-4">
              <form action={updatePhoto} className="space-y-4">
                <input type="hidden" name="id" value={photo.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_120px_120px]">
                  <div className="space-y-2">
                    <Label htmlFor={`url-${photo.id}`}>URL publica</Label>
                    <Input id={`url-${photo.id}`} value={photo.image_url} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sort-${photo.id}`}>Orden</Label>
                    <Input
                      id={`sort-${photo.id}`}
                      name="sortOrder"
                      type="number"
                      defaultValue={photo.sort_order}
                    />
                  </div>
                  <label className="flex items-end gap-2 pb-2 text-sm">
                    <input
                      name="visible"
                      type="checkbox"
                      defaultChecked={photo.visible}
                      className="h-4 w-4"
                    />
                    Visible
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`alt-es-${photo.id}`}>Alt ES</Label>
                    <Input
                      id={`alt-es-${photo.id}`}
                      name="altEs"
                      defaultValue={photo.alt_es ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`alt-en-${photo.id}`}>Alt EN</Label>
                    <Input
                      id={`alt-en-${photo.id}`}
                      name="altEn"
                      defaultValue={photo.alt_en ?? ""}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`caption-es-${photo.id}`}>Caption ES</Label>
                    <Textarea
                      id={`caption-es-${photo.id}`}
                      name="captionEs"
                      rows={2}
                      defaultValue={photo.caption_es ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`caption-en-${photo.id}`}>Caption EN</Label>
                    <Textarea
                      id={`caption-en-${photo.id}`}
                      name="captionEn"
                      rows={2}
                      defaultValue={photo.caption_en ?? ""}
                    />
                  </div>
                </div>

                <SubmitButton pendingLabel="Guardando..." variant="outline">
                  Guardar foto
                </SubmitButton>
              </form>

              <form action={deletePhoto}>
                <input type="hidden" name="id" value={photo.id} />
                <SubmitButton
                  pendingLabel="Eliminando..."
                  variant="destructive"
                  size="sm"
                >
                  Eliminar foto
                </SubmitButton>
              </form>
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}

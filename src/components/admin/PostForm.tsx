import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PostStatus } from "@/lib/supabase/types";

export type PostFormValues = {
  slug?: string;
  status?: PostStatus;
  publishedAt?: string;
  coverImageUrl?: string;
  titleEs?: string;
  descriptionEs?: string;
  contentEs?: string;
  titleEn?: string;
  descriptionEn?: string;
  contentEn?: string;
};

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  values?: PostFormValues;
  submitLabel: string;
};

export default function PostForm({
  action,
  values,
  submitLabel,
}: PostFormProps) {
  return (
    <form action={action} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="mi-nuevo-post"
            defaultValue={values?.slug}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <select
            id="status"
            name="status"
            defaultValue={values?.status ?? "draft"}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="publishedAt">Fecha de publicacion</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={values?.publishedAt}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImageUrl">Imagen de portada</Label>
          <Input
            id="coverImageUrl"
            name="coverImageUrl"
            type="url"
            placeholder="https://..."
            defaultValue={values?.coverImageUrl}
          />
        </div>
      </div>

      <section className="space-y-4 rounded-md border border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Contenido en espanol</h2>
        <div className="space-y-2">
          <Label htmlFor="titleEs">Titulo</Label>
          <Input
            id="titleEs"
            name="titleEs"
            defaultValue={values?.titleEs}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionEs">Descripcion</Label>
          <Textarea
            id="descriptionEs"
            name="descriptionEs"
            defaultValue={values?.descriptionEs}
            rows={3}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contentEs">Post</Label>
          <Textarea
            id="contentEs"
            name="contentEs"
            defaultValue={values?.contentEs}
            rows={18}
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
            defaultValue={values?.titleEn}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionEn">Descripcion</Label>
          <Textarea
            id="descriptionEn"
            name="descriptionEn"
            defaultValue={values?.descriptionEn}
            rows={3}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contentEn">Post</Label>
          <Textarea
            id="contentEn"
            name="contentEn"
            defaultValue={values?.contentEn}
            rows={18}
            required
          />
        </div>
      </section>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}

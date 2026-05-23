"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type FormEvent } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SUPABASE_MEDIA_BUCKET } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { PostStatus } from "@/lib/supabase/types";

const MAX_COVER_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_COVER_IMAGE_DIMENSION = 1800;
const COVER_IMAGE_QUALITIES = [0.84, 0.76, 0.68, 0.6];

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

function safeFileBase(fileName: string) {
  return (
    fileName
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "cover"
  );
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image-load"));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("image-compress"));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

async function compressCoverImage(file: File) {
  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error("source-size");
  }

  const image = await loadImage(file);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, MAX_COVER_IMAGE_DIMENSION / longestSide);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("image-compress");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  for (const quality of COVER_IMAGE_QUALITIES) {
    const blob = await canvasToBlob(canvas, quality);

    if (blob.size <= MAX_COVER_IMAGE_BYTES) {
      return blob;
    }
  }

  throw new Error("compressed-size");
}

async function uploadCoverImage(file: File) {
  const supabase = createSupabaseBrowserClient();
  const blob = await compressCoverImage(file);
  const path = `posts/covers/${crypto.randomUUID()}-${safeFileBase(file.name)}.webp`;
  const { error } = await supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .upload(path, blob, {
      cacheControl: "31536000",
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    throw new Error("upload");
  }

  const { data } = supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
  };
}

export default function PostForm({
  action,
  values,
  submitLabel,
}: PostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDoneRef = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const file = fileInputRef.current?.files?.[0];

    if (!file || uploadDoneRef.current) {
      return;
    }

    event.preventDefault();
    setImageError(null);
    setIsUploading(true);

    try {
      const uploadedImage = await uploadCoverImage(file);
      const form = formRef.current;

      if (!form) return;

      const uploadedPathInput = form.elements.namedItem(
        "uploadedCoverImagePath"
      ) as HTMLInputElement | null;
      const uploadedUrlInput = form.elements.namedItem(
        "uploadedCoverImageUrl"
      ) as HTMLInputElement | null;

      if (uploadedPathInput) uploadedPathInput.value = uploadedImage.path;
      if (uploadedUrlInput) uploadedUrlInput.value = uploadedImage.url;
      if (fileInputRef.current) fileInputRef.current.value = "";

      uploadDoneRef.current = true;
      form.requestSubmit();
    } catch {
      setImageError(
        "No se pudo optimizar o subir la imagen. Usa JPG, PNG, WebP, GIF o AVIF. La portada guardada debe pesar menos de 5 MB."
      );
      setIsUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-8"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input name="uploadedCoverImagePath" type="hidden" />
      <input name="uploadedCoverImageUrl" type="hidden" />

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
          <Label htmlFor="coverImageUrl">URL externa de portada</Label>
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
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Portada</h2>
          <p className="text-sm text-gray-500">
            Puedes subir una imagen nueva. Se convertira a WebP antes de
            guardarse y debe quedar por debajo de 5 MB.
          </p>
        </div>

        {values?.coverImageUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Imagen actual</p>
            <img
              alt=""
              className="h-40 w-full rounded-md border border-gray-200 object-cover md:w-80"
              src={values.coverImageUrl}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                className="h-4 w-4"
                name="removeCoverImage"
                type="checkbox"
                value="on"
              />
              Quitar imagen actual
            </label>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="coverImage">Subir portada</Label>
          <Input
            ref={fileInputRef}
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          />
          {imageError && (
            <p className="text-sm text-red-700">{imageError}</p>
          )}
        </div>
      </section>

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

      <SubmitButton disabled={isUploading}>
        {isUploading ? "Subiendo imagen..." : submitLabel}
      </SubmitButton>
    </form>
  );
}

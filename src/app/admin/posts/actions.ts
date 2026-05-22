"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/admin";
import { normalizeSlug } from "@/lib/slug";
import type { ContentLocale, PostStatus } from "@/lib/supabase/types";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalTextValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length > 0 ? value : null;
}

function statusValue(formData: FormData): PostStatus {
  return formData.get("status") === "published" ? "published" : "draft";
}

function publishedAtValue(formData: FormData, status: PostStatus) {
  const date = textValue(formData, "publishedAt");

  if (date) {
    return `${date}T00:00:00.000Z`;
  }

  return status === "published" ? new Date().toISOString() : null;
}

function translationsFromForm(formData: FormData, postId: string) {
  return [
    {
      post_id: postId,
      locale: "es" as ContentLocale,
      title: textValue(formData, "titleEs"),
      description: textValue(formData, "descriptionEs"),
      content: textValue(formData, "contentEs"),
    },
    {
      post_id: postId,
      locale: "en" as ContentLocale,
      title: textValue(formData, "titleEn"),
      description: textValue(formData, "descriptionEn"),
      content: textValue(formData, "contentEn"),
    },
  ];
}

function revalidatePostPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/posts/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/posts/${previousSlug}`);
  }
}

export async function createPost(formData: FormData) {
  const { supabase } = await getAdminContext();
  const slug = normalizeSlug(textValue(formData, "slug"));
  const status = statusValue(formData);

  if (!slug) {
    redirect("/admin/posts/new?error=slug");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      slug,
      status,
      published_at: publishedAtValue(formData, status),
      cover_image_url: optionalTextValue(formData, "coverImageUrl"),
    })
    .select("id")
    .single();

  if (postError || !post) {
    redirect("/admin/posts/new?error=save");
  }

  const { error: translationsError } = await supabase
    .from("post_translations")
    .upsert(translationsFromForm(formData, post.id), {
      onConflict: "post_id,locale",
    });

  if (translationsError) {
    redirect(`/admin/posts/${post.id}?error=translation`);
  }

  revalidatePostPaths(slug);
  redirect(`/admin/posts/${post.id}?saved=1`);
}

export async function updatePost(postId: string, formData: FormData) {
  const { supabase } = await getAdminContext();
  const slug = normalizeSlug(textValue(formData, "slug"));
  const status = statusValue(formData);

  if (!slug) {
    redirect(`/admin/posts/${postId}?error=slug`);
  }

  const { data: previousPost } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", postId)
    .single();

  const { error: postError } = await supabase
    .from("posts")
    .update({
      slug,
      status,
      published_at: publishedAtValue(formData, status),
      cover_image_url: optionalTextValue(formData, "coverImageUrl"),
    })
    .eq("id", postId);

  if (postError) {
    redirect(`/admin/posts/${postId}?error=save`);
  }

  const { error: translationsError } = await supabase
    .from("post_translations")
    .upsert(translationsFromForm(formData, postId), {
      onConflict: "post_id,locale",
    });

  if (translationsError) {
    redirect(`/admin/posts/${postId}?error=translation`);
  }

  revalidatePostPaths(slug, previousPost?.slug);
  redirect(`/admin/posts/${postId}?saved=1`);
}

export async function deletePost(postId: string) {
  const { supabase } = await getAdminContext();
  const { data: previousPost } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", postId)
    .single();

  await supabase.from("posts").delete().eq("id", postId);

  revalidatePath("/");
  revalidatePath("/blog");

  if (previousPost?.slug) {
    revalidatePath(`/blog/posts/${previousPost.slug}`);
  }

  redirect("/admin/posts");
}

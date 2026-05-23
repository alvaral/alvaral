"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/admin";
import { normalizeSlug } from "@/lib/slug";
import type { ContentLocale, PostStatus } from "@/lib/supabase/types";

type SupabaseActionError = {
  code?: string;
  details?: string | null;
  hint?: string | null;
  message?: string;
};

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

function logPostError(action: string, error: SupabaseActionError | null) {
  console.error(`[admin/posts] ${action} failed`, {
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    message: error?.message,
  });
}

function postErrorParam(error: SupabaseActionError | null) {
  if (!error) {
    return "save";
  }

  if (error.code === "23505") {
    return "duplicate";
  }

  if (error.code === "23514") {
    return "slug";
  }

  if (error.code === "42501") {
    return "permission";
  }

  if (error.code === "42P01" || error.code === "42703") {
    return "schema";
  }

  return "save";
}

export async function createPost(formData: FormData) {
  const { supabase } = await getAdminContext();
  const slug = normalizeSlug(textValue(formData, "slug"));
  const status = statusValue(formData);

  if (!slug) {
    redirect("/admin/posts/new?error=slug");
  }

  const { data: existingPost, error: existingPostError } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingPostError) {
    logPostError("check duplicate slug", existingPostError);
    redirect(`/admin/posts/new?error=${postErrorParam(existingPostError)}`);
  }

  if (existingPost) {
    redirect("/admin/posts/new?error=duplicate");
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
    logPostError("create post", postError);
    redirect(`/admin/posts/new?error=${postErrorParam(postError)}`);
  }

  const { error: translationsError } = await supabase
    .from("post_translations")
    .upsert(translationsFromForm(formData, post.id), {
      onConflict: "post_id,locale",
  });

  if (translationsError) {
    logPostError("create post translations", translationsError);
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
    logPostError("update post", postError);
    redirect(`/admin/posts/${postId}?error=${postErrorParam(postError)}`);
  }

  const { error: translationsError } = await supabase
    .from("post_translations")
    .upsert(translationsFromForm(formData, postId), {
      onConflict: "post_id,locale",
  });

  if (translationsError) {
    logPostError("update post translations", translationsError);
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

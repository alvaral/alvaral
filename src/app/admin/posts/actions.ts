"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/admin";
import { normalizeSlug } from "@/lib/slug";
import { SUPABASE_MEDIA_BUCKET } from "@/lib/supabase/config";
import { getPublicMediaUrl } from "@/lib/supabase/storage";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentLocale, Database, PostStatus } from "@/lib/supabase/types";

type SupabaseActionError = {
  code?: string;
  details?: string | null;
  hint?: string | null;
  message?: string;
};

type PreviousPost = {
  slug: string;
  cover_image_url: string | null;
  cover_image_path: string | null;
};

type CoverImage = {
  url: string | null;
  path: string | null;
};

const COVER_UPLOAD_PREFIX = "posts/covers/";

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

function uploadedCoverFromForm(formData: FormData): CoverImage | null {
  const path = optionalTextValue(formData, "uploadedCoverImagePath");
  const url = optionalTextValue(formData, "uploadedCoverImageUrl");

  if (!path || !url) return null;
  if (!path.startsWith(COVER_UPLOAD_PREFIX)) return null;

  return { path, url };
}

function coverImageFromForm(
  formData: FormData,
  previousPost?: PreviousPost | null
): CoverImage {
  const uploadedCover = uploadedCoverFromForm(formData);

  if (uploadedCover) {
    return uploadedCover;
  }

  if (formData.get("removeCoverImage") === "on") {
    return { path: null, url: null };
  }

  const url = optionalTextValue(formData, "coverImageUrl");

  if (!previousPost?.cover_image_path) {
    return { path: null, url };
  }

  const previousUrl =
    previousPost.cover_image_url ?? getPublicMediaUrl(previousPost.cover_image_path);

  if (url && url === previousUrl) {
    return {
      path: previousPost.cover_image_path,
      url: previousPost.cover_image_url ?? url,
    };
  }

  return { path: null, url };
}

async function removeCoverImage(
  supabase: SupabaseClient<Database>,
  path: string | null | undefined
) {
  if (!path?.startsWith(COVER_UPLOAD_PREFIX)) return;

  await supabase.storage.from(SUPABASE_MEDIA_BUCKET).remove([path]);
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
  const postId = crypto.randomUUID();
  const slug = normalizeSlug(textValue(formData, "slug"));
  const status = statusValue(formData);
  const coverImage = coverImageFromForm(formData);

  if (!slug) {
    await removeCoverImage(supabase, coverImage.path);
    redirect("/admin/posts/new?error=slug");
  }

  const { data: existingPost, error: existingPostError } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingPostError) {
    await removeCoverImage(supabase, coverImage.path);
    logPostError("check duplicate slug", existingPostError);
    redirect(`/admin/posts/new?error=${postErrorParam(existingPostError)}`);
  }

  if (existingPost) {
    await removeCoverImage(supabase, coverImage.path);
    redirect("/admin/posts/new?error=duplicate");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      id: postId,
      slug,
      status,
      published_at: publishedAtValue(formData, status),
      cover_image_url: coverImage.url,
      cover_image_path: coverImage.path,
    })
    .select("id")
    .single();

  if (postError || !post) {
    await removeCoverImage(supabase, coverImage.path);
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
    .select("slug, cover_image_url, cover_image_path")
    .eq("id", postId)
    .single()
    .returns<PreviousPost>();

  const coverImage = coverImageFromForm(formData, previousPost);

  const { error: postError } = await supabase
    .from("posts")
    .update({
      slug,
      status,
      published_at: publishedAtValue(formData, status),
      cover_image_url: coverImage.url,
      cover_image_path: coverImage.path,
    })
    .eq("id", postId);

  if (postError) {
    if (coverImage.path !== previousPost?.cover_image_path) {
      await removeCoverImage(supabase, coverImage.path);
    }

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

  if (coverImage.path !== previousPost?.cover_image_path) {
    await removeCoverImage(supabase, previousPost?.cover_image_path);
  }

  revalidatePostPaths(slug, previousPost?.slug);
  redirect(`/admin/posts/${postId}?saved=1`);
}

export async function deletePost(postId: string) {
  const { supabase } = await getAdminContext();
  const { data: previousPost } = await supabase
    .from("posts")
    .select("slug, cover_image_path")
    .eq("id", postId)
    .single()
    .returns<Pick<PreviousPost, "slug" | "cover_image_path">>();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    logPostError("delete post", error);
    redirect(`/admin/posts/${postId}?error=${postErrorParam(error)}`);
  }

  await removeCoverImage(supabase, previousPost?.cover_image_path);

  revalidatePath("/");
  revalidatePath("/blog");

  if (previousPost?.slug) {
    revalidatePath(`/blog/posts/${previousPost.slug}`);
  }

  redirect("/admin/posts");
}

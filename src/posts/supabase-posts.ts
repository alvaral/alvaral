import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from "@/i18n/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicMediaUrl } from "@/lib/supabase/storage";
import type { ContentLocale, PostStatus } from "@/lib/supabase/types";

export type BlogPost = {
  id: string;
  date: string;
  href: string;
  imageSrc?: string;
  translations: Record<
    AppLocale,
    {
      title: string;
      description: string;
    }
  >;
  title: string;
  description: string;
};

export type PublishedPost = BlogPost & {
  content?: string;
  status?: PostStatus;
  updatedAt?: string;
};

type TranslationRow = {
  locale: ContentLocale;
  title: string;
  description: string;
  content: string;
};

type PostRow = {
  id: string;
  slug: string;
  status: PostStatus;
  published_at: string | null;
  cover_image_url: string | null;
  cover_image_path: string | null;
  updated_at: string;
  post_translations: TranslationRow[] | TranslationRow | null;
};

function resolveLocale(locale: string): AppLocale {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

function normalizeTranslations(
  translations: TranslationRow[] | TranslationRow | null
) {
  if (!translations) return [];
  return Array.isArray(translations) ? translations : [translations];
}

function mapPost(row: PostRow, locale: AppLocale): PublishedPost | null {
  const translation =
    normalizeTranslations(row.post_translations).find(
      (candidate) => candidate.locale === locale
    ) ?? normalizeTranslations(row.post_translations)[0];

  if (!translation) return null;

  const date =
    row.published_at?.slice(0, 10) ?? row.updated_at?.slice(0, 10) ?? "";
  const imageSrc =
    row.cover_image_url ?? getPublicMediaUrl(row.cover_image_path) ?? undefined;

  return {
    id: row.slug,
    date,
    href: `/blog/posts/${row.slug}`,
    imageSrc,
    translations: {
      en: {
        title: translation.title,
        description: translation.description,
      },
      es: {
        title: translation.title,
        description: translation.description,
      },
    },
    title: translation.title,
    description: translation.description,
    content: translation.content,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

async function fetchSupabasePosts(locale: AppLocale) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, status, published_at, cover_image_url, cover_image_path, updated_at, post_translations(locale, title, description, content)"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .returns<PostRow[]>();

  if (error || !data) return [];

  return data
    .map((row) => mapPost(row, locale))
    .filter((post): post is PublishedPost => post != null);
}

export async function getPublishedPosts(locale: string) {
  const resolvedLocale = resolveLocale(locale);
  const posts = await fetchSupabasePosts(resolvedLocale);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getLatestPublishedPost(locale: string) {
  return (await getPublishedPosts(locale))[0];
}

export async function getPublishedPostBySlug(slug: string, locale: string) {
  const resolvedLocale = resolveLocale(locale);
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, slug, status, published_at, cover_image_url, cover_image_path, updated_at, post_translations(locale, title, description, content)"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
      .returns<PostRow | null>();

    if (!error && data) {
      return mapPost(data, resolvedLocale);
    }
  }
  return null;
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { SUPPORTED_LOCALES, withLocalePathname } from "@/i18n/locale";
import { getPublishedPosts } from "@/posts/supabase-posts";

export const dynamic = "force-dynamic";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/blog", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/focus", priority: 0.6 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = SUPPORTED_LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: new URL(
        withLocalePathname(route.path, locale),
        siteConfig.url
      ).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    }))
  );
  const postsByLocale = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) => ({
      locale,
      posts: await getPublishedPosts(locale),
    }))
  );
  const postEntries = postsByLocale.flatMap(({ locale, posts }) =>
    posts.map((post) => ({
      url: new URL(
        withLocalePathname(post.href, locale),
        siteConfig.url
      ).toString(),
      lastModified: new Date(post.updatedAt ?? `${post.date}T00:00:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...postEntries];
}

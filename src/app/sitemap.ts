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
  { path: "/typing", priority: 0.55 },
] as const;

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function localizedUrl(path: string, locale: (typeof SUPPORTED_LOCALES)[number]) {
  return absoluteUrl(withLocalePathname(path, locale));
}

function languageAlternates(path: string) {
  return {
    "x-default": localizedUrl(path, "en"),
    ...Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, localizedUrl(path, locale)])
    ),
  };
}

function sitemapEntry({
  changeFrequency,
  lastModified,
  path,
  priority,
}: {
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified: Date;
  path: string;
  priority: number;
}) {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: localizedUrl(path, locale),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: languageAlternates(path),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = staticRoutes.flatMap((route) =>
    sitemapEntry({
      path: route.path,
      lastModified: now,
      changeFrequency: "weekly",
      priority: route.priority,
    })
  );
  const postsByLocale = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) => ({
      locale,
      posts: await getPublishedPosts(locale),
    }))
  );
  const postEntries = postsByLocale.flatMap(({ locale, posts }) =>
    posts.map((post) => ({
      url: localizedUrl(post.href, locale),
      lastModified: new Date(post.updatedAt ?? `${post.date}T00:00:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: languageAlternates(post.href),
      },
    }))
  );

  return [...staticEntries, ...postEntries];
}

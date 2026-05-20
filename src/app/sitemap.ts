import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE } from "@/i18n/locale";
import { getPosts } from "@/posts/posts";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/blog", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/focus", priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: new URL(route.path, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
  const postEntries = getPosts(DEFAULT_LOCALE).map((post) => ({
    url: new URL(post.href, siteConfig.url).toString(),
    lastModified: new Date(`${post.date}T00:00:00`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}

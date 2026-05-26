import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/en/admin",
          "/en/admin/",
          "/es/admin",
          "/es/admin/",
        ],
      },
    ],
    host: new URL(siteConfig.url).origin,
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const baseOpenGraph = {
    title,
    description,
    url,
    siteName: siteConfig.name,
  };

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph:
      type === "article"
        ? {
            ...baseOpenGraph,
            type,
            publishedTime,
            authors: [siteConfig.author],
          }
        : {
            ...baseOpenGraph,
            type,
          },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

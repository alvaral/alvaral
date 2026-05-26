import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  withLocalePathname,
  type AppLocale,
} from "@/i18n/locale";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: AppLocale;
  absoluteTitle?: boolean;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  en: "en_US",
  es: "es_ES",
};

export function createLocalizedAlternates(path: string, locale: AppLocale) {
  const languages = SUPPORTED_LOCALES.reduce<Record<string, string>>(
    (accumulator, supportedLocale) => ({
      ...accumulator,
      [supportedLocale]: withLocalePathname(path, supportedLocale),
    }),
    {
      "x-default": withLocalePathname(path, DEFAULT_LOCALE),
    }
  );

  return {
    canonical: withLocalePathname(path, locale),
    languages,
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  locale = DEFAULT_LOCALE,
  absoluteTitle = false,
  image = "/opengraph-image",
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const localizedPath = withLocalePathname(path, locale);
  const url = new URL(localizedPath, siteConfig.url).toString();
  const imageUrl = new URL(image, siteConfig.url).toString();
  const baseOpenGraph = {
    title,
    description,
    url,
    siteName: siteConfig.name,
    locale: OPEN_GRAPH_LOCALES[locale],
    alternateLocale: SUPPORTED_LOCALES.filter(
      (supportedLocale) => supportedLocale !== locale
    ).map((supportedLocale) => OPEN_GRAPH_LOCALES[supportedLocale]),
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: createLocalizedAlternates(path, locale),
    openGraph:
      type === "article"
        ? {
            ...baseOpenGraph,
            type,
            publishedTime,
            modifiedTime,
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
      images: [imageUrl],
    },
  };
}

import { siteConfig } from "@/config/site";
import { withLocalePathname, type AppLocale } from "@/i18n/locale";
import type { PublishedPost } from "@/posts/supabase-posts";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function localizedUrl(path: string, locale: AppLocale) {
  return absoluteUrl(withLocalePathname(path, locale));
}

function personId() {
  return absoluteUrl("/#person");
}

function websiteId() {
  return absoluteUrl("/#website");
}

export function personStructuredData(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(),
    name: siteConfig.author,
    url: localizedUrl("/about", locale),
    image: absoluteUrl("/assets/images/profile-photo.webp"),
    sameAs: [siteConfig.links.instagram],
    jobTitle: locale === "es" ? "Ingeniero de Software" : "Software Engineer",
  };
}

export function websiteStructuredData(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(),
    name: siteConfig.name,
    url: localizedUrl("/", locale),
    inLanguage: locale,
    publisher: {
      "@id": personId(),
    },
  };
}

export function blogStructuredData(locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} blog`,
    url: localizedUrl("/blog", locale),
    inLanguage: locale,
    author: {
      "@id": personId(),
    },
    publisher: {
      "@id": personId(),
    },
  };
}

export function blogPostStructuredData({
  locale,
  post,
}: {
  locale: AppLocale;
  post: PublishedPost;
}) {
  const url = localizedUrl(post.href, locale);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    image: post.imageSrc
      ? absoluteUrl(post.imageSrc)
      : absoluteUrl("/opengraph-image"),
    author: {
      "@id": personId(),
    },
    publisher: {
      "@id": personId(),
    },
  };
}

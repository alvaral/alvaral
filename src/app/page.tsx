import Section from "@/components/Section";
import Gallery from "@/components/Gallery";
import { getLocale, getTranslations } from "next-intl/server";
import BlogCard from "@/components/BlogCard";
import Divider from "@/components/Divider";
import StructuredData from "@/components/StructuredData";
import { siteConfig } from "@/config/site";
import { normalizeLocale, withLocalePathname } from "@/i18n/locale";
import { getGalleryImages } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import { seoContent } from "@/lib/seo-content";
import {
  personStructuredData,
  websiteStructuredData,
} from "@/lib/structured-data";
import { getLatestPublishedPost } from "@/posts/supabase-posts";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = normalizeLocale(await getLocale());

  return createPageMetadata({
    title: siteConfig.name,
    description: seoContent[locale].home.description,
    path: "/",
    locale,
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const t = await getTranslations("homepage");
  const locale = normalizeLocale(await getLocale());
  const images = await getGalleryImages(locale);
  const latestPost = await getLatestPublishedPost(locale);

  return (
    <main className="p-8">
      <StructuredData
        data={[websiteStructuredData(locale), personStructuredData(locale)]}
      />
      <Section
        index={0}
        sectionHeight="custom"
        customHeight={10}
        contentWidth="wide"
        horizontalAlign="center"
        verticalAlign="middle"
      >
        <h1 className="text-4xl font-bold mb-4">{t("greeting")}</h1>
        <h2 className="text-gray-700 text-lg leading-relaxed mb-3">
          {t("intro")}
        </h2>
      </Section>
      <Divider />
      <Gallery images={images} />
      <Divider />
      {latestPost && (
        <Section index={1} delay={images.length * 0.2}>
          <BlogCard
            title={latestPost.title}
            description={latestPost.description}
            href={withLocalePathname(latestPost.href, locale)}
            imageSrc={latestPost.imageSrc}
            locale={locale}
          />
        </Section>
      )}
    </main>
  );
}

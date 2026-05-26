import Section from "@/components/Section";
import BlogCard from "@/components/BlogCard";
import { getLocale, getTranslations } from "next-intl/server";
import StructuredData from "@/components/StructuredData";
import { normalizeLocale, withLocalePathname } from "@/i18n/locale";
import { getPublishedPosts } from "@/posts/supabase-posts";
import { createPageMetadata } from "@/lib/metadata";
import { seoContent } from "@/lib/seo-content";
import { blogStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = normalizeLocale(await getLocale());

  return createPageMetadata({
    title: seoContent[locale].blog.title,
    description: seoContent[locale].blog.description,
    path: "/blog",
    locale,
  });
}

export default async function BlogPage() {
  const t = await getTranslations("blogPage");
  const locale = normalizeLocale(await getLocale());
  const posts = await getPublishedPosts(locale);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 font-geist text-gray-900">
      <StructuredData data={blogStructuredData(locale)} />
      <Section key={1}>
        <h1 className="text-5xl font-bold font-geist mb-12 leading-tight">
          {t("title")}
        </h1>
      </Section>

      <ul className="space-y-16">
        {posts.map(({ id, title, description, date, imageSrc }, index) => (
          <Section key={id + 1} delay={index * 1}>
            <BlogCard
              title={title}
              description={description}
              date={date}
              imageSrc={imageSrc}
              href={withLocalePathname(`/blog/posts/${id}`, locale)}
              locale={locale}
            />
          </Section>
        ))}
      </ul>
    </main>
  );
}

import Section from "@/components/Section";
import BlogCard from "@/components/BlogCard";
import { useLocale, useTranslations } from "next-intl";
import { getPosts } from "@/posts/posts";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Articles about software engineering, programming, frontend, backend, and developer life.",
  path: "/blog",
});

export default function BlogPage() {
  const t = useTranslations("blogPage");
  const locale = useLocale();
  const posts = getPosts(locale);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 font-geist text-gray-900">
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
              href={`/blog/posts/${id}`}
              locale={locale}
            />
          </Section>
        ))}
      </ul>
    </main>
  );
}

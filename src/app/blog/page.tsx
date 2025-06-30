import Section from "@/components/Section";
import BlogCard from "@/components/BlogCard";
import { useLocale, useTranslations } from "next-intl";
import { getPosts } from "@/posts/posts";

export default function BlogPage() {
  const t = useTranslations("blogPage");
  const locale = useLocale();
  const posts = getPosts(locale);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 font-serif text-gray-900">
      <Section key={1}>
        <h1 className="text-5xl font-bold font-sans mb-12 leading-tight">
          {t("title")}
        </h1>
      </Section>

      <ul className="space-y-16">
        {posts.map(({ id, title, description, date, imageSrc }) => (
          <Section key={id + 1} delay={0.5}>
            <BlogCard
              title={title}
              description={description}
              date={date}
              imageSrc={imageSrc}
              href={`/blog/posts/${id}`}
            />
          </Section>
        ))}
      </ul>
    </main>
  );
}

import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import AuthorInfo from "@/components/AuthorInfoCard";
import StructuredData from "@/components/StructuredData";
import MarkdownContent from "@/components/blogPost/MarkdownContent";
import { PostLayout } from "@/components/blogPost/PostLayout";
import { siteConfig } from "@/config/site";
import { normalizeLocale, withLocalePathname } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { blogPostStructuredData } from "@/lib/structured-data";
import { getPublishedPostBySlug } from "@/posts/supabase-posts";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPageLocale() {
  return normalizeLocale(await getLocale());
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getPageLocale();
  const post = await getPublishedPostBySlug(slug, locale);

  if (!post) {
    return createPageMetadata({
      title: "Post",
      description: "Blog post",
      path: `/blog/posts/${slug}`,
      locale,
      type: "article",
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/posts/${slug}`,
    locale,
    image: post.imageSrc,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
  });
}

export default async function DynamicBlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getPageLocale();
  const post = await getPublishedPostBySlug(slug, locale);
  const content =
    post && "content" in post && typeof post.content === "string"
      ? post.content
      : "";

  if (!post || !content) {
    notFound();
  }

  return (
    <PostLayout title={post.title}>
      <StructuredData data={blogPostStructuredData({ locale, post })} />
      <MarkdownContent content={content} />
      <div className="mt-10">
        <AuthorInfo
          name={siteConfig.author}
          role={locale === "es" ? "Ingeniero de Software" : "Software Engineer"}
          avatar="/assets/images/profile-photo.webp"
          infoUrl={withLocalePathname("/about", locale)}
        />
      </div>
    </PostLayout>
  );
}

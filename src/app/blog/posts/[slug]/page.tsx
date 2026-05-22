import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/blogPost/MarkdownContent";
import { PostLayout } from "@/components/blogPost/PostLayout";
import { LOCALE_COOKIE_NAME, normalizeLocale } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedPostBySlug } from "@/posts/supabase-posts";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPageLocale() {
  return normalizeLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
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
      type: "article",
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/posts/${slug}`,
    type: "article",
    publishedTime: post.date,
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
      <MarkdownContent content={content} />
    </PostLayout>
  );
}

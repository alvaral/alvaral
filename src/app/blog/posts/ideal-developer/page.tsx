import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, normalizeLocale } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { getPostById } from "@/posts/posts";

const POST_ID = "ideal-developer";

async function getPageLocale() {
  return normalizeLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
}

export async function generateMetadata() {
  const locale = await getPageLocale();
  const post = getPostById(POST_ID, locale);

  return createPageMetadata({
    title: post?.title ?? "The Ideal Software Developer",
    description:
      post?.description ??
      "What makes the perfect developer? Technical skills, soft skills, and a touch of humility.",
    path: `/blog/posts/${POST_ID}`,
    type: "article",
    publishedTime: post?.date,
  });
}

export default async function IdealDeveloperPage() {
  const locale = await getPageLocale();

  const Post =
    locale === "en"
      ? (await import("./en")).default
      : (await import("./es")).default;

  return <Post />;
}

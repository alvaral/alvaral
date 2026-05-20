import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, normalizeLocale } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { getPostById } from "@/posts/posts";

const POST_ID = "frontend-vs-backend";

async function getPageLocale() {
  return normalizeLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
}

export async function generateMetadata() {
  const locale = await getPageLocale();
  const post = getPostById(POST_ID, locale);

  return createPageMetadata({
    title: post?.title ?? "Frontend vs Backend: Two Halves of the Same Whole",
    description:
      post?.description ??
      "The interface you see and the logic you don't. Two worlds, one goal: building products that work.",
    path: `/blog/posts/${POST_ID}`,
    type: "article",
    publishedTime: post?.date,
  });
}

export default async function FrontendVsBackendPage() {
  const locale = await getPageLocale();

  const Post =
    locale === "en"
      ? (await import("./en")).default
      : (await import("./es")).default;

  return <Post />;
}

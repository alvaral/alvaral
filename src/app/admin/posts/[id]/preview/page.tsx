import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorInfo from "@/components/AuthorInfoCard";
import AdminShell from "@/components/admin/AdminShell";
import MarkdownContent from "@/components/blogPost/MarkdownContent";
import { PostLayout } from "@/components/blogPost/PostLayout";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  isSupportedLocale,
  withLocalePathname,
  type AppLocale,
} from "@/i18n/locale";
import { getAdminContext } from "@/lib/supabase/admin";
import type { ContentLocale, PostStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vista previa",
  robots: {
    index: false,
    follow: false,
  },
};

type PreviewPostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    locale?: string;
  }>;
};

type PreviewPostRow = {
  id: string;
  slug: string;
  status: PostStatus;
  post_translations: {
    locale: ContentLocale;
    title: string;
    content: string;
  }[];
};

const DEFAULT_PREVIEW_LOCALE: AppLocale = "es";

function previewLocale(value: string | undefined): AppLocale {
  return isSupportedLocale(value) ? value : DEFAULT_PREVIEW_LOCALE;
}

function previewTranslation(post: PreviewPostRow, locale: AppLocale) {
  return (
    post.post_translations.find((translation) => translation.locale === locale) ??
    post.post_translations[0]
  );
}

export default async function DraftPreviewPage({
  params,
  searchParams,
}: PreviewPostPageProps) {
  const { id } = await params;
  const { locale: localeParam } = (await searchParams) ?? {};
  const locale = previewLocale(localeParam);
  const { supabase, user } = await getAdminContext();
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, status, post_translations(locale, title, content)")
    .eq("id", id)
    .single()
    .returns<PreviewPostRow>();

  if (!post) {
    notFound();
  }

  const translation = previewTranslation(post, locale);

  if (!translation?.content) {
    notFound();
  }

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Vista previa {post.status === "draft" ? "de borrador" : ""}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{post.slug}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            variant={locale === "es" ? "default" : "outline"}
          >
            <Link href={`/admin/posts/${id}/preview?locale=es`}>ES</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={locale === "en" ? "default" : "outline"}
          >
            <Link href={`/admin/posts/${id}/preview?locale=en`}>EN</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/admin/posts/${id}`}>Editar</Link>
          </Button>
        </div>
      </div>

      <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Esta vista solo muestra la version guardada y esta protegida por el
        admin.
      </p>

      <PostLayout title={translation.title}>
        <MarkdownContent content={translation.content} />
        <div className="mt-10">
          <AuthorInfo
            name={siteConfig.author}
            role={
              locale === "es" ? "Ingeniero de Software" : "Software Engineer"
            }
            avatar="/assets/images/profile-photo.webp"
            infoUrl={withLocalePathname("/about", locale)}
          />
        </div>
      </PostLayout>
    </AdminShell>
  );
}

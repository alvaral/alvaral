import { getLocale } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { seoContent } from "@/lib/seo-content";
import { FocusPageClient } from "./FocusPageClient";

export async function generateMetadata() {
  const locale = normalizeLocale(await getLocale());

  return createPageMetadata({
    title: seoContent[locale].focus.title,
    description: seoContent[locale].focus.description,
    path: "/focus",
    locale,
  });
}

export default function Focus() {
  return <FocusPageClient />;
}

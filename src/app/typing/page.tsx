import { getLocale } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { seoContent } from "@/lib/seo-content";
import { TypingTrainerPageClient } from "@/components/typingTrainer/typing-trainer";

export async function generateMetadata() {
  const locale = normalizeLocale(await getLocale());

  return createPageMetadata({
    title: seoContent[locale].typing.title,
    description: seoContent[locale].typing.description,
    path: "/typing",
    locale,
  });
}

export default function TypingPage() {
  return <TypingTrainerPageClient />;
}

import Section from "@/components/Section";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { normalizeLocale, withLocalePathname } from "@/i18n/locale";

export default function NotFound() {
  const locale = normalizeLocale(useLocale());
  const t = useTranslations("notFound");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center animate-fadeIn">
      <Section>
        <h1 className="text-6xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl mb-8">{t("description")}</p>
        <Link
          href={withLocalePathname("/", locale)}
          className="text-blue-600 hover:underline"
        >
          {t("backHome")}
        </Link>
      </Section>
    </main>
  );
}

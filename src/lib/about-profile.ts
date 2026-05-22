import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from "@/i18n/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type AboutProfile = {
  title: string;
  intro: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
};

type AboutProfileRow = Database["public"]["Tables"]["about_profile"]["Row"];

function resolveLocale(locale: string): AppLocale {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

function mapAboutProfile(row: AboutProfileRow, locale: AppLocale) {
  const isSpanish = locale === "es";

  return {
    title: isSpanish ? row.title_es : row.title_en,
    intro: isSpanish ? row.intro_es : row.intro_en,
    body: isSpanish ? row.body_es : row.body_en,
    imageUrl: row.image_url,
    imageAlt: isSpanish ? "Foto de Álvaro Alonso" : "Photo of Álvaro Alonso",
  };
}

export async function getAboutProfile(locale: string): Promise<AboutProfile> {
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations("about");
  const fallback = {
    title: t("title"),
    intro: t("intro"),
    body: t("body"),
    imageUrl: "/assets/images/profile-photo.webp",
    imageAlt:
      resolvedLocale === "es"
        ? "Foto de Álvaro Alonso"
        : "Photo of Álvaro Alonso",
  };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("about_profile")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) return fallback;

  return mapAboutProfile(data, resolvedLocale);
}

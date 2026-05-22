import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from "@/i18n/locale";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type GalleryImage = {
  src: string;
  alt?: string;
};

export const staticGalleryImages: GalleryImage[] = [
  { src: "/assets/images/1.webp" },
  { src: "/assets/images/4.webp" },
  { src: "/assets/images/3.webp" },
  { src: "/assets/images/2.webp" },
  { src: "/assets/images/8.webp" },
  { src: "/assets/images/5.webp" },
  { src: "/assets/images/6.webp" },
  { src: "/assets/images/7.webp" },
];

type PhotoRow = {
  image_url: string;
  alt_es: string | null;
  alt_en: string | null;
  sort_order: number;
  created_at: string;
};

function resolveLocale(locale: string): AppLocale {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export async function getGalleryImages(locale: string) {
  noStore();

  const resolvedLocale = resolveLocale(locale);
  const supabase = await createSupabaseServerClient();

  if (!supabase) return staticGalleryImages;

  const { data, error } = await supabase
    .from("photos")
    .select("image_url, alt_es, alt_en, sort_order, created_at")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<PhotoRow[]>();

  if (error || !data || data.length === 0) {
    return staticGalleryImages;
  }

  return data.map((photo) => ({
    src: photo.image_url,
    alt:
      resolvedLocale === "es"
        ? photo.alt_es ?? photo.alt_en ?? undefined
        : photo.alt_en ?? photo.alt_es ?? undefined,
  }));
}

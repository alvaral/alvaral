import { getLocale } from "next-intl/server";
import { normalizeLocale } from "@/i18n/locale";
import { createPageMetadata } from "@/lib/metadata";
import { FocusPageClient } from "./FocusPageClient";

export async function generateMetadata() {
  const locale = normalizeLocale(await getLocale());

  return createPageMetadata({
    title: "Focus timer",
    description:
      "A small focus timer with task tracking for planning and completing focused work sessions.",
    path: "/focus",
    locale,
  });
}

export default function Focus() {
  return <FocusPageClient />;
}

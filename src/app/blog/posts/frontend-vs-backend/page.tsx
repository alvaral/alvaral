import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, normalizeLocale } from "@/i18n/locale";

export default async function FrontendVsBackendPage() {
  const locale = normalizeLocale(
    (await cookies()).get(LOCALE_COOKIE_NAME)?.value
  );

  const Post =
    locale === "en"
      ? (await import("./en")).default
      : (await import("./es")).default;

  return <Post />;
}

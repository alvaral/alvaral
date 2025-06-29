import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "es"];
const DEFAULT_LOCALE = "en";

export default getRequestConfig(async () => {
  const cookieStore =  await cookies();
  const cookieLocale = cookieStore.get("ALVARAL_LOCALE")?.value;

  const locale: string =
    SUPPORTED_LOCALES.includes(cookieLocale || "") ? cookieLocale! : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

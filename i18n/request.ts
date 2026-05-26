import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE_NAME,
  isSupportedLocale,
  normalizeLocale,
} from "../src/i18n/locale";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersStore = await headers();
  const localeHeader = headersStore.get("x-alvaral-locale");
  const locale = isSupportedLocale(localeHeader)
    ? localeHeader
    : normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

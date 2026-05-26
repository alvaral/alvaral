export const LOCALE_COOKIE_NAME = "ALVARAL_LOCALE";
export const SUPPORTED_LOCALES = ["en", "es"] as const;
export const DEFAULT_LOCALE = "en";
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  es: "Espa\u00f1ol",
};

export function isSupportedLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" &&
    SUPPORTED_LOCALES.includes(value as AppLocale)
  );
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  const normalized = value?.toLowerCase().split("-")[0];
  return isSupportedLocale(normalized) ? normalized : DEFAULT_LOCALE;
}

export function localeFromPathname(pathname: string): AppLocale | undefined {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isSupportedLocale(segment) ? segment : undefined;
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = localeFromPathname(pathname);

  if (!locale) return pathname || "/";

  const strippedPath = pathname.replace(`/${locale}`, "") || "/";
  return strippedPath.startsWith("/") ? strippedPath : `/${strippedPath}`;
}

export function withLocalePathname(pathname: string, locale: AppLocale) {
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
}

export function readLocaleFromCookieString(
  cookieString: string
): AppLocale | undefined {
  const cookieValue = cookieString
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!cookieValue) return undefined;

  try {
    const decodedValue = decodeURIComponent(cookieValue);
    return isSupportedLocale(decodedValue) ? decodedValue : undefined;
  } catch {
    return undefined;
  }
}

export function createLocaleCookie(locale: AppLocale) {
  return `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

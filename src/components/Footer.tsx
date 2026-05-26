"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  createLocaleCookie,
  LOCALE_LABELS,
  localeFromPathname,
  normalizeLocale,
  stripLocaleFromPathname,
  SUPPORTED_LOCALES,
  withLocalePathname,
} from "@/i18n/locale";
import Section from "./Section";

export default function Footer() {
  const pathname = usePathname();
  const intlLocale = useLocale();
  const locale = localeFromPathname(pathname) ?? normalizeLocale(intlLocale);
  const visiblePathname = stripLocaleFromPathname(pathname);
  const t = useTranslations("footer");

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = normalizeLocale(event.target.value);
    const nextPathname = withLocalePathname(pathname, selectedLocale);

    document.cookie = createLocaleCookie(selectedLocale);
    window.location.assign(`${nextPathname}${window.location.search}`);
  };

  if (visiblePathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <Section delay={1}>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h4 className="text-xl font-semibold mb-4">alvaral</h4>
          <p className="mb-2">
            {t("follow")}{" "}
            <a
              href="https://www.instagram.com/alvaroalonsoprz"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Instagram
            </a>
          </p>
          <p className="mb-1">{t("businessEmail")}</p>
          <a href="mailto:alvaroalonso222@gmail.com" className="text-gray-600">
            alvaroalonso222@gmail.com
          </a>
          <div className="mt-4">
            <label htmlFor="language-select" className="mr-2 font-medium">
              {t("languageLabel")}:
            </label>
            <select
              id="language-select"
              value={locale}
              onChange={handleLocaleChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {SUPPORTED_LOCALES.map((supportedLocale) => (
                <option key={supportedLocale} value={supportedLocale}>
                  {LOCALE_LABELS[supportedLocale]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>
    </footer>
  );
}

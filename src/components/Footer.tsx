"use client";
import { useEffect, useState } from "react";
import Section from "./Section";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const [locale, setLocale] = useState<string>("");
  const router = useRouter();
  const t = useTranslations("footer");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ALVARAL_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `ALVARAL_LOCALE=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = event.target.value;
    document.cookie = `ALVARAL_LOCALE=${selectedLocale};`;
    setLocale(selectedLocale);
    router.refresh();
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <Section>
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
          <a
            href="mailto:alvaroalonso222@gmail.com"
            className="text-gray-600"
          >
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
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </Section>
    </footer>
  );
}

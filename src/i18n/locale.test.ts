import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  createLocaleCookie,
  normalizeLocale,
  readLocaleFromCookieString,
} from "@/i18n/locale";

describe("locale helpers", () => {
  it("normalizes supported browser locales", () => {
    expect(normalizeLocale("es-ES")).toBe("es");
    expect(normalizeLocale("en-US")).toBe("en");
  });

  it("falls back to the default locale for unsupported values", () => {
    expect(normalizeLocale("fr-FR")).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("reads only valid locale cookies", () => {
    expect(readLocaleFromCookieString("theme=light; ALVARAL_LOCALE=es")).toBe(
      "es"
    );
    expect(readLocaleFromCookieString("ALVARAL_LOCALE=fr")).toBeUndefined();
  });

  it("creates a site-wide persistent locale cookie", () => {
    expect(createLocaleCookie("en")).toContain("Path=/");
    expect(createLocaleCookie("en")).toContain("SameSite=Lax");
    expect(createLocaleCookie("en")).toContain("Max-Age=");
  });
});

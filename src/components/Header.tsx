"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  localeFromPathname,
  normalizeLocale,
  stripLocaleFromPathname,
  withLocalePathname,
} from "@/i18n/locale";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const intlLocale = useLocale();
  const currentPathname = stripLocaleFromPathname(pathname);
  const locale = localeFromPathname(pathname) ?? normalizeLocale(intlLocale);
  const t = useTranslations("header");
  const links = [
    { href: "/blog", label: t("blog") },
    { href: "/focus", label: t("focus") },
    { href: "/typing", label: t("typing") },
    { href: "/about", label: t("about") },
  ];

  if (currentPathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white transition-colors duration-300">
        <div className="mx-auto px-4 py-4 flex items-center justify-between max-w-[750px]">
          <Link
            href={withLocalePathname("/", locale)}
            className="text-xl font-bold whitespace-nowrap"
          >
            alvaral
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="md:hidden fixed top-4 right-4 z-60 w-10 h-10 bg-white rounded-md flex items-center justify-center"
          >
            <MenuIcon isOpen={open} />
          </button>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            {links.map((link) => {
              const isActive =
                currentPathname === link.href ||
                currentPathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={withLocalePathname(link.href, locale)}
                  className={`inline-flex items-center leading-none transition-transform hover:underline ${
                    isActive ? "scale-110 font-semibold text-black" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-8 text-lg font-semibold
          transition-opacity duration-300 ease-in-out
          ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        style={{ marginTop: "3.5rem" }}
      >
        <Link
          href={withLocalePathname("/", locale)}
          onClick={() => setOpen(false)}
          className={`inline-flex items-center leading-none transition-transform hover:underline ${
            currentPathname === "/"
              ? "scale-110 font-semibold text-black"
              : ""
          }`}
        >
          {t("home")}
        </Link>
        {links.map((link) => {
          const isActive =
            currentPathname === link.href ||
            currentPathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={withLocalePathname(link.href, locale)}
              onClick={() => setOpen(false)}
              className={`inline-flex items-center leading-none transition-transform hover:underline ${
                isActive ? "scale-110 font-semibold text-black" : ""
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-6 h-6">
      <div
        className={`absolute left-0 top-0 w-6 h-[2px] bg-black transition-transform duration-300 origin-center
          ${isOpen ? "rotate-45 translate-y-2.5" : "rotate-0 translate-y-0"}
        `}
      />
      <div
        className={`absolute left-0 top-2.5 w-6 h-[2px] bg-black transition-opacity duration-300
          ${isOpen ? "opacity-0" : "opacity-100"}
        `}
      />
      <div
        className={`absolute left-0 top-5 w-6 h-[2px] bg-black transition-transform duration-300 origin-center
          ${isOpen ? "-rotate-45 -translate-y-2.5" : "rotate-0 translate-y-0"}
        `}
      />
    </div>
  );
}

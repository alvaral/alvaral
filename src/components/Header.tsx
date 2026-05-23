"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("header");

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-white text-gray-950 transition-colors duration-300 dark:bg-zinc-950 dark:text-white">
        <div className="mx-auto px-4 py-4 flex items-center justify-between max-w-[750px]">
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
            alvaral
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="fixed right-4 top-4 z-60 flex h-10 w-10 items-center justify-center rounded-md bg-white text-gray-950 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-100 md:hidden dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/20"
          >
            <MenuIcon isOpen={open} />
          </button>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link
              href="/blog"
              className={`hover:underline ${
                pathname === "/blog"
                  ? "underline decoration-2 decoration-black dark:decoration-white"
                  : ""
              }`}
            >
              {t("blog")}
            </Link>
            <Link
              href="/focus"
              className={`hover:underline ${
                pathname === "/focus"
                  ? "underline decoration-2 decoration-black dark:decoration-white"
                  : ""
              }`}
            >
              {t("focus")}
            </Link>
            <Link
              href="/about"
              className={`hover:underline ${
                pathname === "/about"
                  ? "underline decoration-2 decoration-black dark:decoration-white"
                  : ""
              }`}
            >
              {t("about")}
            </Link>
          </nav>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center space-y-8 bg-white text-lg font-semibold text-gray-950 dark:bg-zinc-950 dark:text-white
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
          href="/"
          onClick={() => setOpen(false)}
          className={`hover:underline ${
            pathname === "/"
              ? "underline decoration-2 decoration-black dark:decoration-white"
              : ""
          }`}
        >
          {t("home")}
        </Link>
        <Link
          href="/blog"
          onClick={() => setOpen(false)}
          className={`hover:underline ${
            pathname === "/blog"
              ? "underline decoration-2 decoration-black dark:decoration-white"
              : ""
          }`}
        >
          {t("blog")}
        </Link>
        <Link
          href="/focus"
          onClick={() => setOpen(false)}
          className={`hover:underline ${
            pathname === "/focus"
              ? "underline decoration-2 decoration-black dark:decoration-white"
              : ""
          }`}
        >
          {t("focus")}
        </Link>
        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className={`hover:underline ${
            pathname === "/about"
              ? "underline decoration-2 decoration-black dark:decoration-white"
              : ""
          }`}
        >
          {t("about")}
        </Link>
      </div>
    </>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-6 h-6">
      <div
        className={`absolute left-0 top-0 h-[2px] w-6 origin-center bg-current transition-transform duration-300
          ${isOpen ? "rotate-45 translate-y-2.5" : "rotate-0 translate-y-0"}
        `}
      />
      <div
        className={`absolute left-0 top-2.5 h-[2px] w-6 bg-current transition-opacity duration-300
          ${isOpen ? "opacity-0" : "opacity-100"}
        `}
      />
      <div
        className={`absolute left-0 top-5 h-[2px] w-6 origin-center bg-current transition-transform duration-300
          ${isOpen ? "-rotate-45 -translate-y-2.5" : "rotate-0 translate-y-0"}
        `}
      />
    </div>
  );
}

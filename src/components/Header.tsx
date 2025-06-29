"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("header");

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white transition-colors duration-300">
        <div className="mx-auto px-4 py-4 flex items-center justify-between max-w-[750px]">
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
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
            <Link
              href="/blog"
              className={`hover:underline ${pathname === "/blog" ? "underline decoration-2 decoration-black" : ""}`}
            >
              {t("blog")}
            </Link>
            <Link
              href="/about"
              className={`hover:underline ${pathname === "/about" ? "underline decoration-2 decoration-black" : ""}`}
            >
              {t("about")}
            </Link>
          </nav>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-8 text-lg font-semibold
          transition-opacity duration-300 ease-in-out
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ marginTop: "3.5rem" }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`hover:underline ${pathname === "/" ? "underline decoration-2 decoration-black" : ""}`}
        >
          {t("home")}
        </Link>
        <Link
          href="/blog"
          onClick={() => setOpen(false)}
          className={`hover:underline ${pathname === "/blog" ? "underline decoration-2 decoration-black" : ""}`}
        >
          {t("blog")}
        </Link>
        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className={`hover:underline ${pathname === "/about" ? "underline decoration-2 decoration-black" : ""}`}
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

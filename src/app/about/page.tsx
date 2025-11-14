"use client";
import Section from "@/components/Section";
import Image from "next/image";
import { useEffect, useState } from "react";

import esMessages from "../../../messages/es.json";
import enMessages from "../../../messages/en.json";
function getLangFromUrl() {
  if (typeof window === "undefined") return "es";
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") === "en" ? "en" : "es";
}
export default function About() {
  const [lang, setLang] = useState("es");
  useEffect(() => {
    setLang(getLangFromUrl());
  }, []);
  const t = (key: string) =>
    lang === "en"
      ? (enMessages.about as Record<string, string>)[key] || key
      : (esMessages.about as Record<string, string>)[key] || key;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Section delay={1}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-xs relative aspect-square mb-4 rounded-md overflow-hidden">
            <Image
              src="/assets/images/profile-photo.jpeg"
              alt="Foto de Álvaro Alonso"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
        </div>
      </Section>
      <Section>
        <p className="mb-4 text-lg leading-relaxed">{t("intro")}</p>
        <p className="mb-4 text-lg leading-relaxed">{t("body")}</p>
      </Section>
    </main>
  );
}

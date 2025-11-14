import { useEffect, useState } from "react";
import esMessages from "../messages/es.json";
import enMessages from "../messages/en.json";

function getLangFromUrl() {
  if (typeof window === "undefined") return "es";
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") === "en" ? "en" : "es";
}

export function useStaticTranslations(namespace: string | number) {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    setLang(getLangFromUrl());
  }, []);

  return (key: string) =>
    lang === "en"
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((enMessages as Record<string, any>)[namespace] || {})[key] || key
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((esMessages as Record<string, any>)[namespace] || {})[key] || key;
}

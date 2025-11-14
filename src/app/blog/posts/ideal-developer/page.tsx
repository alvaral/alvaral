"use client";
import { useEffect, useState } from "react";
import IdealDeveloperPostEn from "./en";
import IdealDeveloperPostEs from "./es";

function getLangFromUrl() {
  if (typeof window === "undefined") return "es";
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") === "en" ? "en" : "es";
}

export default function IdealDeveloperPage() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    setLang(getLangFromUrl());
  }, []);

  const Post = lang === "en" ? IdealDeveloperPostEn : IdealDeveloperPostEs;

  return <Post />;
}

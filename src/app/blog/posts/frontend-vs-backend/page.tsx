"use client";
import { useEffect, useState } from "react";
import PostEn from "./en";
import PostEs from "./es";

function getLangFromUrl() {
  if (typeof window === "undefined") return "es";
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") === "en" ? "en" : "es";
}

export default function FrontendVsBackendPage() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    setLang(getLangFromUrl());
  }, []);

  const Post = lang === "en" ? PostEn : PostEs;

  return <Post />;
}

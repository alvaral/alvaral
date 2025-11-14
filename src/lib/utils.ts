import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocaleFromURL() {
  if (typeof window === "undefined") return "en";
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") || "es";
}

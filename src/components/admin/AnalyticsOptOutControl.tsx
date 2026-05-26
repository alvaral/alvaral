"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ANALYTICS_OPT_OUT_KEY,
  ANALYTICS_OPT_OUT_QUERY_PARAM,
} from "@/lib/analytics";

function readOptOut() {
  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

function writeOptOut(value: boolean) {
  try {
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, value ? "true" : "false");
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
}

function currentPathWithOptOut(value: boolean) {
  const url = new URL(window.location.href);
  url.searchParams.set(ANALYTICS_OPT_OUT_QUERY_PARAM, value ? "1" : "0");
  return `${url.pathname}${url.search}`;
}

export default function AnalyticsOptOutControl() {
  const [isOptedOut, setIsOptedOut] = useState(false);

  useEffect(() => {
    setIsOptedOut(readOptOut());
  }, []);

  function updateOptOut(value: boolean) {
    writeOptOut(value);
    setIsOptedOut(value);
  }

  return (
    <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-2.5 text-sm text-gray-600 hover:bg-gray-50">
      <Checkbox
        checked={isOptedOut}
        onCheckedChange={(value) => updateOptOut(value === true)}
      />
      <span>No contarme</span>
      <a className="sr-only" href={currentPathWithOptOut(!isOptedOut)}>
        {isOptedOut ? "Desactivar opt-out" : "Activar opt-out"}
      </a>
    </label>
  );
}

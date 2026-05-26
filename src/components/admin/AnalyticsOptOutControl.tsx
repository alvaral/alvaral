"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
    <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5">
      <span className="text-sm text-gray-600">No contarme</span>
      <Switch
        aria-label="Excluir este navegador de analiticas"
        checked={isOptedOut}
        onCheckedChange={updateOptOut}
      />
      <Button asChild size="sm" variant="ghost">
        <a href={currentPathWithOptOut(!isOptedOut)}>
          {isOptedOut ? "Desactivar" : "Activar"}
        </a>
      </Button>
    </div>
  );
}

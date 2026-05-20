import { createPageMetadata } from "@/lib/metadata";
import { FocusPageClient } from "./FocusPageClient";

export const metadata = createPageMetadata({
  title: "Focus timer",
  description:
    "A small focus timer with task tracking for planning and completing focused work sessions.",
  path: "/focus",
});

export default function Focus() {
  return <FocusPageClient />;
}

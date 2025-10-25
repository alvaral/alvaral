import { cookies } from "next/headers";

export default async function IdealDeveloperPage() {
  const locale = (await cookies()).get("ALVARAL_LOCALE")?.value || "es";

  const Post =
    locale === "en"
      ? (await import("./en")).default
      : (await import("./es")).default;

  return <Post />;
}

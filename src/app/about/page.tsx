import Image from "next/image";
import { getLocale } from "next-intl/server";
import Section from "@/components/Section";
import { normalizeLocale } from "@/i18n/locale";
import { getAboutProfile } from "@/lib/about-profile";
import { createPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = normalizeLocale(await getLocale());

  return createPageMetadata({
    title: "About",
    description:
      "About Álvaro Alonso, a software engineer focused on useful and thoughtful digital experiences.",
    path: "/about",
    locale,
  });
}

export default async function About() {
  const locale = normalizeLocale(await getLocale());
  const profile = await getAboutProfile(locale);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Section delay={1}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-xs relative aspect-square mb-4 rounded-md overflow-hidden">
            <Image
              src={profile.imageUrl}
              alt={profile.imageAlt}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <h1 className="text-4xl font-bold">{profile.title}</h1>
        </div>
      </Section>
      <Section>
        <p className="mb-4 text-lg leading-relaxed">{profile.intro}</p>
        <p className="mb-4 text-lg leading-relaxed">{profile.body}</p>
      </Section>
    </main>
  );
}

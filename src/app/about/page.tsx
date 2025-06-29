import Section from "@/components/Section";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Section>
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

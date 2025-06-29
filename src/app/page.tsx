import Section from "@/components/Section";
import Gallery from "@/components/Gallery";
import { useTranslations } from "next-intl";
import BlogCard from "@/components/BlogCard";
import Divider from "@/components/Divider";

const images = [
  { src: "/assets/images/A_1.123.1.jpg" },
  { src: "/assets/images/B_1.130.1.jpg" },
  { src: "/assets/images/C_1.6.1.jpg" },
  { src: "/assets/images/D_1.3.1.jpg" },
  { src: "/assets/images/E_1.76.1.jpg" },
  { src: "/assets/images/F_1.2.1.jpg" },
  { src: "/assets/images/G_1.93.1.jpg" },
];

export default function HomePage() {
  const t = useTranslations("homepage");
  
  return (
    <main className="p-8">
      <Section
        index={0}
        sectionHeight="custom"
        customHeight={10}
        contentWidth="wide"
        horizontalAlign="center"
        verticalAlign="middle"
      >
        <h1 className="text-4xl font-bold mb-4">{t("greeting")}</h1>
        <h2>{t("intro")}</h2>
      </Section>
      <Divider />
      <Gallery images={images} />
      <Divider />
      <Section index={1} delay={images.length * 0.2}>
        <BlogCard
          title={t("latestPostTitle")}
          description={t("latestPostDescription")}
          href="/blog/posts/1"
        />
      </Section>
    </main>
  );
}

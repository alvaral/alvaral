import Section from "@/components/Section";
import Gallery from "@/components/Gallery";
import { useLocale, useTranslations } from "next-intl";
import BlogCard from "@/components/BlogCard";
import Divider from "@/components/Divider";
import { getPosts } from "@/posts/posts";

const images = [
  { src: "/assets/images/1.jpg" },
  { src: "/assets/images/4.jpeg" },
  { src: "/assets/images/3.png" },
  { src: "/assets/images/2.jpeg" },
  { src: "/assets/images/8.jpg" },
  { src: "/assets/images/5.jpeg" },
  { src: "/assets/images/6.jpeg" },
  { src: "/assets/images/7.webp" },
];

export default function HomePage() {
  const t = useTranslations("homepage");
  const locale = useLocale();
  const posts = getPosts(locale);
  const latestPost = posts[posts.length - 1];

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
        <h2 className="text-gray-700 text-lg leading-relaxed mb-3">
          {t("intro")}
        </h2>
      </Section>
      <Divider />
      <Gallery images={images} />
      <Divider />
      <Section index={1} delay={images.length * 0.2}>
        <BlogCard
          title={latestPost.title}
          description={latestPost.description}
          href={latestPost.href}
          imageSrc={latestPost.imageSrc}
        />
      </Section>
    </main>
  );
}

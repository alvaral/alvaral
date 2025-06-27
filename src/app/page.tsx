import Section from "@/components/Section";
import Gallery from "@/components/Gallery";


import BlogCard from "@/components/BlogCard";

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
  return (
    <main className="p-8 animate-fadeIn">
      <Section
        theme=""
        sectionHeight="custom"
        customHeight={10}
        contentWidth="wide"
        horizontalAlign="center"
        verticalAlign="middle"
    >
        <h1 className="text-4xl font-bold mb-4">Hola, soy Álvaro</h1>
        <h2>Hi, I’m a software engineer and a content creator posting regularly about my daily life and projects.</h2>
      </Section>
      <Gallery images={images} />
      <Section>
        <BlogCard
          title="Mi ultimo post"
          description="Este es mi último post escrito">
        </BlogCard></Section>

    </main>
  )
}

// src/app/blog/page.tsx
import Section from "@/components/Section";
import BlogCard from "@/components/BlogCard";

export default function BlogPage() {
  const posts = [
    {
      id: "primer-post",
      title: "Mi primer post",
      description: "Este es un resumen corto que explica de qué trata mi primer post.",
      date: "2025-06-20",
      imageSrc: "/assets/images/profile-photo.png",
    },
    {
      id: "segundo-post",
      title: "Otro post interesante",
      description: "Un vistazo rápido a otro tema fascinante que he escrito.",
      date: "2025-06-22",
      // Sin imagen en este
    },
    {
      id: "1",
      title: "El desarrollador de software ideal",
      description: "¿Cómo sería el programador perfecto? Técnicas, habilidades humanas y una pizca de humildad.",
      date: "2025-06-26",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 font-serif text-gray-900">
      <Section>
        <h1 className="text-5xl font-bold font-sans mb-12 leading-tight">Blog</h1>
      </Section>

      <ul className="space-y-16">
        {posts.map(({ id, title, description, date, imageSrc }) => (
          <Section key={id}>

              <BlogCard
                title={title}
                description={description}
                date={date}
                imageSrc={imageSrc}
                href={`/blog/posts/${id}`}
              />
          </Section>
        ))}
      </ul>
    </main>
  );
}

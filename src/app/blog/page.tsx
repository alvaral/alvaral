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
      imageSrc: "/path/to/image1.jpg", // Cambia por ruta real o elimina si no quieres imagen
    },
    {
      id: "segundo-post",
      title: "Otro post interesante",
      description: "Un vistazo rápido a otro tema fascinante que he escrito.",
      date: "2025-06-22",
      // Sin imagen en este
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
            <li>
              <BlogCard
                title={title}
                description={description}
                date={date}
                imageSrc={imageSrc}
                href={`/blog/posts/${id}`}
              />
            </li>
          </Section>
        ))}
      </ul>
    </main>
  );
}

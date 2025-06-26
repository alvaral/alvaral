// src/app/blog/page.tsx

import Section from "@/components/Section";
import Link from "next/link";

export default function BlogPage() {
  // Lista ficticia de posts (más adelante puedes obtener datos reales)
  const posts = [
    { id: "primer-post", title: "Mi primer post" },
    { id: "segundo-post", title: "Otro post interesante" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
        <Section>
            <h1 className="text-3xl font-bold mb-6">Blog</h1>
        </Section>
        <ul className="space-y-4">
            {posts.map((post) => (
                <Section key={post.id}>
                    <li >
                        <Link href={`/blog/posts/${post.id}`} className="text-blue-600 hover:underline">
                        {post.title}
                        </Link>
                    </li>
                </Section>
            ))}
        </ul>
    </main>
  );
}

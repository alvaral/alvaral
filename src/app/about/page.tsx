import Section from "@/components/Section";
import Image from "next/image";
import G1931 from "@/assets/images/G_1.93.1.jpg";

export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Section>
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-xs relative aspect-square mb-4 rounded-md overflow-hidden">
            <Image
              src={G1931}
              alt="Foto de Álvaro Alonso"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <h1 className="text-4xl font-bold">Sobre mí</h1>
        </div>
      </Section>
      <Section>
        <p className="mb-4 text-lg leading-relaxed">
          ¡Hola! Soy Álvaro Alonso, ingeniero software apasionado por crear experiencias digitales únicas y funcionales. Tengo experiencia en tecnologías modernas como React, Next.js, TypeScript y Tailwind CSS.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Me encanta aprender nuevas herramientas y mejorar continuamente mis habilidades para ofrecer soluciones de alta calidad. Siempre busco combinar creatividad y eficiencia en mis proyectos.
        </p>
      </Section>
      <Section>
        <h2 className="text-2xl font-semibold mb-3">Habilidades y tecnologías</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>JavaScript / TypeScript</li>
          <li>React / Next.js</li>
          <li>Tailwind CSS</li>
          <li>Node.js y Express</li>
          <li>Control de versiones con Git</li>
          <li>Metodologías ágiles (Scrum, Kanban)</li>
        </ul>
      </Section>
    </main>
  );
}

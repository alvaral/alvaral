import Section from "@/components/Section";
import Image from "next/image";

export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Section>
        <div className="flex flex-col items-center mb-6">
          <div className="w-full max-w-xs relative aspect-square mb-4 rounded-md overflow-hidden">
            <Image
              src="/assets/images/profile-photo.png"
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
          ¡Hola! Soy Álvaro Alonso, ingeniero software apasionado por crear experiencias digitales únicas y funcionales.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Me encanta aprender nuevas herramientas y mejorar continuamente mis habilidades para ofrecer soluciones de alta calidad. Siempre busco combinar creatividad y eficiencia en mis proyectos.
        </p>
      </Section>
    </main>
  );
}

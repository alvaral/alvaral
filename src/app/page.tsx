import Section from "@/components/Section";
import Gallery from "@/components/Gallery";

import A from "@/assets/images/A_1.123.1.jpg";
import B from "@/assets/images/B_1.130.1.jpg";
import C from "@/assets/images/C_1.6.1.jpg";
import D from "@/assets/images/D_1.3.1.jpg";
import E from "@/assets/images/E_1.76.1.jpg";
import F from "@/assets/images/F_1.2.1.jpg";
import G from "@/assets/images/G_1.93.1.jpg";

const images = [E, C, F, D, B, A, G];

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
      <Section><Gallery images={images} /></Section>
      <Section>Primera sección</Section>
      <Section isAlternate>Segunda con fondo gris claro</Section>
      <Section>Tercera con fondo blanco</Section>
      <Section isAlternate>Cuarta gris</Section>

    </main>
  )
}

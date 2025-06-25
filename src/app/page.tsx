import Section from "@/components/Section";


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
      <Section>Primera sección</Section>
      <Section isAlternate>Segunda con fondo gris claro</Section>
      <Section>Tercera con fondo blanco</Section>
      <Section isAlternate>Cuarta gris</Section>

    </main>
  )
}

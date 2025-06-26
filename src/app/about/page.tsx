// src/pages/about.tsx (o src/app/about/page.tsx según tu estructura)

export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Sobre mí</h1>
      <p className="mb-4 text-lg leading-relaxed">
        ¡Hola! Soy Álvaro Alonso, ingeniero software apasionado por crear experiencias digitales únicas y funcionales. Tengo experiencia en tecnologías modernas como React, Next.js, TypeScript y Tailwind CSS.
      </p>
      <p className="mb-4 text-lg leading-relaxed">
        Me encanta aprender nuevas herramientas y mejorar continuamente mis habilidades para ofrecer soluciones de alta calidad. Siempre busco combinar creatividad y eficiencia en mis proyectos.
      </p>
      <section>
        <h2 className="text-2xl font-semibold mb-3">Habilidades y tecnologías</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>JavaScript / TypeScript</li>
          <li>React / Next.js</li>
          <li>Tailwind CSS</li>
          <li>Node.js y Express</li>
          <li>Control de versiones con Git</li>
          <li>Metodologías ágiles (Scrum, Kanban)</li>
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">Contacto</h2>
        <p>Si quieres saber más o trabajar conmigo, no dudes en contactarme a través de:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Email: <a href="mailto:alvaroalonso222@gmail.com" className="text-blue-600 underline">alvaro@example.com</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/alvaro-alonso-perez" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">linkedin.com/in/alvaro-alonso</a></li>
          <li>GitHub: <a href="https://github.com/alvaral" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">github.com/alvaral</a></li>
        </ul>
      </section>
    </main>
  );
}

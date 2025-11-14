import AuthorInfo from "@/components/AuthorInfoCard";
import PostHeading from "@/components/blogPost/PostHeading";
import { PostLayout } from "@/components/blogPost/PostLayout";
import PostParagraph from "@/components/blogPost/PostParagraph";
import HighlightedParagraph from "@/components/HighlightedParagraph";
import Section from "@/components/Section";

const author = {
  name: "Álvaro Alonso",
  avatar: "/assets/images/profile-photo.webp",
  role: "Ingeniero de Software",
  infoUrl: "/about",
};

export default function FrontendVsBackendPost() {
  return (
    <PostLayout title="Frontend vs Backend: dos mitades del mismo todo">
      <Section key={1}>
        <PostParagraph>
          Si el software fuera una banda de rock, el frontend sería el
          vocalista: el que se lleva los aplausos, el que sale en las fotos, el
          que el público ve. El backend, en cambio, sería el bajista silencioso
          que sostiene todo sin que muchos se den cuenta. Sin uno, el otro no
          brilla. Sin el otro, no hay concierto.
        </PostParagraph>

        <PostParagraph>
          A veces, cuando alguien empieza en programación, escucha esos términos
          como si fueran tribus rivales: &quot;los que hacen pantallas
          bonitas&quot; vs &quot;los que construyen cosas serias&quot;. Pero en
          realidad, frontend y backend son como el yin y el yang del desarrollo
          moderno: opuestos en apariencia, complementarios en esencia.
        </PostParagraph>
      </Section>

      <Section key={2}>
        <PostHeading level={1}>El universo del frontend</PostHeading>

        <HighlightedParagraph>
          El frontend es lo que el usuario toca, ve y siente. Es la capa visible
          de las aplicaciones, donde el diseño y la lógica se encuentran para
          crear experiencias.
        </HighlightedParagraph>

        <PostParagraph>
          Aquí viven tecnologías como HTML, CSS y JavaScript, junto con
          frameworks como React, Vue o Angular. Son las herramientas que
          permiten que un botón se mueva con suavidad, que los colores cambien
          al pasar el ratón o que un texto se adapte al tamaño de tu pantalla
          sin que nada se rompa.
        </PostParagraph>

        <PostParagraph>
          Un buen desarrollador frontend tiene algo de artista y algo de
          ingeniero: combina la estética con la precisión. Entiende de paletas
          de color, tipografías, accesibilidad… pero también de performance,
          estados y eventos asíncronos. No es casualidad que muchos comparen el
          frontend con la arquitectura o el diseño gráfico: ambos buscan armonía
          entre forma y función.
        </PostParagraph>

        <PostParagraph>
          Y sí, a veces puede ser un infierno. Los navegadores no siempre se
          comportan igual, una propiedad CSS puede verse distinta en Safari y
          Chrome, y un bug puede desaparecer misteriosamente después de un{" "}
          <code>npm install</code>. Pero cuando todo encaja, es pura
          satisfacción: la interfaz cobra vida y el usuario sonríe sin saber
          cuántas líneas de código hay detrás de ese gesto natural.
        </PostParagraph>
      </Section>

      <Section key={3}>
        <PostHeading level={1}>El mundo del backend</PostHeading>

        <HighlightedParagraph>
          Si el frontend construye la fachada, el backend construye los
          cimientos. Es el conjunto de procesos invisibles que hacen que todo
          funcione: guardar usuarios, autenticar, procesar pagos, enviar correos
          o mantener los datos seguros.
        </HighlightedParagraph>

        <PostParagraph>
          Aquí el protagonismo lo tienen lenguajes como Python, Java, Go,
          Node.js o PHP. También bases de datos (SQL o NoSQL), servidores, APIs
          y lógica de negocio. El desarrollador backend piensa en rendimiento,
          seguridad, integridad de datos y arquitectura. Mientras el frontend se
          preocupa por cómo se ve, el backend se preocupa por <em>qué pasa</em>{" "}
          cuando haces clic.
        </PostParagraph>

        <PostParagraph>
          El backend tiene algo de magia: trabajas en la sombra, sin interfaces
          bonitas, pero cada línea tuya puede hacer que un millón de usuarios se
          conecten sin colapsar el sistema. Es un lugar para mentes analíticas,
          pacientes y obsesionadas con la eficiencia. Y aunque no siempre reciba
          el mismo reconocimiento visual, su impacto es profundo y silencioso,
          como una buena línea de bajo en una canción.
        </PostParagraph>
      </Section>

      <Section key={4}>
        <PostHeading level={1}>El punto medio (y de encuentro)</PostHeading>

        <PostParagraph>
          Entre ambos mundos existe un puente: las APIs. Son como un idioma en
          común, un contrato de paz. El frontend pregunta; el backend responde.
          &quot;Dame los datos del usuario.&quot; &quot;Aquí los tienes.&quot;
          &quot;Guarda esta preferencia.&quot; &quot;Hecho.&quot;
        </PostParagraph>

        <PostParagraph>
          Y ahí aparece el <strong>full stack developer</strong>, esa criatura
          híbrida que entiende ambos bandos. Sabe cómo estructurar una base de
          datos y cómo animar un menú. Tal vez no sea experto en todo, pero
          puede construir una aplicación de principio a fin, lo cual tiene su
          magia: ver todo el proceso completo, desde el clic hasta el dato
          persistido.
        </PostParagraph>
      </Section>

      <Section key={5}>
        <PostHeading level={1}>Dos caras de la misma moneda</PostHeading>

        <PostParagraph>
          La verdad es que no hay competencia entre frontend y backend. Hay
          colaboración. Un producto genial requiere de ambos: de quien hace que
          se vea bien y de quien hace que funcione bien.
        </PostParagraph>

        <PostParagraph>
          El mejor frontend del mundo se derrumba sin un backend sólido, y el
          backend más poderoso se desperdicia si nadie puede usarlo fácilmente.
          Es como una buena película: el guion importa tanto como la fotografía.
        </PostParagraph>

        <PostParagraph>
          Así que la próxima vez que alguien te diga que &quot;el frontend es
          más divertido&quot; o que &quot;el backend es más importante&quot;,
          puedes sonreír y pensar: sin los dos, la aplicación no existiría.
        </PostParagraph>

        <PostParagraph className="italic">
          Y tú, ¿de qué lado del escenario te gustaría tocar?
        </PostParagraph>
      </Section>

      <Section key={6}>
        <AuthorInfo
          name={author.name}
          role={author.role}
          avatar={author.avatar}
          infoUrl={author.infoUrl}
        />
      </Section>
    </PostLayout>
  );
}

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

export default function IdealDeveloperPost() {
  return (
    <PostLayout title="El desarrollador de software ideal">
      <Section key={1}>
        <PostParagraph>
          De forma consciente o inconsciente todos tenemos ideales: personas que
          parecen haber alcanzado la perfección en su oficio. Como Cristiano
          Ronaldo o Messi en el fútbol, Warren Buffett en las inversiones, o
          Christopher Nolan en el cine.
        </PostParagraph>

        <PostParagraph>
          Entonces, si por un momento tuviéramos que cerrar los ojos e
          imaginarnos al programador perfecto, ¿quién se te vendría a la mente?
          ¿Linus Torvalds? ¿Margaret Hamilton? ¿Mark Zuckerberg?
        </PostParagraph>

        <PostParagraph>
          Todos ellos fueron –y son– programadores brillantes. Ya sea creando
          Linux, el software del Apolo 11 que llevó al hombre a la luna, o una
          red social que cambió el mundo. Sin embargo, sería irreal pensar que
          nunca cometieron errores o que sus cualidades actuales representan un
          estándar absoluto.
        </PostParagraph>

        <PostParagraph>
          A veces me gusta imaginar a un desarrollador anónimo que lo hace todo
          bien (por alguna razón, me lo imagino con capucha, concentrado en el
          teclado). Aunque a veces también pienso en Fernando, mi compañero de
          trabajo que se sienta a mi lado, con una parsimonia envidiable,
          resolviendo problemas como quien pela una mandarina.
        </PostParagraph>

        <PostParagraph className="mb-8">
          Sea como sea, la figura del ingeniero de software ideal debería de
          tener una serie de características para poder considerarse el
          programador perfecto. Aquí intento deducir cuáles serían.
        </PostParagraph>
      </Section>
      <Section key={2}>
        <PostHeading level={1}>Habilidades técnicas</PostHeading>

        <HighlightedParagraph>
          Las habilidades técnicas (o hard skills) son las competencias
          específicas que permiten ejecutar tareas concretas relacionadas con
          una profesión.
        </HighlightedParagraph>

        <PostParagraph>
          En el caso del desarrollo de software, estas habilidades te permiten
          construir, mantener y mejorar productos tecnológicos de forma
          eficiente, segura y escalable. Ya sabes, todas esas que nos enseñan en
          la universidad.
        </PostParagraph>

        <PostParagraph>
          Podríamos escribir libros sobre esto (y los hay), pero resumiré
          algunas de las más importantes:
        </PostParagraph>

        <PostHeading level={2}>Fundamentos de programación</PostHeading>

        <PostParagraph>
          Un programador debería, como mínimo, saber programar (duh). Ya sabes,
          conocer al menos un lenguaje, los ifs, bucles, tipos de tipos,
          variables, el flujo de ejecución… Seguramente si estás leyendo esto es
          porque ya cumples con esos fundamentos. Si no, es hora de repasarlos.
        </PostParagraph>

        <PostHeading level={2}>Estructuras de datos y algoritmos</PostHeading>

        <PostParagraph>
          Wow, esto ya es un poco más jodido… pero aun así, cuando lo entiendes
          se hace muy entretenido. Para saber esto se necesitan haber dominado
          los fundamentos de programación de antes (y los puedes aprender a la
          vez).
        </PostParagraph>

        <PostParagraph>
          Las estructuras de datos, dicho de una forma simple, son formas de
          organizar la información (arrays, colas, pilas, árboles, grafos…).
        </PostParagraph>

        <PostParagraph>
          Por otra parte, los algoritmos son las recetas para resolver problemas
          usando esas estructuras: como la búsqueda binaria o el algoritmo de
          ventana deslizante.
        </PostParagraph>

        <PostParagraph>
          No es casualidad que esto se pregunte tanto en entrevistas de grandes
          empresas como Google, Meta o Amazon.
        </PostParagraph>

        <PostHeading level={2}>Control de versiones o git</PostHeading>

        <PostParagraph>
          Saber Git es casi tan esencial como saber escribir código. Es el
          &quot;Ctrl+Z&quot; del desarrollo profesional. ¿Nunca te ha pasado que
          has necesitado hacer borrón y cuenta nueva en algo? De eso trata.
        </PostParagraph>

        <PostParagraph>
          Poder versionar, revisar y colaborar sin miedo a romper todo es una de
          las habilidades que más tranquilidad mental me aporta.
        </PostParagraph>

        <PostHeading level={2}>Testing</PostHeading>

        <PostParagraph>
          No basta con que el código funcione una vez (y si no, pregúntaselo a
          los testers). Las pruebas aseguran que sigue funcionando después de
          varios cambios. Saber testear (unitariamente, de integración, e2e…) es
          tan importante como saber crear nuevo código y una muy mala práctica
          es dejarse llevar por las prisas y no hacer los tests.
        </PostParagraph>

        <PostHeading level={2}>Resolución de problemas (Debugging)</PostHeading>

        <PostParagraph className="mb-10">
          Una gran parte del trabajo de desarrollo es arreglar cosas que no
          funcionan. Sí, te llegarán bugs de código que no has escrito y no
          entiendes, pero te pagan por arreglarlo. El debugging es la
          herramienta que nos permite entender qué falló, por qué y cómo
          solucionarlo sin perder horas dando vueltas.
        </PostParagraph>
      </Section>
      <Section key={3}>
        <PostHeading level={1}>Habilidades blandas</PostHeading>

        <HighlightedParagraph>
          Las habilidades blandas (o soft skills) son las capacidades personales
          e interpersonales que hacen la comunicación, colaboración y adaptación
          en distintos entornos laborales y sociales.
        </HighlightedParagraph>

        <PostParagraph>
          Es lo que podría definirse como aquello que nos hace humanos. O como
          yo digo, no ser &quot;un capullo&quot;. Por ejemplo, se podría decir
          que Sheldon Cooper no tiene muchas habilidades blandas (aunque sea un
          genio, no se lleva bien con los demás y eso le limita laboralmente).
          Puedes ser el mejor programador del mundo, pero si no sabes
          comunicarte, colaborar o adaptarte, tu impacto será limitado.
        </PostParagraph>

        <PostHeading level={2}>Comunicación</PostHeading>

        <PostParagraph>
          Saber explicar una idea técnica a alguien no técnico (o técnico de
          otra área) es un superpoder. ¿O acaso te crees que tu manager o el
          cliente van a saber al dedillo la tecnología por la que te pagan? La
          buena comunicación facilita el trabajo, reduce malentendidos y mejora
          los resultados.
        </PostParagraph>

        <PostHeading level={2}>Trabajo en equipo</PostHeading>

        <PostParagraph>
          Dos mentes piensan mejor que una, pero solo si no se pisan entre sí.
          Saber colaborar, escuchar, dar y recibir feedback es lo que convierte
          a un buen programador en un gran compañero.
        </PostParagraph>

        <PostHeading level={2}>Salud mental y física</PostHeading>

        <PostParagraph>
          De esto no se habla lo suficiente. Dormir bien, comer mejor y
          desconectar a tiempo son claves para pensar con claridad y tener una
          estabilidad. No somos máquinas, por mucho que vivamos entre ellas y el
          burnout siempre acecha.
        </PostParagraph>

        <PostHeading level={2}>
          Principios de diseño y buenos hábitos
        </PostHeading>

        <PostParagraph>
          Escribir código que otros puedan entender y mantener es un arte.
          Seguir principios como SOLID, patrones de diseño o mantener una
          arquitectura limpia puede marcar la diferencia entre una solución
          elegante y un infierno de deuda técnica.
        </PostParagraph>

        <PostHeading level={2}>Inconstancia (sí, leíste bien)</PostHeading>

        <PostParagraph>
          Aceptar que no siempre vamos a estar al 100%, y que habrá días malos,
          también es una habilidad. Lo importante es no rendirse.
        </PostParagraph>

        <PostParagraph>
          Esa es, de hecho, la diferencia entre un aficionado y un profesional.
          El aficionado hace algo por pasión, cuando le apetece; cuando no le
          apetece, simplemente no lo hace. El profesional, en cambio, lo hace
          incluso cuando no tiene ganas. ¿O acaso querrías que el médico que te
          va a operar solo haga bien su trabajo los días que está de buen humor?
        </PostParagraph>

        <PostParagraph>
          La constancia absoluta es una ilusión. Lo real, lo admirable, es
          seguir adelante incluso cuando fallamos o no estamos en nuestro mejor
          momento.
        </PostParagraph>

        <PostHeading level={2}>Creatividad y reflexión</PostHeading>

        <PostParagraph>
          Innovar, encontrar soluciones nuevas, mirar atrás para entender qué
          funcionó (y qué no) es lo que impulsa la mejora continua. Un buen
          desarrollador no solo escribe código, también piensa en cómo hacerlo
          mejor.
        </PostParagraph>
      </Section>
      <Section key={4}>
        <PostHeading level={2}>¿Existe el programador perfecto?</PostHeading>

        <PostParagraph>
          Probablemente no. Pero como todo en la vida, podemos aspirar a ser la
          mejor versión posible de nosotros mismos, combinando habilidades
          técnicas, humanas y, sobre todo, humildad para seguir aprendiendo.
        </PostParagraph>

        <PostParagraph className="italic">
          Y tú, ¿cómo imaginas al desarrollador ideal?
        </PostParagraph>
      </Section>
      <Section key={5}>
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

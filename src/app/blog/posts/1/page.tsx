import Section from "@/components/Section";

export default function IdealDeveloperPost() {
  return (
    <main className="px-4 md:px-6 lg:px-0 py-12 font-serif text-[#1A1A1A] bg-white">
      <Section>
        <article className="max-w-[680px] mx-auto text-[1.05rem] leading-7">
            <h1 className="text-[2.2rem] leading-tight font-bold font-sans mb-6">El desarrollador de software ideal</h1>

            <p className="mb-4">
                De forma consciente o inconsciente todos tenemos ideales: personas que parecen haber alcanzado la perfección en su oficio. Como Cristiano Ronaldo o Messi en el fútbol, Warren Buffett en las inversiones, o Christopher Nolan en el cine.
            </p>
            <p className="mb-4">
                Entonces, si por un momento tuviéramos que cerrar los ojos e imaginarnos al programador perfecto, ¿quién se te vendría a la mente? ¿Linus Torvalds? ¿Margaret Hamilton? ¿Mark Zuckerberg?
            </p>
            <p className="mb-4">
                Todos ellos fueron – y son – programadores brillantes. Ya sea creando Linux, el software del Apolo 11 que llevó al hombre a la luna, o una red social que cambió el mundo. Sin embargo, sería irreal pensar que nunca cometieron errores o que sus cualidades actuales representan un estándar absoluto.
            </p>
            <p className="mb-4">
                A veces me gusta imaginar a un desarrollador anónimo que lo hace todo bien (por alguna razón, me lo imagino con capucha, concentrado en el teclado). Aunque a veces también pienso en Fernando, mi compañero de trabajo que se sienta a mi lado, con una parsimonia envidiable, resolviendo problemas como quien pela una mandarina.
            </p>
            <p className="mb-8">
                Sea como sea, la figura del ingeniero de software ideal debería de tener una serie de características para poder considerarse el programador perfecto. Aquí intento deducir cuáles serían.
            </p>

            <h1 className="text-[1.6rem] font-bold mb-4 font-sans">Habilidades técnicas</h1>

            <p className="mb-4">
            Las habilidades técnicas (o hard skills) son las competencias específicas que permiten ejecutar tareas concretas relacionadas con una profesión.
            </p>
            <p className="mb-4">
            En el caso del desarrollo de software, estas habilidades te permiten construir, mantener y mejorar productos tecnológicos de forma eficiente, segura y escalable. Ya sabes, todas esas que nos enseñan en la universidad.
            </p>
            <p className="mb-4">
            Podríamos escribir libros sobre esto (y los hay), pero resumiré algunas de las más importantes:
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Fundamentos de programación</h2>
            <p className="mb-4">
            Un programador debería, como mínimo, saber programar (duh). Ya sabes, conocer al menos un lenguaje, los ifs, bucles, tipos de tipos, variables, el flujo de ejecución… Seguramente si estás leyendo esto es porque ya cumples con esos fundamentos. Si no, es hora de repasarlos.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Estructuras de datos y algoritmos</h2>
            <p className="mb-4">
            Wow, esto ya es un poco más jodido… pero aun así, cuando lo entiendes se hace muy entretenido. Para saber esto se necesitan haber dominado los fundamentos de programación de antes (y los puedes aprender a la vez).
            </p>
            <p className="mb-4">
            Las estructuras de datos, dicho de una forma simple, son formas de organizar la información (arrays, colas, pilas, árboles, grafos…).
            </p>
            <p className="mb-4">
            Por otra parte, los algoritmos son las recetas para resolver problemas usando esas estructuras: como la búsqueda binaria o el algoritmo de ventana deslizante.
            </p>
            <p className="mb-4">
            No es casualidad que esto se pregunte tanto en entrevistas de grandes empresas como Google, Meta o Amazon.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Control de versiones o git</h2>
            <p className="mb-4">
            Saber Git es casi tan esencial como saber escribir código. Es el "Ctrl+Z" del desarrollo profesional. ¿Nunca te ha pasado que has necesitado hacer borrón y cuenta nueva en algo? De eso trata.
            </p>
            <p className="mb-4">
            Poder versionar, revisar y colaborar sin miedo a romper todo es una de las habilidades que más tranquilidad mental me aporta.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Testing</h2>
            <p className="mb-4">
            No basta con que el código funcione una vez (y si no, pregúntaselo a los testers). Las pruebas aseguran que sigue funcionando después de varios cambios. Saber testear (unitariamente, de integración, e2e…) es tan importante como saber crear nuevo código y una muy mala práctica es dejarse llevar por las prisas y no hacer los tests.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Resolución de problemas (Debugging)</h2>
            <p className="mb-10">
            Una gran parte del trabajo de desarrollo es arreglar cosas que no funcionan. Sí, te llegarán bugs de código que no has escrito y no entiendes, pero te pagan por arreglarlo. El debugging es la herramienta que nos permite entender qué falló, por qué y cómo solucionarlo sin perder horas dando vueltas.
            </p>

            <h1 className="text-[1.6rem] font-bold mb-4 font-sans">Habilidades blandas</h1>

            <p className="mb-4">
            Las habilidades blandas (o soft skills) son las capacidades personales e interpersonales que hacen la comunicación, colaboración y adaptación en distintos entornos laborales y sociales.
            </p>
            <p className="mb-4">
            Es lo que podría definirse como aquello que nos hace humanos. O como yo digo, no ser "un capullo". Por ejemplo, se podría decir que Sheldon Cooper no tiene muchas habilidades blandas (aunque sea un genio, no se lleva bien con los demás y eso le limita laboralmente). Puedes ser el mejor programador del mundo, pero si no sabes comunicarte, colaborar o adaptarte, tu impacto será limitado.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Comunicación</h2>
            <p className="mb-4">
            Saber explicar una idea técnica a alguien no técnico (o técnico de otra área) es un superpoder. ¿O acaso te crees que tu manager o el cliente van a saber al dedillo la tecnología por la que te pagan? La buena comunicación facilita el trabajo, reduce malentendidos y mejora los resultados.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Trabajo en equipo</h2>
            <p className="mb-4">
            Dos mentes piensan mejor que una, pero solo si no se pisan entre sí. Saber colaborar, escuchar, dar y recibir feedback es lo que convierte a un buen programador en un gran compañero.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Salud mental y física</h2>
            <p className="mb-4">
            De esto no se habla lo suficiente. Dormir bien, comer mejor y desconectar a tiempo son claves para pensar con claridad y tener una estabilidad. No somos máquinas, por mucho que vivamos entre ellas y el burnout siempre acecha.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Principios de diseño y buenos hábitos</h2>
            <p className="mb-4">
            Escribir código que otros puedan entender y mantener es un arte. Seguir principios como SOLID, patrones de diseño o mantener una arquitectura limpia puede marcar la diferencia entre una solución elegante y un infierno de deuda técnica.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Inconstancia (sí, leíste bien)</h2>
            <p className="mb-4">
            Aceptar que no siempre vamos a estar al 100%, y que habrá días malos, también es una habilidad. Lo importante es no rendirse.
            </p>
            <p className="mb-4">
            Esa es, de hecho, la diferencia entre un aficionado y un profesional. El aficionado hace algo por pasión, cuando le apetece; cuando no le apetece, simplemente no lo hace. El profesional, en cambio, lo hace incluso cuando no tiene ganas. ¿O acaso querrías que el médico que te va a operar solo haga bien su trabajo los días que está de buen humor?
            </p>
            <p className="mb-4">
            La constancia absoluta es una ilusión. Lo real, lo admirable, es seguir adelante incluso cuando fallamos o no estamos en nuestro mejor momento.
            </p>

            <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">Creatividad y reflexión</h2>
            <p className="mb-4">
            Innovar, encontrar soluciones nuevas, mirar atrás para entender qué funcionó (y qué no) es lo que impulsa la mejora continua. Un buen desarrollador no solo escribe código, también piensa en cómo hacerlo mejor.
            </p>
          <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">¿Existe el programador perfecto?</h2>
          <p className="mb-4">
            Probablemente no. Pero como todo en la vida, podemos aspirar a ser la mejor versión posible de nosotros mismos, combinando habilidades técnicas, humanas y, sobre todo, humildad para seguir aprendiendo.
          </p>
          <p className="italic">
            Y tú, ¿cómo imaginas al desarrollador ideal?
          </p>
        </article>
      </Section>
    </main>
  );
}

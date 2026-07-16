import type { AppLocale } from "@/i18n/locale";

export const seoContent: Record<
  AppLocale,
  {
    home: {
      description: string;
    };
    blog: {
      title: string;
      description: string;
    };
    about: {
      title: string;
      description: string;
    };
    focus: {
      title: string;
      description: string;
    };
    typing: {
      title: string;
      description: string;
    };
  }
> = {
  en: {
    home: {
      description:
        "Technical blog and personal site by Alvaro Alonso, focused on software engineering, programming, and thoughtful digital products.",
    },
    blog: {
      title: "Blog",
      description:
        "Articles about software engineering, programming, frontend, backend, and developer life.",
    },
    about: {
      title: "About",
      description:
        "About Alvaro Alonso, a software engineer focused on useful and thoughtful digital experiences.",
    },
    focus: {
      title: "Focus timer",
      description:
        "A small focus timer with task tracking for planning and completing focused work sessions.",
    },
    typing: {
      title: "Typing trainer",
      description:
        "Paste your own text or code and practice retyping it with live stats, a timer, and forced correction mode.",
    },
  },
  es: {
    home: {
      description:
        "Blog tecnico y web personal de Alvaro Alonso sobre ingenieria de software, programacion y productos digitales bien pensados.",
    },
    blog: {
      title: "Blog",
      description:
        "Articulos sobre ingenieria de software, programacion, frontend, backend y vida como desarrollador.",
    },
    about: {
      title: "Sobre mi",
      description:
        "Sobre Alvaro Alonso, ingeniero de software centrado en crear experiencias digitales utiles y cuidadas.",
    },
    focus: {
      title: "Temporizador de enfoque",
      description:
        "Un pequeno temporizador de enfoque con tareas para planificar y completar sesiones de trabajo concentrado.",
    },
    typing: {
      title: "Entrenador de escritura",
      description:
        "Pega tu propio texto o codigo y practica reescribiendolo con estadisticas en vivo, contador y modo de correccion forzada.",
    },
  },
};

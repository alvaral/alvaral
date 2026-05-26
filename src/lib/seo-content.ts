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
  }
> = {
  en: {
    home: {
      description:
        "Technical blog and personal site by Álvaro Alonso, focused on software engineering, programming, and thoughtful digital products.",
    },
    blog: {
      title: "Blog",
      description:
        "Articles about software engineering, programming, frontend, backend, and developer life.",
    },
    about: {
      title: "About",
      description:
        "About Álvaro Alonso, a software engineer focused on useful and thoughtful digital experiences.",
    },
    focus: {
      title: "Focus timer",
      description:
        "A small focus timer with task tracking for planning and completing focused work sessions.",
    },
  },
  es: {
    home: {
      description:
        "Blog técnico y web personal de Álvaro Alonso sobre ingeniería de software, programación y productos digitales bien pensados.",
    },
    blog: {
      title: "Blog",
      description:
        "Artículos sobre ingeniería de software, programación, frontend, backend y vida como desarrollador.",
    },
    about: {
      title: "Sobre mí",
      description:
        "Sobre Álvaro Alonso, ingeniero de software centrado en crear experiencias digitales útiles y cuidadas.",
    },
    focus: {
      title: "Temporizador de enfoque",
      description:
        "Un pequeño temporizador de enfoque con tareas para planificar y completar sesiones de trabajo concentrado.",
    },
  },
};

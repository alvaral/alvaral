import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from "@/i18n/locale";

export type BlogPostMeta = {
  id: string;
  date: string;
  href: string;
  imageSrc?: string;
  translations: Record<
    AppLocale,
    {
      title: string;
      description: string;
    }
  >;
};

export type BlogPost = BlogPostMeta & {
  title: string;
  description: string;
};

const posts: BlogPostMeta[] = [
  {
    id: "ideal-developer",
    date: "2025-06-26",
    href: "/blog/posts/ideal-developer",
    translations: {
      es: {
        title: "El desarrollador de software ideal",
        description:
          "¿Cómo sería el programador perfecto? Técnicas, habilidades humanas y una pizca de humildad.",
      },
      en: {
        title: "The Ideal Software Developer",
        description:
          "What makes the perfect developer? Technical skills, soft skills, and a touch of humility.",
      },
    },
  },
  {
    id: "frontend-vs-backend",
    date: "2025-10-25",
    href: "/blog/posts/frontend-vs-backend",
    translations: {
      es: {
        title: "Frontend vs Backend: dos mitades del mismo todo",
        description:
          "La interfaz que ves y la lógica que no. Dos mundos, un objetivo: crear productos que funcionen.",
      },
      en: {
        title: "Frontend vs Backend: Two Halves of the Same Whole",
        description:
          "The interface you see and the logic you don't. Two worlds, one goal: building products that work.",
      },
    },
  },
];

function comparePostsByDateDesc(a: BlogPostMeta, b: BlogPostMeta) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function resolveLocale(locale: string): AppLocale {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getPostById(id: string, locale: string): BlogPost | undefined {
  const post = posts.find((candidate) => candidate.id === id);
  if (!post) return undefined;

  return {
    ...post,
    ...post.translations[resolveLocale(locale)],
  };
}

export function getPosts(locale: string): BlogPost[] {
  return [...posts]
    .sort(comparePostsByDateDesc)
    .map((post) => getPostById(post.id, locale))
    .filter((post): post is BlogPost => post != null);
}

export function getLatestPost(locale: string): BlogPost {
  return getPosts(locale)[0];
}

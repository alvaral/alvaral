export type BlogPostMeta = {
  id: string;
  date: string;
  href: string;
  imageSrc?: string;
  translations: {
    [locale: string]: {
      title: string;
      description: string;
    };
  };
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
  // Aquí puedes añadir más posts con su traducción
];

export const getPosts = (locale: string) => {
  return posts.map((post) => ({
    ...post,
    ...post.translations[locale],
  }));
};

# **alvaral** — Personal Blog & Portfolio

Welcome to **alvaral**, a minimalist and performant personal blog & portfolio built with [Next.js](https://nextjs.org).
Created and maintained by **Álvaro Alonso**, this project showcases technical writing, ideas, and creative projects.

---

## 🌍 Live Site

**🔗 [www.alvaral.com](https://www.alvaral.com)** (coming soon)

Deployed on **AWS** (Amplify) with CI/CD powered by **GitHub Actions**.

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

Edit the main page via:

```
app/page.tsx
```

---

## ✨ Features

- ⚡️ Built with **Next.js App Router**
- 🎨 Styled using **Tailwind CSS**
- 🌍 **i18n support** (default: English, optional: `/es/` for Spanish)
- 🖋 Custom blog posts with Markdown or structured JSON
- 🧠 Optimized fonts using [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- ☁️ CI/CD on AWS using **GitHub Actions**

---

## 🧪 Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: Tailwind CSS
- **Hosting**: AWS (S3 + CloudFront)
- **CI/CD**: GitHub Actions
- **Fonts**: [Geist](https://vercel.com/font)
- **Icons**: [Lucide](https://lucide.dev)

---

## 📝 Cómo añadir un nuevo post

Para mantener tu blog organizado, traducido y fácil de ampliar, sigue estos pasos para crear un nuevo post:

### 1. Crear la página del post

Crea la carpeta y el archivo `page.tsx` para el nuevo post en la ruta:

```
app/blog/posts/mi-nuevo-post/page.tsx
```

Ejemplo básico del archivo `page.tsx`:

```tsx
export default function MiNuevoPost() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12 font-serif text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Título de mi nuevo post</h1>
      <p>Aquí va el contenido del post...</p>
    </article>
  );
}
```

Si quieres añadir soporte multilingüe puedes crear también:

```
app/blog/posts/mi-nuevo-post/page.en.tsx
```

con la versión en inglés.

---

### 2. Añadir metadatos y traducciones en `lib/posts.ts`

Edita el archivo `lib/posts.ts` donde tienes el listado de posts y sus traducciones.

Agrega la referencia al post:

```ts
const basePosts = [
  // posts existentes ...
  {
    id: "mi-nuevo-post",
    date: "2025-07-01",
    href: "/blog/posts/mi-nuevo-post",
  },
];
```

Y añade las traducciones para título y descripción:

```ts
const translations = {
  es: {
    // posts existentes ...
    "mi-nuevo-post": {
      title: "Título de mi nuevo post en Español",
      description: "Breve descripción de mi nuevo post en Español",
    },
  },
  en: {
    // posts existentes ...
    "mi-nuevo-post": {
      title: "My New Post Title in English",
      description: "Brief description of my new post in English",
    },
  },
};
```

---

### 3. Usar el post automáticamente en la lista y en la página principal

Gracias a la función `getPosts(locale)` que centraliza los posts, el nuevo post aparecerá automáticamente:

- En la lista de posts de `/blog`
- En la sección de último post en la página principal (si usas esa lógica)

---

### 4. (Opcional) Añadir traducciones para otros textos relacionados

Si usas textos específicos para el nuevo post en archivos JSON de `next-intl`, agrégalos en los archivos correspondientes (`es.json`, `en.json`, etc.).

---

### Resumen rápido

- Crear el archivo `page.tsx` con el contenido
- Añadir la entrada en `basePosts` con `id`, `date` y `href`
- Añadir las traducciones del título y descripción
- ¡El post aparecerá automáticamente en la web!

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)

---

Built with 💻 by **Álvaro Alonso**.

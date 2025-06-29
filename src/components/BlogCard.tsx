import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  description: string;
  date?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
}

export default function BlogCard({
  title,
  description,
  date,
  imageSrc,
  imageAlt = "Imagen del post",
  href,
}: BlogCardProps) {
  function formatDate(dateStr: string) {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const content = (
    <article tabIndex={0} className="group flex space-x-6 cursor-pointer">
      {imageSrc && (
        <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: "cover" }}
            priority={false}
            sizes="96px"
          />
        </div>
      )}
      <div className="flex flex-col flex-1">
        <h2 className="text-2xl font-semibold leading-snug mb-2 font-sans">{title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-3">{description}</p>
        <div className="flex items-center justify-between text-gray-500 text-sm select-none">
          {date && <time dateTime={date}>Publicado el {formatDate(date)}</time>}
          <span className="text-gray-500 hover:text-gray-700 font-medium no-underline rounded">
            Ver más →
          </span>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`Leer post completo: ${title}`} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

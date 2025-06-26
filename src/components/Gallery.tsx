"use client";
import Image from "next/image";
import Section from "./Section";
import { useEffect, useState } from "react";

interface GalleryProps {
  images: {
    src: string;
    alt?: string;
  }[];
}

export default function Gallery({ images }: GalleryProps) {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth >= 740);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isOdd = images.length % 2 !== 0;

  const rows: { src: string; alt?: string }[][] = [];
  let i = 0;

  while (i < images.length) {
    if (isWide && isOdd && i === images.length - 3) {
      rows.push(images.slice(i, i + 3));  
      i += 3;
    } else {
      rows.push(images.slice(i, i + 2));
      i += 2;
    }
  }

  return (
    <div className="w-full min-h-[100px]">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-5 ${
            row.length === 3
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {row.map((img, index) => (
            <Section key={`${rowIndex}-${index}`}>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={img.src}
                  alt={img.alt || `Image ${rowIndex}-${index}`}
                  width={363}
                  height={204}
                  className="w-full h-auto object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={rowIndex === 0 && index < 3}
                />
              </div>
            </Section>
          ))}
        </div>
      ))}
    </div>
  );
}

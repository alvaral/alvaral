import React from "react";

export function CupTimer({}: { progress: number; mode: "work" | "break" }) {
  return (
    <div className="relative w-[100px] h-[120px] flex flex-col items-center">
      <svg
        width="1000"
        height="1000"
        viewBox="0 0 24 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* <!-- Perímetro de la taza --> */}
        <polyline
          points="3,5 2,8 3,11 4,12 5,13 8,13 11,13 12,12 13,11 14,8 13,5 3,5"
          fill="none"
          stroke="black"
          stroke-width="1.2"
          stroke-linejoin="miter"
        />
        {/* <!-- Borde superior --> */}
        <polyline
          points="3,5 13,5"
          fill="none"
          stroke="black"
          stroke-width="1.2"
          stroke-linejoin="miter"
        />
        {/* <!-- Asa pixelada --> */}
        <polyline
          points="14,7 16,7 16,9 14,9"
          fill="none"
          stroke="black"
          stroke-width="1.2"
          stroke-linejoin="miter"
        />
      </svg>

      {/* Humo SVG animado */}
      <svg
        width="80px"
        height="73px"
        viewBox="0 0 31 73"
        className="absolute left-2 -top-10 pointer-events-none"
      >
        {/* ...smoke animation aquí... */}
      </svg>

      {/* Taza, café y asa 'C' TODO dentro de SVG */}
    </div>
  );
}

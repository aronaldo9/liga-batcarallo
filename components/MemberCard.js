"use client";

import Image from "next/image";
import { useState } from "react";

export default function MemberCard({ miembro, index }) {
  const [imgSrc, setImgSrc] = useState(miembro.imagen);

  return (
    <div
      className="bg-gotham-card border-4 border-batman-yellow overflow-hidden hover:scale-105 transition-transform duration-200"
      style={{
        boxShadow: "6px 6px 0 #000",
        transform: `rotate(${index % 2 === 0 ? "-0.6" : "0.6"}deg)`,
      }}
    >
      {/* Character image */}
      <div className="relative h-48 bg-black">
        <Image
          src={imgSrc}
          alt={miembro.nombre}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImgSrc("/skyline.png")}
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-gotham-card via-transparent to-transparent" />

        {/* Titles badge */}
        {miembro.titulos > 0 && (
          <span className="absolute top-2 right-2 bg-batman-yellow text-black text-xs font-black px-2 py-1 uppercase tracking-wider">
            🏆 ×{miembro.titulos}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-bangers)] text-xl text-gotham-text tracking-wider leading-tight">
          {miembro.nombre}
        </h3>
        {miembro.apodo && (
          <p className="text-gotham-muted text-xs italic mt-0.5">"{miembro.apodo}"</p>
        )}
        <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mt-1 mb-3 truncate">
          {miembro.equipo}
        </p>
        <div className="border-t-2 border-gotham-border pt-2 text-gotham-muted text-xs uppercase tracking-widest">
          {miembro.temporadas} temporadas
        </div>
      </div>
    </div>
  );
}

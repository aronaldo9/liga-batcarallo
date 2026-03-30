"use client";

import Image from "next/image";
import { useState } from "react";

function posicionColor(posicion) {
  if (posicion === "Campeón/a") return "text-batman-yellow font-bold";
  if (posicion.startsWith("2º")) return "text-gotham-text font-semibold";
  if (posicion.startsWith("3er")) return "text-gotham-muted font-semibold";
  if (posicion === "Último clasificado") return "text-red-400";
  return "text-gotham-muted";
}

function CardBack({ miembro, logros }) {
  return (
    <div className="absolute inset-0 bg-gotham-card border-4 border-batman-yellow overflow-hidden flex flex-col"
      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "6px 6px 0 #000" }}
    >
      <div className="px-3 pt-3 pb-1 border-b-2 border-gotham-border shrink-0">
        <p className="text-batman-yellow text-xs font-black uppercase tracking-widest">Palmarés</p>
        <p className="text-gotham-muted text-xs truncate">{miembro.equipo}</p>
      </div>

      <div className="overflow-y-auto flex-1 px-3 py-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {logros.length === 0 ? (
          <p className="text-gotham-muted text-xs italic mt-2">Sin logros registrados</p>
        ) : (
          <ul className="space-y-1.5">
            {logros.map((logro, i) => (
              <li key={i} className="text-xs leading-tight">
                <span className={posicionColor(logro.posicion)}>{logro.posicion}</span>
                <span className="text-gotham-muted"> · {logro.competicion}</span>
                {logro.temporada && (
                  <span className="text-gotham-muted opacity-60"> {logro.temporada}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-gotham-muted text-xs text-center pb-2 opacity-40 shrink-0">toca para volver</p>
    </div>
  );
}

export default function MemberCard({ miembro, logros = [], index, priority = false, flippable = true }) {
  const [flipped, setFlipped] = useState(false);
  const [imgSrc, setImgSrc] = useState(miembro.imagen);

  return (
    <div
      className={flippable ? "cursor-pointer" : ""}
      style={{
        perspective: "1000px",
        transform: `rotate(${index % 2 === 0 ? "-0.6" : "0.6"}deg)`,
      }}
      onClick={() => flippable && setFlipped(!flipped)}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative",
          height: "330px",
        }}
      >
        {/* Frente */}
        <div
          className="bg-gotham-card border-4 border-batman-yellow overflow-hidden absolute inset-0"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", boxShadow: "6px 6px 0 #000" }}
        >
          <div className="relative h-48 bg-black">
            <Image
              src={imgSrc}
              alt={miembro.nombre}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              onError={() => setImgSrc("/skyline.png")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gotham-card via-transparent to-transparent" />
            {miembro.titulos > 0 && (
              <span className="absolute top-2 right-2 bg-batman-yellow text-black text-xs font-black px-2 py-1 uppercase tracking-wider">
                🏆 ×{miembro.titulos}
              </span>
            )}
          </div>

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

        {/* Dorso */}
        {flippable && <CardBack miembro={miembro} logros={logros} />}
      </div>
    </div>
  );
}

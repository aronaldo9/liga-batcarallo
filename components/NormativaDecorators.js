import Image from "next/image";

/**
 * Paneles fotográficos decorativos para la página de Normativa.
 * Estilo cómic: borde amarillo, overlay oscuro, caption en Bangers.
 *
 * Para cambiar una foto, sustituye el ID de Unsplash en la URL correspondiente.
 * Formato: https://images.unsplash.com/photo-{ID}?w=1200&auto=format&fit=crop&q=80
 */

function ImagePanel({ src, alt, caption, rotate = "0.4deg" }) {
  return (
    <div
      className="relative overflow-hidden border-4 border-batman-yellow my-14 h-44 sm:h-64"
      style={{
        boxShadow: "6px 6px 0 #000",
        transform: `rotate(${rotate})`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 896px"
      />
      {/* Overlay oscuro para mantener el tono Gotham */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
      {/* Caption */}
      {caption && (
        <p
          className="absolute bottom-4 left-5 right-5 font-[family-name:var(--font-bangers)] text-batman-yellow text-2xl sm:text-3xl tracking-widest uppercase"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

// Panel 1 — tras "Plantilla y Alineación"
// Ciudad oscura de noche (estilo Gotham)
export function BatSignalDivider() {
  return (
    <ImagePanel
      src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&auto=format&fit=crop&q=80"
      alt="Skyline de una ciudad oscura de noche con luces urbanas"
      caption="Las noches de Gotham no perdonan"
      rotate="-0.4deg"
    />
  );
}

// Panel 2 — tras "Capitán y Ariete"
// Balón de fútbol dramático
export function ComicBoom() {
  return (
    <ImagePanel
      src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80"
      alt="Balón de fútbol sobre el césped"
      caption="Cada jugada define tu destino"
      rotate="0.5deg"
    />
  );
}

// Panel 3 — tras "Sanciones y Conducta"
// Estadio de fútbol nocturno
export function GothamSkyline() {
  return (
    <ImagePanel
      src="https://images.unsplash.com/photo-1540747913346-19212a4dcd0b?w=1200&auto=format&fit=crop&q=80"
      alt="Estadio de fútbol visto desde arriba con las gradas llenas"
      caption="El campo de batalla te espera"
      rotate="-0.3deg"
    />
  );
}

// Panel 4 — tras "Compensaciones Económicas"
// Trofeo o imagen de victorias
export function TrophyPanel() {
  return (
    <ImagePanel
      src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop&q=80"
      alt="Trofeo de campeón bajo los focos"
      caption="Solo queda un campeón"
      rotate="0.4deg"
    />
  );
}

import { normativa } from "@/data/normativa";
import {
  BatSignalDivider,
  ComicBoom,
  GothamSkyline,
  TrophyPanel,
} from "@/components/NormativaDecorators";

export const metadata = { title: "Normativa · Liga Batcarallo" };

// Decorative element rendered AFTER the section at each index (0-based)
const decoratorAfter = {
  1: <BatSignalDivider />,
  2: <ComicBoom />,
  4: <GothamSkyline />,
  5: <TrophyPanel />,
};

function SectionCard({ seccion, index }) {
  const isWarning = seccion.tipo === "warning";
  const isPrize = seccion.tipo === "prize";

  const borderClass = isWarning ? "border-red-700" : "border-batman-yellow";
  const shadowStyle = isWarning
    ? { boxShadow: "6px 6px 0 #7f1d1d" }
    : { boxShadow: "6px 6px 0 #000" };
  const headerBgClass = isWarning ? "bg-red-950" : "bg-batman-yellow";
  const headerTextClass = isWarning ? "text-red-400" : "text-black";
  const bulletClass = isWarning ? "text-red-400" : "text-batman-yellow";

  return (
    <article
      aria-labelledby={`section-${seccion.id}`}
      className={`bg-gotham-card border-4 ${borderClass} overflow-hidden`}
      style={{
        ...shadowStyle,
        transform: `rotate(${index % 2 === 0 ? "0.3" : "-0.3"}deg)`,
      }}
    >
      {/* Section header */}
      <div className={`${headerBgClass} px-6 py-3 flex items-center gap-3`}>
        <span
          className={`font-[family-name:var(--font-bangers)] ${headerTextClass} text-2xl tracking-widest`}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2
          id={`section-${seccion.id}`}
          className={`font-[family-name:var(--font-bangers)] ${headerTextClass} text-xl tracking-widest uppercase`}
        >
          {seccion.titulo}
        </h2>
        {isPrize && (
          <span
            className="ml-auto font-[family-name:var(--font-bangers)] text-black text-sm tracking-widest uppercase opacity-60"
            aria-hidden="true"
          >
            Premios
          </span>
        )}
      </div>

      {/* Rules list */}
      <ul className="px-6 py-5 flex flex-col gap-3">
        {seccion.reglas.map((regla, j) => (
          <li key={j} className="flex gap-4 text-sm text-gotham-text leading-relaxed">
            <span className={`${bulletClass} font-black shrink-0 mt-0.5`} aria-hidden="true">
              ›
            </span>
            {regla}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function NormativaPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-12 relative">
        <div className="halftone absolute inset-0 opacity-20 -mx-4" aria-hidden="true" />
        <div className="relative py-8 px-2">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
            Aquí manda Batman
          </p>
          <h1
            className="font-[family-name:var(--font-bangers)] text-7xl text-batman-yellow tracking-widest"
            style={{ textShadow: "4px 4px 0 #000" }}
          >
            Normativa
          </h1>
          <p className="text-gotham-muted text-sm mt-2 uppercase tracking-widest">
            Temporada 2025–2026
          </p>
        </div>
        <div className="border-b-4 border-batman-yellow" />
      </div>

      {/* Warning intro panel */}
      <div
        className="bg-batman-yellow border-4 border-black p-5 mb-10 rotate-[-0.5deg]"
        style={{ boxShadow: "6px 6px 0 #000" }}
        role="note"
      >
        <p className="text-black font-black text-sm uppercase tracking-wider">
          ⚠️ Estas reglas son de obligado cumplimiento. La ignorancia no es excusa. Gotham no perdona.
        </p>
      </div>

      {/* Sections with decorators interspersed */}
      <div className="flex flex-col gap-6">
        {normativa.map((seccion, i) => (
          <div key={seccion.id}>
            <SectionCard seccion={seccion} index={i} />
            {decoratorAfter[i] ?? null}
          </div>
        ))}
      </div>

      {/* Closing trophy banner */}
      <div
        className="mt-14 bg-gotham-card border-4 border-batman-yellow p-8 text-center rotate-[0.4deg]"
        style={{ boxShadow: "6px 6px 0 #000" }}
      >
        <p
          className="font-[family-name:var(--font-bangers)] text-batman-yellow text-3xl tracking-widest uppercase mb-2"
          style={{ textShadow: "3px 3px 0 #000" }}
        >
          Trofeos
        </p>
        <p className="text-gotham-muted text-sm leading-relaxed max-w-xl mx-auto">
          Los ganadores de la Liga 1, Liga 2, Champions, Copa, FA Cup, Supercopa y Quiniela recibirán
          un trofeo acreditativo cortesía de la Administración.
        </p>
      </div>
    </div>
  );
}

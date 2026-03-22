import { miembros } from "@/data/miembros";

export const metadata = { title: "Miembros · Liga Batcarallo" };

export default function MiembrosPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-12 relative">
        <div className="halftone absolute inset-0 opacity-20 -mx-4 rounded-none" />
        <div className="relative py-8 px-2">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
            Los elegidos de Gotham
          </p>
          <h1
            className="font-[family-name:var(--font-bangers)] text-7xl text-batman-yellow tracking-widest"
            style={{ textShadow: "4px 4px 0 #000" }}
          >
            Miembros
          </h1>
        </div>
        <div className="border-b-4 border-batman-yellow" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {miembros.map((m, i) => (
          <div
            key={m.id}
            className="bg-gotham-card border-4 border-batman-yellow p-6 hover:scale-105 transition-transform duration-200"
            style={{
              boxShadow: "6px 6px 0 #000",
              transform: `rotate(${i % 2 === 0 ? "-0.8" : "0.8"}deg)`,
            }}
          >
            {/* Number badge */}
            <div className="flex items-start justify-between mb-4">
              <span
                className="font-[family-name:var(--font-bangers)] text-5xl text-gotham-border leading-none"
                style={{ WebkitTextStroke: "1px #333" }}
              >
                #{String(i + 1).padStart(2, "0")}
              </span>
              {m.titulos > 0 && (
                <span className="bg-batman-yellow text-black text-xs font-black px-2 py-1 uppercase tracking-wider">
                  🏆 ×{m.titulos}
                </span>
              )}
            </div>

            <h2 className="font-[family-name:var(--font-bangers)] text-2xl text-gotham-text tracking-wider mb-1">
              {m.nombre}
            </h2>
            <p className="text-batman-yellow text-sm font-bold uppercase tracking-widest mb-4">
              {m.equipo}
            </p>
            <div className="border-t-2 border-gotham-border pt-3 text-gotham-muted text-xs uppercase tracking-widest">
              {m.temporadas} temporadas
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

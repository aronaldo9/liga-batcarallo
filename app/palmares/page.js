import { palmares } from "@/data/palmares";

export const metadata = { title: "Palmarés · Liga Batcarallo" };

export default function PalmaresPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-12 relative">
        <div className="halftone absolute inset-0 opacity-20 -mx-4" />
        <div className="relative py-8 px-2">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
            Los que sobrevivieron
          </p>
          <h1
            className="font-[family-name:var(--font-bangers)] text-7xl text-batman-yellow tracking-widest"
            style={{ textShadow: "4px 4px 0 #000" }}
          >
            Palmarés
          </h1>
        </div>
        <div className="border-b-4 border-batman-yellow" />
      </div>

      {/* Champion highlight */}
      {palmares[0] && (
        <div
          className="bg-batman-yellow border-4 border-black p-6 mb-10 flex items-center justify-between"
          style={{ boxShadow: "6px 6px 0 #000" }}
        >
          <div>
            <p className="text-black text-xs font-black uppercase tracking-widest mb-1">
              🏆 Campeón actual · {palmares[0].temporada}
            </p>
            <p className="font-[family-name:var(--font-bangers)] text-black text-5xl tracking-widest">
              {palmares[0].campeon}
            </p>
            <p className="text-black/70 text-sm font-bold mt-1 uppercase tracking-widest">
              {palmares[0].equipo}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-black/50 text-xs uppercase tracking-widest">Puntos</p>
            <p className="font-[family-name:var(--font-bangers)] text-black text-5xl">
              {palmares[0].puntos.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Historic table */}
      <div
        className="border-4 border-batman-yellow overflow-hidden"
        style={{ boxShadow: "6px 6px 0 #000" }}
      >
        <div className="bg-batman-yellow px-6 py-3">
          <span className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
            Historial completo
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-black text-gotham-muted uppercase tracking-widest text-xs border-b-2 border-batman-yellow">
            <tr>
              <th className="px-6 py-3 text-left">Temporada</th>
              <th className="px-6 py-3 text-left">Campeón</th>
              <th className="px-6 py-3 text-left hidden sm:table-cell">Equipo</th>
              <th className="px-6 py-3 text-right">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {palmares.map((p, i) => (
              <tr
                key={p.temporada}
                className={`border-t-2 border-gotham-border ${i === 0 ? "bg-batman-yellow/10" : "hover:bg-gotham-card"} transition-colors`}
              >
                <td className="px-6 py-4 font-bold">
                  {i === 0 && <span className="text-batman-yellow mr-2">★</span>}
                  {p.temporada}
                </td>
                <td className="px-6 py-4 font-[family-name:var(--font-bangers)] text-lg tracking-wider text-batman-yellow">
                  {p.campeon}
                </td>
                <td className="px-6 py-4 text-gotham-muted hidden sm:table-cell">{p.equipo}</td>
                <td className="px-6 py-4 text-right tabular-nums font-bold">{p.puntos.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

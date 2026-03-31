import { palmares, logrosIndividuales } from "@/data/palmares";
import { miembros } from "@/data/miembros";

const LIGA_COMPS = ["Primera División", "Segunda División", "Supercopa Semifinal Nacional"];

function getCopas() {
  const map = {};
  for (const { memberId, logros } of logrosIndividuales) {
    const miembro = miembros.find((m) => m.id === memberId);
    if (!miembro) continue;
    for (const logro of logros) {
      if (logro.posicion !== "Campeón/a") continue;
      if (LIGA_COMPS.includes(logro.competicion)) continue;
      if (!map[logro.competicion]) map[logro.competicion] = [];
      map[logro.competicion].push({ nombre: miembro.nombre, equipo: miembro.equipo, temporada: logro.temporada });
    }
  }
  return Object.entries(map).map(([competicion, ganadores]) => ({ competicion, ganadores }));
}

export const metadata = { title: "Palmarés · Liga Batcarallo" };

export default function PalmaresPage() {
  const copas = getCopas();

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
            className="font-[family-name:var(--font-bangers)] text-5xl sm:text-7xl text-batman-yellow tracking-widest"
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
          className="bg-batman-yellow border-4 border-black p-6 mb-10"
          style={{ boxShadow: "6px 6px 0 #000" }}
        >
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
              <th className="px-6 py-3 text-right hidden sm:table-cell">Puntos</th>
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
                <td className="px-6 py-4 text-right font-mono hidden sm:table-cell text-gotham-muted">
                  {p.puntos ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Copas y competiciones */}
      <div className="mt-14">
        <div className="mb-8">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-1">
            Más allá de la liga
          </p>
          <h2
            className="font-[family-name:var(--font-bangers)] text-5xl text-gotham-text tracking-widest"
            style={{ textShadow: "3px 3px 0 #000" }}
          >
            Copas y Torneos
          </h2>
          <div className="border-b-4 border-gotham-border mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {copas.map(({ competicion, ganadores }) => (
            <div
              key={competicion}
              className="bg-gotham-card border-4 border-gotham-border overflow-hidden"
              style={{ boxShadow: "4px 4px 0 #000" }}
            >
              <div className="bg-gotham-border px-4 py-2">
                <h3 className="font-[family-name:var(--font-bangers)] text-batman-yellow text-lg tracking-widest uppercase">
                  {competicion}
                </h3>
              </div>
              <ul className="px-4 py-3 flex flex-col gap-2">
                {ganadores.map((g, i) => (
                  <li key={i} className="flex items-baseline justify-between text-sm">
                    <span>
                      <span className="text-batman-yellow mr-1">🏆</span>
                      <span className="text-gotham-text font-semibold">{g.nombre}</span>
                      <span className="text-gotham-muted text-xs ml-1">{g.equipo}</span>
                    </span>
                    {g.temporada && (
                      <span className="text-gotham-muted text-xs">{g.temporada}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

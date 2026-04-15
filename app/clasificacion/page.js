import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { miembros } from '@/data/miembros';

export const metadata = { title: 'Clasificación · Liga Batcarallo' };

async function getTotales() {
  const [rows] = await db.query(
    `SELECT u.member_id, u.username,
            COALESCE(u.puntos_historicos, 0) + COALESCE(SUM(r.puntos), 0) AS total_puntos
     FROM users u
     LEFT JOIN quiniela_resultados r ON r.user_id = u.id
     GROUP BY u.id, u.member_id, u.username, u.puntos_historicos`
  );
  return rows;
}

async function getPuntosMes() {
  const ahora = new Date();
  const [rows] = await db.query(
    `SELECT u.member_id, COALESCE(SUM(r.puntos), 0) AS puntos_mes
     FROM users u
     LEFT JOIN (
       SELECT r2.user_id, r2.puntos
       FROM quiniela_resultados r2
       JOIN quiniela_jornadas j ON j.id = r2.jornada_id
       WHERE EXTRACT(YEAR  FROM j.fecha_jornada) = $1
         AND EXTRACT(MONTH FROM j.fecha_jornada) = $2
     ) r ON r.user_id = u.id
     GROUP BY u.id, u.member_id`,
    [ahora.getFullYear(), ahora.getMonth() + 1]
  );
  return rows;
}

async function getVictorias() {
  // Suma victorias_historicas (meses anteriores a la web) +
  // victorias calculadas por la DB solo en meses ya cerrados (< mes actual)
  const [rows] = await db.query(
    `WITH monthly_totals AS (
       SELECT r.user_id, u.member_id,
              DATE_TRUNC('month', j.fecha_jornada) AS mes,
              SUM(r.puntos) AS puntos_mes
       FROM quiniela_resultados r
       JOIN users u ON u.id = r.user_id
       JOIN quiniela_jornadas j ON j.id = r.jornada_id
       WHERE DATE_TRUNC('month', j.fecha_jornada) < DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY r.user_id, u.member_id, DATE_TRUNC('month', j.fecha_jornada)
     ),
     monthly_max AS (
       SELECT mes, MAX(puntos_mes) AS max_puntos
       FROM monthly_totals
       GROUP BY mes
     ),
     db_victorias AS (
       SELECT mt.member_id, COUNT(*) AS cnt
       FROM monthly_totals mt
       JOIN monthly_max mm ON mm.mes = mt.mes AND mm.max_puntos = mt.puntos_mes
       GROUP BY mt.member_id
     )
     SELECT u.member_id,
            COALESCE(u.victorias_historicas, 0) + COALESCE(dv.cnt, 0) AS victorias
     FROM users u
     LEFT JOIN db_victorias dv ON dv.member_id = u.member_id`
  );
  return rows;
}

export default async function ClasificacionPage() {
  const session = await getSession();
  if (!session) redirect('/');

  let totales, puntosMes, victorias;
  try {
    [totales, puntosMes, victorias] = await Promise.all([
      getTotales(),
      getPuntosMes(),
      getVictorias(),
    ]);
  } catch {
    return <p className="text-red-400 text-sm">Error cargando la clasificación.</p>;
  }

  const puntosMesMap  = Object.fromEntries(puntosMes.map(r => [r.member_id, Number(r.puntos_mes)]));
  const victoriasMap  = Object.fromEntries(victorias.map(r => [r.member_id, Number(r.victorias)]));
  const miembrosMap   = Object.fromEntries(miembros.map(m => [m.id, m]));

  const jugadores = totales
    .map(r => ({
      member_id:    r.member_id,
      username:     r.username,
      equipo:       miembrosMap[r.member_id]?.equipo ?? r.username,
      division:     miembrosMap[r.member_id]?.division ?? 'segunda',
      total_puntos: Number(r.total_puntos),
      puntos_mes:   puntosMesMap[r.member_id] ?? 0,
      victorias:    victoriasMap[r.member_id] ?? 0,
    }))
    .sort((a, b) => b.total_puntos - a.total_puntos);

  const ahora = new Date();
  const nombreMes = ahora.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="mb-10 relative">
        <div className="halftone absolute inset-0 opacity-20 -mx-4" aria-hidden="true" />
        <div className="relative py-8 px-2">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
            Quiniela Batcarallo
          </p>
          <h1
            className="font-[family-name:var(--font-bangers)] text-5xl sm:text-7xl text-batman-yellow tracking-widest"
            style={{ textShadow: '4px 4px 0 #000' }}
          >
            Clasificación
          </h1>
        </div>
        <div className="border-b-4 border-batman-yellow" />
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 mb-4 text-xs font-bold uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-batman-yellow inline-block" />
          Primera División
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gotham-card border border-gotham-muted inline-block" />
          Segunda División
        </span>
      </div>

      {/* Tabla */}
      <div
        className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
        style={{ boxShadow: '6px 6px 0 #000' }}
      >
        <table className="w-full text-sm">
          <thead className="bg-black border-b-2 border-batman-yellow text-batman-yellow uppercase tracking-widest text-xs">
            <tr>
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left">Equipo</th>
              <th className="px-4 py-3 text-center">Pts totales</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">
                Victorias mes
              </th>
              <th className="px-4 py-3 text-center">
                <span className="hidden sm:inline">Pts </span>
                {nombreMes}
              </th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((j, i) => {
              const esPrimera = j.division === 'primera';
              return (
                <tr
                  key={j.member_id}
                  className={`border-t border-gotham-muted ${
                    esPrimera
                      ? 'bg-batman-yellow text-black'
                      : 'text-gotham-text hover:bg-gotham-muted/10'
                  }`}
                >
                  <td className={`px-4 py-3 font-bold text-center ${esPrimera ? 'text-black' : 'text-batman-yellow'}`}>
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {j.equipo}
                  </td>
                  <td className="px-4 py-3 text-center font-bold tabular-nums">
                    {j.total_puntos}
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell tabular-nums">
                    {j.victorias > 0 ? (
                      <span className={`font-bold ${esPrimera ? 'text-black' : 'text-batman-yellow'}`}>
                        {j.victorias}
                      </span>
                    ) : (
                      <span className={esPrimera ? 'text-black/50' : 'text-gotham-muted'}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold tabular-nums">
                    {j.puntos_mes > 0 ? j.puntos_mes : (
                      <span className={esPrimera ? 'text-black/50' : 'text-gotham-muted'}>0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

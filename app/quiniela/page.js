import Link from 'next/link';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'Quiniela · Liga Batcarallo' };

// Formatea fecha corta
function fechaCorta(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function estadoBadge(estado) {
  const map = {
    abierta: { label: 'Abierta', cls: 'bg-green-900 text-green-400 border-green-700' },
    cerrada: { label: 'Cerrada', cls: 'bg-gray-800 text-gotham-muted border-gray-600' },
    con_resultado: { label: 'Con resultado', cls: 'bg-batman-yellow text-black border-batman-yellow' },
  };
  const { label, cls } = map[estado] || map.cerrada;
  return (
    <span className={`text-xs font-bold uppercase tracking-widest border px-2 py-0.5 ${cls}`}>
      {label}
    </span>
  );
}

async function getRankingMensual() {
  const ahora = new Date();
  const [rows] = await db.query(
    `SELECT u.username, u.member_id, SUM(r.puntos) as puntos
     FROM quiniela_resultados r
     JOIN users u ON u.id = r.user_id
     JOIN quiniela_jornadas j ON j.id = r.jornada_id
     WHERE EXTRACT(YEAR FROM j.fecha_jornada) = ? AND EXTRACT(MONTH FROM j.fecha_jornada) = ?
     AND u.quiniela_eliminado = FALSE
     GROUP BY u.id
     ORDER BY puntos DESC`,
    [ahora.getFullYear(), ahora.getMonth() + 1]
  );
  return rows;
}

async function getPichichi() {
  const [rows] = await db.query(
    `SELECT u.username, u.member_id, SUM(r.puntos) as puntos,
            COUNT(CASE WHEN mes_rank = 1 THEN 1 END) as victorias_mensuales
     FROM (
       SELECT r.user_id, r.puntos,
              RANK() OVER (PARTITION BY TO_CHAR(j.fecha_jornada, 'YYYY-MM') ORDER BY SUM(r.puntos) DESC) as mes_rank
       FROM quiniela_resultados r
       JOIN quiniela_jornadas j ON j.id = r.jornada_id
       GROUP BY r.user_id, TO_CHAR(j.fecha_jornada, 'YYYY-MM')
     ) ranked
     JOIN users u ON u.id = ranked.user_id
     WHERE u.quiniela_eliminado = FALSE
     JOIN quiniela_resultados r ON r.user_id = ranked.user_id
     GROUP BY ranked.user_id
     ORDER BY SUM(r.puntos) DESC`
  );
  return rows;
}

export default async function QuinielaPage() {
  const session = await getSession();

  const [jornadas] = await db.query(
    `SELECT id, numero, descripcion, fecha_jornada, fecha_limite, estado
     FROM quiniela_jornadas ORDER BY fecha_jornada DESC`
  );

  // Pronósticos del usuario para saber cuáles ya envió
  let misJornadas = new Set();
  if (session) {
    const [enviados] = await db.query(
      `SELECT DISTINCT jornada_id FROM quiniela_pronosticos WHERE user_id = ?`,
      [session.id]
    );
    misJornadas = new Set(enviados.map((r) => r.jornada_id));
  }

  const [rankingMensual, pichichi] = await Promise.all([getRankingMensual(), getPichichi()]);

  const abierta = jornadas.find((j) => j.estado === 'abierta');

  return (
    <div>
      {/* Header */}
      <div className="mb-10 relative">
        <div className="halftone absolute inset-0 opacity-20 -mx-4" aria-hidden="true" />
        <div className="relative py-8 px-2">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
            El pronóstico de Gotham
          </p>
          <h1
            className="font-[family-name:var(--font-bangers)] text-5xl sm:text-7xl text-batman-yellow tracking-widest"
            style={{ textShadow: '4px 4px 0 #000' }}
          >
            Quiniela
          </h1>
        </div>
        <div className="border-b-4 border-batman-yellow" />
      </div>

      {/* Jornada activa */}
      {abierta && (
        <Link href={`/quiniela/${abierta.id}`}>
          <div
            className="bg-batman-yellow border-4 border-black p-5 mb-10 rotate-[-0.3deg] hover:rotate-0 transition-transform"
            style={{ boxShadow: '6px 6px 0 #000' }}
          >
            <p className="text-black text-xs font-bold uppercase tracking-widest mb-1">
              ⚡ Jornada activa — plazo: {new Date(abierta.fecha_limite).toLocaleString('es-ES')}
            </p>
            <p className="text-black font-[family-name:var(--font-bangers)] text-2xl tracking-widest">
              Jornada {abierta.numero}{abierta.descripcion ? ` · ${abierta.descripcion}` : ''}
              {misJornadas.has(abierta.id) ? ' ✓ Pronóstico enviado' : ' → Enviar pronóstico'}
            </p>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de jornadas */}
        <div className="lg:col-span-2">
          <h2 className="font-[family-name:var(--font-bangers)] text-batman-yellow text-2xl tracking-widest uppercase mb-4">
            Jornadas
          </h2>
          {jornadas.length === 0 ? (
            <p className="text-gotham-muted text-sm">Aún no hay jornadas creadas.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {jornadas.map((j) => (
                <Link
                  key={j.id}
                  href={`/quiniela/${j.id}`}
                  className="bg-gotham-card border-2 border-gotham-muted hover:border-batman-yellow transition-colors px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <span className="font-[family-name:var(--font-bangers)] text-batman-yellow tracking-widest">
                      J{j.numero}
                    </span>
                    {j.descripcion && (
                      <span className="text-gotham-muted text-sm ml-2">{j.descripcion}</span>
                    )}
                    <span className="text-gotham-muted text-xs ml-3">{fechaCorta(j.fecha_jornada)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {misJornadas.has(j.id) && (
                      <span className="text-xs text-green-400 font-bold">✓</span>
                    )}
                    {estadoBadge(j.estado)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Rankings */}
        <div className="flex flex-col gap-6">
          {/* Ranking mensual */}
          <div
            className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
            style={{ boxShadow: '4px 4px 0 #000' }}
          >
            <div className="bg-batman-yellow px-4 py-2">
              <h3 className="font-[family-name:var(--font-bangers)] text-black text-lg tracking-widest uppercase">
                Mes actual
              </h3>
            </div>
            <div className="px-4 py-3">
              {rankingMensual.length === 0 ? (
                <p className="text-gotham-muted text-xs">Sin datos este mes.</p>
              ) : (
                <ol className="flex flex-col gap-1">
                  {rankingMensual.map((u, i) => (
                    <li key={u.username} className="flex justify-between text-sm">
                      <span className="text-gotham-muted">
                        <span className="text-batman-yellow font-bold mr-2">{i + 1}.</span>
                        {u.username}
                      </span>
                      <span className="font-bold text-batman-yellow">{u.puntos} pts</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Pichichi de temporada */}
          <div
            className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
            style={{ boxShadow: '4px 4px 0 #000' }}
          >
            <div className="bg-batman-yellow px-4 py-2">
              <h3 className="font-[family-name:var(--font-bangers)] text-black text-lg tracking-widest uppercase">
                Pichichi
              </h3>
            </div>
            <div className="px-4 py-3">
              {pichichi.length === 0 ? (
                <p className="text-gotham-muted text-xs">Sin datos.</p>
              ) : (
                <ol className="flex flex-col gap-1">
                  {pichichi.map((u, i) => (
                    <li key={u.username} className="flex justify-between text-sm">
                      <span className="text-gotham-muted">
                        <span className="text-batman-yellow font-bold mr-2">{i + 1}.</span>
                        {u.username}
                      </span>
                      <span className="font-bold text-batman-yellow">{u.puntos} pts</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

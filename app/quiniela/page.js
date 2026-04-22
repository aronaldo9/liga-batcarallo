import Link from 'next/link';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { miembros } from '@/data/miembros';

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

async function getTop3Mes() {
  try {
    const [rows] = await db.query(
      `SELECT member_id, puntos_mes AS puntos FROM users ORDER BY puntos_mes DESC LIMIT 3`
    );
    return rows;
  } catch {
    return [];
  }
}

async function getTop3Total() {
  try {
    const [rows] = await db.query(
      `SELECT member_id, puntos_totales AS puntos FROM users ORDER BY puntos_totales DESC LIMIT 3`
    );
    return rows;
  } catch {
    return [];
  }
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

  const [top3Mes, top3Total] = await Promise.all([getTop3Mes(), getTop3Total()]);
  const miembrosMap = Object.fromEntries(miembros.map(m => [m.id, m]));

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

      {/* Acceso clasificación */}
      <div className="mb-6">
        <Link
          href="/clasificacion"
          className="inline-block border-2 border-batman-yellow text-batman-yellow font-bold uppercase tracking-widest text-sm px-4 py-2 hover:bg-batman-yellow hover:text-black transition-colors"
        >
          Ver clasificación →
        </Link>
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
        <div className="flex flex-col gap-4">
          {/* Top 3 mes */}
          <div
            className="bg-gotham-card border-2 border-batman-yellow overflow-hidden"
            style={{ boxShadow: '3px 3px 0 #000' }}
          >
            <div className="bg-batman-yellow px-3 py-1.5 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-bangers)] text-black text-base tracking-widest uppercase">
                Mes actual
              </h3>
              <Link href="/clasificacion" className="text-black text-xs font-bold uppercase tracking-widest hover:underline">
                Ver todo →
              </Link>
            </div>
            <div className="px-3 py-2">
              {top3Mes.length === 0 ? (
                <p className="text-gotham-muted text-xs">Sin datos este mes.</p>
              ) : (
                <ol className="flex flex-col gap-1">
                  {top3Mes.map((u, i) => (
                    <li key={u.member_id} className="flex justify-between text-sm">
                      <span className="text-gotham-muted">
                        <span className="text-batman-yellow font-bold mr-2">{i + 1}.</span>
                        {miembrosMap[u.member_id]?.equipo ?? '—'}
                      </span>
                      <span className="font-bold text-batman-yellow">{u.puntos} pts</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Top 3 total */}
          <div
            className="bg-gotham-card border-2 border-batman-yellow overflow-hidden"
            style={{ boxShadow: '3px 3px 0 #000' }}
          >
            <div className="bg-batman-yellow px-3 py-1.5 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-bangers)] text-black text-base tracking-widest uppercase">
                Pichichi
              </h3>
              <Link href="/clasificacion" className="text-black text-xs font-bold uppercase tracking-widest hover:underline">
                Ver todo →
              </Link>
            </div>
            <div className="px-3 py-2">
              {top3Total.length === 0 ? (
                <p className="text-gotham-muted text-xs">Sin datos.</p>
              ) : (
                <ol className="flex flex-col gap-1">
                  {top3Total.map((u, i) => (
                    <li key={u.member_id} className="flex justify-between text-sm">
                      <span className="text-gotham-muted">
                        <span className="text-batman-yellow font-bold mr-2">{i + 1}.</span>
                        {miembrosMap[u.member_id]?.equipo ?? '—'}
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

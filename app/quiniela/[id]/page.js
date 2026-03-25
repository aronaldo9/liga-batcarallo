import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import PronosticoForm from './PronosticoForm';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const [[j]] = await db.query('SELECT numero FROM quiniela_jornadas WHERE id = ?', [id]);
  return { title: j ? `Quiniela J${j.numero} · Liga Batcarallo` : 'Quiniela' };
}

function ResultadoBadge({ valor }) {
  if (!valor) return <span className="text-gotham-muted">—</span>;
  return (
    <span className="font-[family-name:var(--font-bangers)] text-batman-yellow text-lg">{valor}</span>
  );
}

function PronosticoBadge({ pronostico, resultado }) {
  if (!pronostico) return <span className="text-gotham-muted text-sm">—</span>;
  const acertado = resultado && pronostico === resultado;
  const fallado = resultado && pronostico !== resultado;
  return (
    <span
      className={`font-bold text-sm px-2 py-0.5 border ${
        acertado
          ? 'border-green-600 text-green-400 bg-green-950'
          : fallado
          ? 'border-red-700 text-red-400 bg-red-950'
          : 'border-gotham-muted text-gotham-text'
      }`}
    >
      {pronostico}
    </span>
  );
}

export default async function QuinielaDetallePage({ params }) {
  const { id } = await params;
  const session = await getSession();

  const [[jornada]] = await db.query(
    'SELECT id, numero, descripcion, fecha_jornada, fecha_limite, estado FROM quiniela_jornadas WHERE id = ?',
    [id]
  );
  if (!jornada) notFound();

  const [partidos] = await db.query(
    'SELECT id, tipo, orden, equipo_local, equipo_visitante, resultado FROM quiniela_partidos WHERE jornada_id = ? ORDER BY orden',
    [id]
  );

  // Pronóstico del usuario actual
  const [misPronosticos] = await db.query(
    'SELECT partido_id, pronostico FROM quiniela_pronosticos WHERE jornada_id = ? AND user_id = ?',
    [id, session?.id ?? 0]
  );
  const miPronostico = Object.fromEntries(misPronosticos.map((p) => [p.partido_id, p.pronostico]));
  const yaEnvie = misPronosticos.length > 0;

  // Tabla de resultados (solo si hay resultado)
  let tablaResultados = [];
  if (jornada.estado === 'con_resultado') {
    const [todos] = await db.query(
      `SELECT u.username, qp.partido_id, qp.pronostico, r.puntos
       FROM quiniela_pronosticos qp
       JOIN users u ON u.id = qp.user_id
       LEFT JOIN quiniela_resultados r ON r.jornada_id = qp.jornada_id AND r.user_id = qp.user_id
       WHERE qp.jornada_id = ?
       ORDER BY r.puntos DESC, u.username`,
      [id]
    );
    const porUsuario = {};
    for (const row of todos) {
      if (!porUsuario[row.username]) {
        porUsuario[row.username] = { username: row.username, puntos: row.puntos ?? 0, pronosticos: {} };
      }
      porUsuario[row.username].pronosticos[row.partido_id] = row.pronostico;
    }
    tablaResultados = Object.values(porUsuario).sort((a, b) => b.puntos - a.puntos);
  }

  const abiertaYEnPlazo =
    jornada.estado === 'abierta' && new Date() <= new Date(jornada.fecha_limite);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-1">
          Quiniela Batcarallo
        </p>
        <h1
          className="font-[family-name:var(--font-bangers)] text-5xl text-batman-yellow tracking-widest"
          style={{ textShadow: '3px 3px 0 #000' }}
        >
          Jornada {jornada.numero}
          {jornada.descripcion && (
            <span className="text-3xl text-gotham-muted ml-3">{jornada.descripcion}</span>
          )}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gotham-muted">
          <span>
            {new Date(jornada.fecha_jornada).toLocaleDateString('es-ES', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </span>
          <span>·</span>
          <span>Plazo: {new Date(jornada.fecha_limite).toLocaleString('es-ES')}</span>
        </div>
        <div className="border-b-2 border-batman-yellow mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partidos + formulario */}
        <div>
          {/* Partidos */}
          <div
            className="bg-gotham-card border-4 border-batman-yellow overflow-hidden mb-6"
            style={{ boxShadow: '6px 6px 0 #000' }}
          >
            <div className="bg-batman-yellow px-5 py-3">
              <h2 className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
                Partidos
              </h2>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {partidos.map((p) => (
                <div key={p.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-gotham-muted font-bold">
                      {p.tipo === 'jornada' ? '★ Partido de jornada' : 'Simple'}
                    </span>
                    {jornada.estado === 'con_resultado' && <ResultadoBadge valor={p.resultado} />}
                  </div>
                  <p className="text-gotham-text font-semibold">
                    {p.equipo_local} <span className="text-gotham-muted">vs</span> {p.equipo_visitante}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario o estado del pronóstico */}
          {abiertaYEnPlazo && !yaEnvie && (
            <div
              className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
              style={{ boxShadow: '6px 6px 0 #000' }}
            >
              <div className="bg-batman-yellow px-5 py-3">
                <h2 className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
                  Tu pronóstico
                </h2>
              </div>
              <div className="px-5 py-5">
                <PronosticoForm jornadaId={jornada.id} partidos={partidos} />
              </div>
            </div>
          )}

          {yaEnvie && (
            <div
              className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
              style={{ boxShadow: '6px 6px 0 #000' }}
            >
              <div className="bg-batman-yellow px-5 py-3">
                <h2 className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
                  Tu pronóstico ✓
                </h2>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                {partidos.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-sm text-gotham-text">
                      {p.equipo_local} vs {p.equipo_visitante}
                    </span>
                    <PronosticoBadge pronostico={miPronostico[p.id]} resultado={p.resultado} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!abiertaYEnPlazo && !yaEnvie && jornada.estado === 'abierta' && (
            <p className="text-red-400 text-sm font-bold border border-red-800 bg-red-950 px-4 py-3">
              ⚠ El plazo de pronósticos ha terminado.
            </p>
          )}
        </div>

        {/* Tabla de resultados */}
        {jornada.estado === 'con_resultado' && (
          <div>
            <h2 className="font-[family-name:var(--font-bangers)] text-batman-yellow text-2xl tracking-widest uppercase mb-4">
              Resultados
            </h2>
            <div className="bg-gotham-card border-2 border-batman-yellow overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-batman-yellow text-black">
                    <th className="text-left px-3 py-2 font-[family-name:var(--font-bangers)] tracking-widest">#</th>
                    <th className="text-left px-3 py-2 font-[family-name:var(--font-bangers)] tracking-widest">Usuario</th>
                    {partidos.map((p) => (
                      <th key={p.id} className="px-3 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-center">
                        P{p.orden}
                      </th>
                    ))}
                    <th className="px-3 py-2 font-[family-name:var(--font-bangers)] tracking-widest text-right">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaResultados.map((u, i) => (
                    <tr
                      key={u.username}
                      className={`border-t border-gotham-muted ${u.username === session?.username ? 'bg-black' : ''}`}
                    >
                      <td className="px-3 py-2 text-gotham-muted font-bold">{i + 1}</td>
                      <td className="px-3 py-2 text-gotham-text font-semibold">{u.username}</td>
                      {partidos.map((p) => (
                        <td key={p.id} className="px-3 py-2 text-center">
                          <PronosticoBadge pronostico={u.pronosticos[p.id]} resultado={p.resultado} />
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right font-bold text-batman-yellow">{u.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

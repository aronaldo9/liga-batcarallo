import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/quiniela/[id] — detalle de una jornada con partidos, pronóstico del usuario y resultados
export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { id } = await params;

    const [[jornada]] = await db.query(
      'SELECT id, numero, descripcion, fecha_jornada, fecha_limite, estado FROM quiniela_jornadas WHERE id = ?',
      [id]
    );
    if (!jornada) return NextResponse.json({ error: 'Jornada no encontrada' }, { status: 404 });

    const [partidos] = await db.query(
      'SELECT id, tipo, orden, equipo_local, equipo_visitante, resultado FROM quiniela_partidos WHERE jornada_id = ? ORDER BY orden',
      [id]
    );

    // Pronóstico del usuario actual
    const [misPronosticos] = await db.query(
      'SELECT partido_id, pronostico FROM quiniela_pronosticos WHERE jornada_id = ? AND user_id = ?',
      [id, session.id]
    );
    const miPronostico = Object.fromEntries(misPronosticos.map((p) => [p.partido_id, p.pronostico]));

    // Si hay resultados, traer todos los pronósticos para la tabla de resultados
    let tablaResultados = [];
    if (jornada.estado === 'con_resultado') {
      const [todos] = await db.query(
        `SELECT u.username, u.member_id,
                qp.partido_id, qp.pronostico,
                r.puntos
         FROM quiniela_pronosticos qp
         JOIN users u ON u.id = qp.user_id
         LEFT JOIN quiniela_resultados r ON r.jornada_id = qp.jornada_id AND r.user_id = qp.user_id
         WHERE qp.jornada_id = ?
         ORDER BY r.puntos DESC, u.username`,
        [id]
      );

      // Agrupar por usuario
      const porUsuario = {};
      for (const row of todos) {
        if (!porUsuario[row.username]) {
          porUsuario[row.username] = {
            username: row.username,
            member_id: row.member_id,
            puntos: row.puntos ?? 0,
            pronosticos: {},
          };
        }
        porUsuario[row.username].pronosticos[row.partido_id] = row.pronostico;
      }
      tablaResultados = Object.values(porUsuario).sort((a, b) => b.puntos - a.puntos);
    }

    return NextResponse.json({ jornada, partidos, miPronostico, tablaResultados });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PATCH /api/quiniela/[id] — cerrar jornada manualmente (admin)
export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { id } = await params;
    await db.query(
      "UPDATE quiniela_jornadas SET estado = 'cerrada' WHERE id = ? AND estado = 'abierta'",
      [id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

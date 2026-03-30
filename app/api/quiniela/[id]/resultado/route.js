import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calcularPuntuacion } from '@/lib/quiniela';

// POST /api/quiniela/[id]/resultado — entrar resultados y calcular puntuaciones (admin)
export async function POST(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    if (!session.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { id } = await params;

    const [[jornada]] = await db.query(
      'SELECT id, estado FROM quiniela_jornadas WHERE id = ?',
      [id]
    );
    if (!jornada) return NextResponse.json({ error: 'Jornada no encontrada' }, { status: 404 });
    if (jornada.estado === 'con_resultado') {
      return NextResponse.json({ error: 'Esta jornada ya tiene resultados' }, { status: 409 });
    }

    // resultados: { [partido_id]: '1'|'X'|'2' }
    const { resultados } = await request.json();
    const valores = ['1', 'X', '2'];
    for (const [partidoId, resultado] of Object.entries(resultados)) {
      if (!valores.includes(resultado)) {
        return NextResponse.json({ error: `Resultado inválido para partido ${partidoId}` }, { status: 400 });
      }
      await db.query(
        'UPDATE quiniela_partidos SET resultado = ? WHERE id = ? AND jornada_id = ?',
        [resultado, partidoId, id]
      );
    }

    // Cambiar estado
    await db.query(
      "UPDATE quiniela_jornadas SET estado = 'con_resultado' WHERE id = ?",
      [id]
    );

    // Calcular puntuaciones de todos los participantes
    const [partidos] = await db.query(
      'SELECT id, tipo, resultado FROM quiniela_partidos WHERE jornada_id = ?',
      [id]
    );

    // Obtener todos los pronósticos de esta jornada
    const [todosPronosticos] = await db.query(
      'SELECT user_id, partido_id, pronostico FROM quiniela_pronosticos WHERE jornada_id = ?',
      [id]
    );

    // Agrupar pronósticos por usuario
    const porUsuario = {};
    for (const p of todosPronosticos) {
      if (!porUsuario[p.user_id]) porUsuario[p.user_id] = {};
      porUsuario[p.user_id][p.partido_id] = p.pronostico;
    }

    // Calcular e insertar puntuaciones
    for (const [userId, pronosticos] of Object.entries(porUsuario)) {
      const puntos = calcularPuntuacion(partidos, pronosticos);
      await db.query(
        `INSERT INTO quiniela_resultados (jornada_id, user_id, puntos) VALUES (?, ?, ?)
         ON CONFLICT (jornada_id, user_id) DO UPDATE SET puntos = EXCLUDED.puntos`,
        [id, userId, puntos]
      );
    }

    // Actualizar ausencias consecutivas
    const [todosUsuarios] = await db.query(
      'SELECT id FROM users WHERE quiniela_eliminado = FALSE'
    );
    const participaron = new Set(Object.keys(porUsuario).map(Number));

    for (const { id: uid } of todosUsuarios) {
      if (participaron.has(uid)) {
        // Participó: resetear ausencias
        await db.query('UPDATE users SET ausencias_consecutivas = 0 WHERE id = ?', [uid]);
      } else {
        // No participó: incrementar y eliminar si llega a 3
        await db.query(
          `UPDATE users
           SET ausencias_consecutivas = ausencias_consecutivas + 1,
               quiniela_eliminado = CASE WHEN ausencias_consecutivas + 1 >= 3 THEN TRUE ELSE FALSE END
           WHERE id = ?`,
          [uid]
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

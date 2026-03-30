import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// POST /api/quiniela/[id]/pronostico — enviar pronóstico
export async function POST(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { id } = await params;

    // Verificar que el usuario no está eliminado
    const [[user]] = await db.query(
      'SELECT quiniela_eliminado FROM users WHERE id = ?',
      [session.id]
    );
    if (user?.quiniela_eliminado) {
      return NextResponse.json({ error: 'Estás eliminado de la quiniela por ausencias' }, { status: 403 });
    }

    // Verificar que la jornada existe y está abierta y no ha pasado el plazo
    const [[jornada]] = await db.query(
      'SELECT id, estado, fecha_limite FROM quiniela_jornadas WHERE id = ?',
      [id]
    );
    if (!jornada) return NextResponse.json({ error: 'Jornada no encontrada' }, { status: 404 });
    if (jornada.estado !== 'abierta') {
      return NextResponse.json({ error: 'La jornada ya está cerrada' }, { status: 400 });
    }
    if (new Date() > new Date(jornada.fecha_limite)) {
      return NextResponse.json({ error: 'El plazo de pronósticos ha terminado' }, { status: 400 });
    }

    // Verificar que el usuario no ha enviado ya pronóstico
    const [existing] = await db.query(
      'SELECT id FROM quiniela_pronosticos WHERE jornada_id = ? AND user_id = ? LIMIT 1',
      [id, session.id]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Ya enviaste tu pronóstico para esta jornada' }, { status: 409 });
    }

    // pronosticos: { [partido_id]: '1'|'X'|'2' }
    const { pronosticos } = await request.json();
    if (!pronosticos || typeof pronosticos !== 'object') {
      return NextResponse.json({ error: 'Pronósticos inválidos' }, { status: 400 });
    }

    const [partidos] = await db.query(
      'SELECT id FROM quiniela_partidos WHERE jornada_id = ?',
      [id]
    );
    if (partidos.length !== Object.keys(pronosticos).length) {
      return NextResponse.json({ error: 'Debes pronosticar todos los partidos' }, { status: 400 });
    }

    const valores = ['1', 'X', '2'];
    for (const partido of partidos) {
      const p = pronosticos[partido.id];
      if (!valores.includes(p)) {
        return NextResponse.json({ error: 'Valor de pronóstico inválido' }, { status: 400 });
      }
      await db.query(
        'INSERT INTO quiniela_pronosticos (jornada_id, user_id, partido_id, pronostico) VALUES (?, ?, ?, ?)',
        [id, session.id, partido.id, p]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/quiniela — lista de jornadas
export async function GET() {
  try {
    const [jornadas] = await db.query(
      `SELECT id, numero, descripcion, fecha_jornada, fecha_limite, estado, created_at
       FROM quiniela_jornadas
       ORDER BY fecha_jornada DESC`
    );
    return NextResponse.json({ jornadas });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// POST /api/quiniela — crear jornada (admin)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    if (!session.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { numero, descripcion, fecha_jornada, fecha_limite, partidos } = await request.json();

    if (!numero || !fecha_jornada || !fecha_limite || !partidos?.length) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // partidos: [{tipo: 'simple'|'jornada', equipo_local, equipo_visitante, orden}]
    const simples = partidos.filter((p) => p.tipo === 'simple');
    const jornada = partidos.filter((p) => p.tipo === 'jornada');
    if (simples.length !== 2 || jornada.length !== 1) {
      return NextResponse.json(
        { error: 'Se necesitan exactamente 2 partidos simples y 1 partido de jornada' },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      'INSERT INTO quiniela_jornadas (numero, descripcion, fecha_jornada, fecha_limite) VALUES (?, ?, ?, ?)',
      [numero, descripcion || null, fecha_jornada, fecha_limite]
    );
    const jornadaId = result.insertId;

    for (const partido of partidos) {
      await db.query(
        'INSERT INTO quiniela_partidos (jornada_id, tipo, orden, equipo_local, equipo_visitante) VALUES (?, ?, ?, ?, ?)',
        [jornadaId, partido.tipo, partido.orden, partido.equipo_local, partido.equipo_visitante]
      );
    }

    return NextResponse.json({ ok: true, id: jornadaId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

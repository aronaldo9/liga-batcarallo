import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/quiniela/jugadores — lista usuarios con estado quiniela
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const [rows] = await db.query(
      `SELECT id, username, member_id, quiniela_eliminado, ausencias_consecutivas
       FROM users ORDER BY username`
    );
    return NextResponse.json({ jugadores: rows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/quiniela/jugadores — toggle eliminado manualmente
export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session?.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { userId, eliminado } = await request.json();
    await db.query(
      `UPDATE users SET quiniela_eliminado = ?, ausencias_consecutivas = ? WHERE id = ?`,
      [eliminado ? 1 : 0, eliminado ? 3 : 0, userId]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

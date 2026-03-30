import { NextResponse } from 'next/server';
import db from '@/lib/db';

// POST /api/setup/migrate — añade columnas nuevas a users si no existen
export async function POST() {
  try {
    await db.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS quiniela_eliminado BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS ausencias_consecutivas INT NOT NULL DEFAULT 0
    `);
    return NextResponse.json({ ok: true, mensaje: 'Migración aplicada correctamente' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

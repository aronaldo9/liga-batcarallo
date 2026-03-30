import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { actual, nueva } = await request.json();

  if (!actual || !nueva) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }
  if (nueva.length < 8) {
    return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [session.id]);
  const user = rows[0];
  if (!user || !verifyPassword(actual, user.password_hash)) {
    return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 401 });
  }

  const newHash = hashPassword(nueva);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, session.id]);

  return NextResponse.json({ ok: true });
}

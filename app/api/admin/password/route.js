import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

export async function PATCH(request) {
  const session = await getSession();
  if (!session?.is_admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { userId, password } = await request.json();
  if (!userId || !password || password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashPassword(password), userId]);
  return NextResponse.json({ ok: true });
}

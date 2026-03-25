import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, createSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Credenciales requeridas' }, { status: 400 });
    }

    const [rows] = await db.query(
      'SELECT id, member_id, username, password_hash, is_admin FROM users WHERE username = ?',
      [username.toLowerCase().trim()]
    );

    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }

    const cookie = createSessionCookie(user);
    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username, is_admin: !!user.is_admin },
    });
    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

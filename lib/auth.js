import { pbkdf2Sync, randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.SESSION_SECRET || 'dev-secret-inseguro';
const COOKIE_NAME = 'batcarallo_session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos

// ── Contraseñas ──────────────────────────────────────────────────────────────

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hash2 = pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
  return timingSafeEqual(Buffer.from(hash), Buffer.from(hash2));
}

// ── Sesión ───────────────────────────────────────────────────────────────────

function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(data).digest('hex');
  return `${data}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', SECRET).update(data).digest('hex');
  try {
    if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function createSessionCookie(user) {
  const payload = {
    id: user.id,
    username: user.username,
    member_id: user.member_id,
    is_admin: !!user.is_admin,
    exp: Date.now() + COOKIE_MAX_AGE * 1000,
  };
  return {
    name: COOKIE_NAME,
    value: signToken(payload),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
}

export function clearSessionCookie() {
  return { name: COOKIE_NAME, value: '', httpOnly: true, maxAge: 0, path: '/' };
}

import { NextResponse } from 'next/server';

const SECRET = process.env.SESSION_SECRET || 'dev-secret-inseguro';
const COOKIE_NAME = 'batcarallo_session';

async function verifyToken(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;

  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = new Uint8Array(sig.match(/.{2}/g).map((b) => parseInt(b, 16)));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data));
    if (!valid) return null;

    const payload = JSON.parse(atob(data.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifyToken(token);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!session?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/quiniela')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/quiniela/:path*', '/admin/:path*'],
};

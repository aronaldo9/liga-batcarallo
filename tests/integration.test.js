/**
 * Tests de integración — requieren el servidor corriendo en localhost:3000
 * npm run dev debe estar activo antes de ejecutar estos tests.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE = 'http://localhost:3000';

// Credenciales de prueba
const ADMIN = { username: 'aaron', password: 'batcarallo' };
const USER = { username: 'david', password: 'batcarallo' };

let adminCookie = '';
let userCookie = '';
let testJornadaId = null;
let testPartidoIds = [];

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function login(credentials) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const setCookie = res.headers.get('set-cookie') || '';
  const match = setCookie.match(/batcarallo_session=[^;]+/);
  return { status: res.status, cookie: match ? match[0] : '', body: await res.json() };
}

async function get(path, cookie = '') {
  return fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
  });
}

async function post(path, body, cookie = '') {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeAll(async () => {
  const a = await login(ADMIN);
  adminCookie = a.cookie;

  const u = await login(USER);
  userCookie = u.cookie;
});

// ── Auth ──────────────────────────────────────────────────────────────────────

describe('Auth', () => {
  it('login correcto devuelve 200 y cookie', async () => {
    const res = await login(ADMIN);
    expect(res.status).toBe(200);
    expect(res.cookie).toContain('batcarallo_session=');
  });

  it('login con contraseña incorrecta devuelve 401', async () => {
    const res = await login({ username: 'aaron', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('login con usuario inexistente devuelve 401', async () => {
    const res = await login({ username: 'fantasma', password: 'batcarallo' });
    expect(res.status).toBe(401);
  });

  it('/api/auth/me sin cookie devuelve 401', async () => {
    const res = await get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('/api/auth/me con cookie válida devuelve los datos del usuario', async () => {
    const res = await get('/api/auth/me', adminCookie);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.username).toBe('aaron');
    expect(data.user.is_admin).toBe(true);
  });
});

// ── Quiniela: listar jornadas ─────────────────────────────────────────────────

describe('GET /api/quiniela', () => {
  it('devuelve 200 con array de jornadas (con auth)', async () => {
    const res = await get('/api/quiniela', adminCookie);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.jornadas)).toBe(true);
  });
});

// ── Quiniela: crear jornada (admin) ───────────────────────────────────────────

describe('POST /api/quiniela', () => {
  it('sin auth devuelve 401', async () => {
    const res = await post('/api/quiniela', {});
    expect(res.status).toBe(401);
  });

  it('con usuario no-admin devuelve 403', async () => {
    const res = await post('/api/quiniela', {}, userCookie);
    expect(res.status).toBe(403);
  });

  it('admin crea jornada de test correctamente', async () => {
    const body = {
      numero: 9999,
      descripcion: 'Jornada de test automático',
      fecha_jornada: '2099-12-31',
      fecha_limite: '2099-12-30T23:59:00',
      partidos: [
        { tipo: 'simple', orden: 1, equipo_local: 'Test A', equipo_visitante: 'Test B' },
        { tipo: 'simple', orden: 2, equipo_local: 'Test C', equipo_visitante: 'Test D' },
        { tipo: 'jornada', orden: 3, equipo_local: 'Test E', equipo_visitante: 'Test F' },
      ],
    };
    const res = await post('/api/quiniela', body, adminCookie);
    expect(res.status).toBe(201);
    const data = await res.json();
    testJornadaId = data.id;
    expect(testJornadaId).toBeTruthy();
  });
});

// ── Quiniela: detalle de jornada ──────────────────────────────────────────────

describe('GET /api/quiniela/[id]', () => {
  it('devuelve los datos de la jornada de test', async () => {
    const res = await get(`/api/quiniela/${testJornadaId}`, adminCookie);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.jornada.numero).toBe(9999);
    expect(data.partidos).toHaveLength(3);
    testPartidoIds = data.partidos.map((p) => p.id);
  });

  it('devuelve 404 para jornada inexistente', async () => {
    const res = await get('/api/quiniela/999999', adminCookie);
    expect(res.status).toBe(404);
  });
});

// ── Quiniela: enviar pronóstico ────────────────────────────────────────────────

describe('POST /api/quiniela/[id]/pronostico', () => {
  it('sin auth redirige al login', async () => {
    const res = await post(`/api/quiniela/${testJornadaId}/pronostico`, {}, '');
    // El middleware redirige (302) o la API devuelve 401
    expect([302, 401]).toContain(res.status);
  });

  it('usuario envía pronóstico correctamente', async () => {
    const pronosticos = {
      [testPartidoIds[0]]: '1',
      [testPartidoIds[1]]: 'X',
      [testPartidoIds[2]]: '2',
    };
    const res = await post(
      `/api/quiniela/${testJornadaId}/pronostico`,
      { pronosticos },
      userCookie
    );
    expect(res.status).toBe(200);
  });

  it('no puede enviar pronóstico dos veces', async () => {
    const pronosticos = {
      [testPartidoIds[0]]: '2',
      [testPartidoIds[1]]: '1',
      [testPartidoIds[2]]: 'X',
    };
    const res = await post(
      `/api/quiniela/${testJornadaId}/pronostico`,
      { pronosticos },
      userCookie
    );
    expect(res.status).toBe(409);
  });
});

// ── Quiniela: entrar resultados ───────────────────────────────────────────────

describe('POST /api/quiniela/[id]/resultado', () => {
  it('sin auth devuelve 401', async () => {
    const res = await post(`/api/quiniela/${testJornadaId}/resultado`, {});
    expect(res.status).toBe(401);
  });

  it('no-admin devuelve 403', async () => {
    const resultados = {
      [testPartidoIds[0]]: '1',
      [testPartidoIds[1]]: 'X',
      [testPartidoIds[2]]: '2',
    };
    const res = await post(
      `/api/quiniela/${testJornadaId}/resultado`,
      { resultados },
      userCookie
    );
    expect(res.status).toBe(403);
  });

  it('admin entra resultados y cambia estado a con_resultado', async () => {
    // Los resultados: david acertó simple1 (1) y jornada (2) → 20 pts
    const resultados = {
      [testPartidoIds[0]]: '1',
      [testPartidoIds[1]]: '2',
      [testPartidoIds[2]]: '2',
    };
    const res = await post(
      `/api/quiniela/${testJornadaId}/resultado`,
      { resultados },
      adminCookie
    );
    expect(res.status).toBe(200);
  });

  it('la jornada queda en estado con_resultado', async () => {
    const res = await get(`/api/quiniela/${testJornadaId}`, adminCookie);
    const data = await res.json();
    expect(data.jornada.estado).toBe('con_resultado');
  });

  it('no se pueden entrar resultados dos veces', async () => {
    const resultados = {
      [testPartidoIds[0]]: '1',
      [testPartidoIds[1]]: 'X',
      [testPartidoIds[2]]: '2',
    };
    const res = await post(
      `/api/quiniela/${testJornadaId}/resultado`,
      { resultados },
      adminCookie
    );
    expect(res.status).toBe(409);
  });
});

// ── Cleanup ───────────────────────────────────────────────────────────────────

afterAll(async () => {
  // Limpieza: borrar la jornada de test via PATCH para cerrarla
  // (no hay endpoint DELETE, se deja en la BD como jornada de test)
  // Esto es intencionado — puedes borrarla manualmente desde phpMyAdmin si quieres.
  console.log(`\n  ℹ️  Jornada de test creada con id=${testJornadaId} (núm. 9999). Puedes borrarla desde phpMyAdmin si quieres.`);
});

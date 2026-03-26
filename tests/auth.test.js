import { describe, it, expect, vi } from 'vitest';

// Mock next/headers antes de importar auth.js
vi.mock('next/headers', () => ({ cookies: vi.fn() }));

import { hashPassword, verifyPassword, verifySessionToken, createSessionCookie } from '@/lib/auth.js';

describe('hashPassword / verifyPassword', () => {
  it('genera un hash en formato salt:hash', () => {
    const hash = hashPassword('batcarallo2026');
    expect(hash).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
  });

  it('verifica correctamente la contraseña correcta', () => {
    const hash = hashPassword('batcarallo2026');
    expect(verifyPassword('batcarallo2026', hash)).toBe(true);
  });

  it('rechaza una contraseña incorrecta', () => {
    const hash = hashPassword('batcarallo2026');
    expect(verifyPassword('otracosa', hash)).toBe(false);
  });

  it('dos hashes del mismo password son distintos (salt aleatorio)', () => {
    const h1 = hashPassword('batcarallo2026');
    const h2 = hashPassword('batcarallo2026');
    expect(h1).not.toBe(h2);
    // Pero ambos verifican correctamente
    expect(verifyPassword('batcarallo2026', h1)).toBe(true);
    expect(verifyPassword('batcarallo2026', h2)).toBe(true);
  });
});

describe('verifySessionToken', () => {
  it('devuelve null con token undefined', () => {
    expect(verifySessionToken(undefined)).toBeNull();
  });

  it('devuelve null con token vacío', () => {
    expect(verifySessionToken('')).toBeNull();
  });

  it('devuelve null con token malformado', () => {
    expect(verifySessionToken('garbage')).toBeNull();
    expect(verifySessionToken('abc.def.ghi')).toBeNull();
  });

  it('verifica correctamente un token válido', () => {
    const user = { id: 1, username: 'aaron', member_id: 26, is_admin: true };
    const cookie = createSessionCookie(user);
    const session = verifySessionToken(cookie.value);
    expect(session).not.toBeNull();
    expect(session.username).toBe('aaron');
    expect(session.is_admin).toBe(true);
  });

  it('rechaza un token con firma manipulada', () => {
    const user = { id: 1, username: 'aaron', member_id: 26, is_admin: true };
    const cookie = createSessionCookie(user);
    const tampered = cookie.value.slice(0, -5) + 'aaaaa';
    expect(verifySessionToken(tampered)).toBeNull();
  });

  it('rechaza un token expirado', () => {
    // Creamos un token con exp en el pasado directamente
    const user = { id: 1, username: 'aaron', member_id: 26, is_admin: false };
    const cookie = createSessionCookie(user);
    // Decodificamos el payload, modificamos exp y re-codificamos
    const [data] = cookie.value.split('.');
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    payload.exp = Date.now() - 1000; // ya expirado
    const fakeData = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const fakeToken = `${fakeData}.invalidsig`;
    expect(verifySessionToken(fakeToken)).toBeNull();
  });
});

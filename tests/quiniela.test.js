import { describe, it, expect } from 'vitest';
import { calcularPuntuacion } from '@/lib/quiniela.js';

// Partidos de ejemplo: 2 simples + 1 jornada
const partidos = [
  { id: 1, tipo: 'simple', resultado: '1' },
  { id: 2, tipo: 'simple', resultado: 'X' },
  { id: 3, tipo: 'jornada', resultado: '2' },
];

describe('calcularPuntuacion', () => {
  it('devuelve 0 si no acierta ninguno', () => {
    const p = { 1: 'X', 2: '1', 3: '1' };
    expect(calcularPuntuacion(partidos, p)).toBe(0);
  });

  it('devuelve 20 si acierta 1 simple', () => {
    const p = { 1: '1', 2: '1', 3: '1' };
    expect(calcularPuntuacion(partidos, p)).toBe(20);
  });

  it('devuelve 20 si acierta el otro simple', () => {
    const p = { 1: 'X', 2: 'X', 3: '1' };
    expect(calcularPuntuacion(partidos, p)).toBe(20);
  });

  it('devuelve 50 si acierta los 2 simples pero falla jornada', () => {
    const p = { 1: '1', 2: 'X', 3: '1' };
    expect(calcularPuntuacion(partidos, p)).toBe(50);
  });

  it('devuelve 100 si acierta los 2 simples y el partido de jornada', () => {
    const p = { 1: '1', 2: 'X', 3: '2' };
    expect(calcularPuntuacion(partidos, p)).toBe(100);
  });

  it('devuelve 0 si solo acierta el partido de jornada', () => {
    const p = { 1: 'X', 2: '1', 3: '2' };
    expect(calcularPuntuacion(partidos, p)).toBe(0);
  });

  it('devuelve 20 si acierta 1 simple y el partido de jornada', () => {
    const p = { 1: '1', 2: '1', 3: '2' };
    expect(calcularPuntuacion(partidos, p)).toBe(20);
  });

  it('devuelve 0 si el objeto de pronósticos está vacío', () => {
    expect(calcularPuntuacion(partidos, {})).toBe(0);
  });

  it('ignora partidos sin resultado definido', () => {
    const partidosSinResultado = [
      { id: 1, tipo: 'simple', resultado: null },
      { id: 2, tipo: 'simple', resultado: null },
      { id: 3, tipo: 'jornada', resultado: null },
    ];
    const p = { 1: '1', 2: 'X', 3: '2' };
    expect(calcularPuntuacion(partidosSinResultado, p)).toBe(0);
  });

  it('funciona si no hay partido de jornada (solo simples)', () => {
    const soloSimples = [
      { id: 1, tipo: 'simple', resultado: '1' },
      { id: 2, tipo: 'simple', resultado: 'X' },
    ];
    const p = { 1: '1', 2: 'X' };
    expect(calcularPuntuacion(soloSimples, p)).toBe(50);
  });
});

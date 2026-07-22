-- ============================================================
-- Reset completo quiniela — ejecutar al inicio de nueva temporada
-- Borrar en orden para respetar foreign keys
-- ============================================================

DELETE FROM quiniela_pronosticos;
DELETE FROM quiniela_resultados;
DELETE FROM quiniela_partidos;
DELETE FROM quiniela_jornadas;

UPDATE users SET
  quiniela_eliminado     = FALSE,
  ausencias_consecutivas = 0,
  puntos_totales         = 0,
  puntos_mes             = 0,
  puntos_historicos      = 0,
  victorias_historicas   = 0;

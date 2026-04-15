-- ============================================================
-- Siembra puntos_historicos en users
-- Ejecutar en Supabase SQL Editor
--
-- Lógica: puntos_historicos = max(0, total_imagen - total_ya_en_db)
-- Así no se duplican los puntos de jornadas ya registradas.
-- ============================================================

-- 1. Añadir columna si no existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS puntos_historicos INT NOT NULL DEFAULT 0;

-- 2. Calcular y asignar
WITH totales_db AS (
  SELECT u.member_id, COALESCE(SUM(r.puntos), 0) AS web_total
  FROM users u
  LEFT JOIN quiniela_resultados r ON r.user_id = u.id
  GROUP BY u.id, u.member_id
),
objetivos (member_id, total_imagen) AS (
  VALUES
    (36, 900),   -- ANTONIO LARGO
    (27, 860),   -- ENUMA
    (14, 730),   -- ANGEL
    (43, 710),   -- ISOTOPOS
    (31, 710),   -- GANDALF
    (26, 710),   -- AARON
    (40, 690),   -- SEKO
    (33, 660),   -- ANTONIO BARROSO
    (30, 640),   -- LIDERESA
    (44, 630),   -- LEGENDARIO COLA
    (35, 610),   -- CARRAS
    (29, 580),   -- CARLOS CEJU
    (1,  520),   -- FICTICIUS
    (25, 510),   -- SPORTING MELENDRY
    (28, 490),   -- TUPAC
    (39, 470),   -- MORA (HANSI FLICK)
    (13, 440)    -- BATMINERO
)
UPDATE users u
SET puntos_historicos = GREATEST(0, o.total_imagen - t.web_total)
FROM totales_db t
JOIN objetivos o ON o.member_id = t.member_id
WHERE u.member_id = t.member_id;

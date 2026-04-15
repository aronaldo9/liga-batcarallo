-- ============================================================
-- Seed datos mensuales: resultados Q30, Q31 y victorias históricas
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Columna victorias_historicas
ALTER TABLE users ADD COLUMN IF NOT EXISTS victorias_historicas INT NOT NULL DEFAULT 0;

-- 2. Seed victorias (temporadas anteriores, excluyendo el mes en curso)
WITH v (member_id, victorias) AS (
  VALUES
    (36, 2),  -- ANTONIO LARGO
    (27, 1),  -- ENUMA
    (14, 2),  -- ANGEL
    (43, 0),  -- ISOTOPOS
    (31, 0),  -- GANDALF
    (26, 0),  -- AARON
    (40, 0),  -- SEKO
    (33, 1),  -- ANTONIO BARROSO
    (30, 1),  -- LIDERESA
    (44, 0),  -- LEGENDARIO COLA
    (35, 0),  -- CARRAS
    (29, 0),  -- CARLOS CEJU
    (1,  0),  -- FICTICIUS
    (25, 1),  -- SPORTING MELENDRY
    (28, 0),  -- TUPAC
    (39, 0),  -- MORA
    (13, 0)   -- BATMINERO
)
UPDATE users u
SET victorias_historicas = v.victorias
FROM v
WHERE u.member_id = v.member_id;

-- 3. Upsert resultados Q30
WITH puntos (member_id, pts) AS (
  VALUES
    (36,  50),  -- ANTONIO LARGO
    (27, 100),  -- ENUMA
    (14,  50),  -- ANGEL
    (43,  50),  -- ISOTOPOS
    (31,  20),  -- GANDALF
    (26, 100),  -- AARON
    (40,  20),  -- SEKO
    (33,  50),  -- ANTONIO BARROSO
    (30,  50),  -- LIDERESA
    (44, 100),  -- LEGENDARIO COLA
    (35,  50),  -- CARRAS
    (29,  20),  -- CARLOS CEJU
    (1,   50),  -- FICTICIUS
    (25,  20),  -- SPORTING MELENDRY
    (28, 100),  -- TUPAC
    (39,  20),  -- MORA
    (13,  50)   -- BATMINERO
)
INSERT INTO quiniela_resultados (jornada_id, user_id, puntos)
SELECT
  (SELECT id FROM quiniela_jornadas WHERE numero = 30),
  u.id,
  p.pts
FROM puntos p
JOIN users u ON u.member_id = p.member_id
ON CONFLICT (jornada_id, user_id) DO UPDATE SET puntos = EXCLUDED.puntos;

-- 4. Upsert resultados Q31
WITH puntos (member_id, pts) AS (
  VALUES
    (36, 20),  -- ANTONIO LARGO
    (27,  0),  -- ENUMA
    (14, 20),  -- ANGEL
    (43, 20),  -- ISOTOPOS
    (31, 20),  -- GANDALF
    (26,  0),  -- AARON
    (40, 20),  -- SEKO
    (33,  0),  -- ANTONIO BARROSO
    (30,  0),  -- LIDERESA
    (44,  0),  -- LEGENDARIO COLA
    (35,  0),  -- CARRAS
    (29,  0),  -- CARLOS CEJU
    (1,  20),  -- FICTICIUS
    (25,  0),  -- SPORTING MELENDRY
    (28, 20),  -- TUPAC
    (39, 20),  -- MORA
    (13,  0)   -- BATMINERO
)
INSERT INTO quiniela_resultados (jornada_id, user_id, puntos)
SELECT
  (SELECT id FROM quiniela_jornadas WHERE numero = 31),
  u.id,
  p.pts
FROM puntos p
JOIN users u ON u.member_id = p.member_id
ON CONFLICT (jornada_id, user_id) DO UPDATE SET puntos = EXCLUDED.puntos;

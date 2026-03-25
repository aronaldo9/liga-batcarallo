-- Liga Batcarallo - Schema
CREATE DATABASE IF NOT EXISTS liga_batcarallo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE liga_batcarallo;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cada jornada de quiniela
CREATE TABLE IF NOT EXISTS quiniela_jornadas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero INT NOT NULL,
  descripcion VARCHAR(255),
  fecha_jornada DATE NOT NULL,
  fecha_limite DATETIME NOT NULL,
  estado ENUM('abierta', 'cerrada', 'con_resultado') DEFAULT 'abierta',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3 partidos por jornada: 2 simples + 1 partido de jornada
CREATE TABLE IF NOT EXISTS quiniela_partidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jornada_id INT NOT NULL,
  tipo ENUM('simple', 'jornada') NOT NULL,
  orden INT NOT NULL,
  equipo_local VARCHAR(100) NOT NULL,
  equipo_visitante VARCHAR(100) NOT NULL,
  resultado ENUM('1', 'X', '2') NULL DEFAULT NULL,
  FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE
);

-- Pronósticos de cada usuario
CREATE TABLE IF NOT EXISTS quiniela_pronosticos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jornada_id INT NOT NULL,
  user_id INT NOT NULL,
  partido_id INT NOT NULL,
  pronostico ENUM('1', 'X', '2') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_pronostico (user_id, partido_id),
  FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (partido_id) REFERENCES quiniela_partidos(id) ON DELETE CASCADE
);

-- Puntuaciones calculadas al entrar resultados
CREATE TABLE IF NOT EXISTS quiniela_resultados (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jornada_id INT NOT NULL,
  user_id INT NOT NULL,
  puntos INT NOT NULL DEFAULT 0,
  UNIQUE KEY unique_resultado (jornada_id, user_id),
  FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

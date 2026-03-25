import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { miembros } from '@/data/miembros';

// IDs de admin (Aaron=26, Ángel=14, David=13) — admin de página solo Aaron
const PAGE_ADMIN_IDS = [26];

// Usuarios a excluir (vacantes)
const EXCLUIR_NOMBRES = ['Vacante'];

function toUsername(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      member_id INT NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(200) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_jornadas (
      id INT PRIMARY KEY AUTO_INCREMENT,
      numero INT NOT NULL,
      descripcion VARCHAR(255),
      fecha_jornada DATE NOT NULL,
      fecha_limite DATETIME NOT NULL,
      estado ENUM('abierta', 'cerrada', 'con_resultado') DEFAULT 'abierta',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_partidos (
      id INT PRIMARY KEY AUTO_INCREMENT,
      jornada_id INT NOT NULL,
      tipo ENUM('simple', 'jornada') NOT NULL,
      orden INT NOT NULL,
      equipo_local VARCHAR(100) NOT NULL,
      equipo_visitante VARCHAR(100) NOT NULL,
      resultado ENUM('1', 'X', '2') NULL DEFAULT NULL,
      FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE
    )
  `);
  await db.query(`
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
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_resultados (
      id INT PRIMARY KEY AUTO_INCREMENT,
      jornada_id INT NOT NULL,
      user_id INT NOT NULL,
      puntos INT NOT NULL DEFAULT 0,
      UNIQUE KEY unique_resultado (jornada_id, user_id),
      FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

export async function POST() {
  try {
    await createTables();

    const [existing] = await db.query('SELECT COUNT(*) as count FROM users');
    if (existing[0].count > 0) {
      return NextResponse.json(
        { error: 'Los usuarios ya existen. Setup solo se ejecuta una vez.' },
        { status: 409 }
      );
    }

    const defaultPassword = 'batcarallo';
    const miembrosValidos = miembros.filter((m) => !EXCLUIR_NOMBRES.includes(m.nombre));

    // Detectar usernames duplicados (ej: dos "Antonio") y añadir sufijo
    const usernameCounts = {};
    const usernameMap = miembrosValidos.map((m) => {
      const base = toUsername(m.nombre);
      usernameCounts[base] = (usernameCounts[base] || 0) + 1;
      return { member: m, base };
    });
    const usernameCounters = {};
    const usuarios = usernameMap.map(({ member, base }) => {
      if (usernameCounts[base] > 1) {
        usernameCounters[base] = (usernameCounters[base] || 0) + 1;
        return { member, username: `${base}${usernameCounters[base]}` };
      }
      return { member, username: base };
    });

    const rows = await Promise.all(
      usuarios.map(async ({ member, username }) => {
        const hash = hashPassword(defaultPassword);
        const isAdmin = PAGE_ADMIN_IDS.includes(member.id) ? 1 : 0;
        await db.query(
          'INSERT INTO users (member_id, username, password_hash, is_admin) VALUES (?, ?, ?, ?)',
          [member.id, username, hash, isAdmin]
        );
        return { username, member_id: member.id, is_admin: isAdmin };
      })
    );

    return NextResponse.json({
      ok: true,
      mensaje: `${rows.length} usuarios creados con contraseña por defecto: "${defaultPassword}"`,
      usuarios: rows,
    });
  } catch (err) {
    console.error('Setup error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

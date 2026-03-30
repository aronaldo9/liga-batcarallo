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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      member_id INT NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(200) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      quiniela_eliminado BOOLEAN NOT NULL DEFAULT FALSE,
      ausencias_consecutivas INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_jornadas (
      id SERIAL PRIMARY KEY,
      numero INT NOT NULL,
      descripcion VARCHAR(255),
      fecha_jornada DATE NOT NULL,
      fecha_limite TIMESTAMP NOT NULL,
      estado VARCHAR(20) DEFAULT 'abierta' CHECK (estado IN ('abierta', 'cerrada', 'con_resultado')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_partidos (
      id SERIAL PRIMARY KEY,
      jornada_id INT NOT NULL,
      tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('simple', 'jornada')),
      orden INT NOT NULL,
      equipo_local VARCHAR(100) NOT NULL,
      equipo_visitante VARCHAR(100) NOT NULL,
      resultado VARCHAR(2) DEFAULT NULL CHECK (resultado IN ('1', 'X', '2')),
      FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_pronosticos (
      id SERIAL PRIMARY KEY,
      jornada_id INT NOT NULL,
      user_id INT NOT NULL,
      partido_id INT NOT NULL,
      pronostico VARCHAR(2) NOT NULL CHECK (pronostico IN ('1', 'X', '2')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, partido_id),
      FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (partido_id) REFERENCES quiniela_partidos(id) ON DELETE CASCADE
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS quiniela_resultados (
      id SERIAL PRIMARY KEY,
      jornada_id INT NOT NULL,
      user_id INT NOT NULL,
      puntos INT NOT NULL DEFAULT 0,
      UNIQUE (jornada_id, user_id),
      FOREIGN KEY (jornada_id) REFERENCES quiniela_jornadas(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

export async function POST() {
  try {
    await createTables();

    const [existing] = await db.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(existing[0].count) > 0) {
      return NextResponse.json(
        { error: 'Los usuarios ya existen. Setup solo se ejecuta una vez.' },
        { status: 409 }
      );
    }

    const defaultPassword = 'batcarallo2026';
    const miembrosValidos = miembros.filter((m) => !EXCLUIR_NOMBRES.includes(m.nombre));

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
        const isAdmin = PAGE_ADMIN_IDS.includes(member.id);
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

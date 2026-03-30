import { Pool } from 'pg';

const globalForDb = globalThis;

if (!globalForDb._dbPool) {
  globalForDb._dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

const pool = globalForDb._dbPool;

// Wrapper que convierte ? a $1, $2... y devuelve [rows] como mysql2
const db = {
  async query(sql, params = []) {
    let i = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++i}`);
    const result = await pool.query(pgSql, params);
    return [result.rows];
  },
};

export default db;

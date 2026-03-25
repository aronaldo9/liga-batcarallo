import mysql from 'mysql2/promise';

// Singleton para evitar múltiples pools en hot reload de Next.js
const globalForDb = globalThis;

if (!globalForDb._dbPool) {
  globalForDb._dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'liga_batcarallo',
    waitForConnections: true,
    connectionLimit: 10,
    timezone: '+00:00',
  });
}

export default globalForDb._dbPool;

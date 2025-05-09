const pool = require('../config/db.js'); // pastikan ini meng-export pool
const testConnection = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 AS val');

    console.log('✅ Database connected. Test result:', rows);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    if (conn) conn.release();
  }
};

// Jalankan hanya kalau file ini dieksekusi langsung
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
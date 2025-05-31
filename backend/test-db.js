const db = require('./config/db');

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('DB Test OK:', rows[0]);
  } catch (err) {
    console.error('DB Connection failed:', err);
  }
}

testConnection();

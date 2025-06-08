const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function connectDB() {
  try {
    await pool.connect();
    console.log('✅ Connected to the database');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
}

module.exports = {pool, connectDB};

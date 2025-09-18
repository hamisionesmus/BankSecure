const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6v4KrEMDJNqt@ep-tiny-pond-adclgmi5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;
  const query = 'SELECT * FROM accounts WHERE customer_id = $1';

  try {
    const result = await pool.query(query, [customerId]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).json({ error: err.message });
  }
}
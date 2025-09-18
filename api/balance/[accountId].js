const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6v4KrEMDJNqt@ep-tiny-pond-adclgmi5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accountId } = req.query;
  const query = 'SELECT balance FROM accounts WHERE id = $1';

  try {
    const result = await pool.query(query, [accountId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).json({ error: err.message });
  }
}
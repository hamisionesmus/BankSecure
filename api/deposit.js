const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6v4KrEMDJNqt@ep-tiny-pond-adclgmi5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('💰 Deposit request received:', req.body);
  const { accountId, amount } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update balance
    const updateQuery = 'UPDATE accounts SET balance = balance + $1 WHERE id = $2';
    await client.query(updateQuery, [amount, accountId]);

    // Log transaction
    const transQuery = 'INSERT INTO transactions (type, amount, account_id) VALUES ($1, $2, $3)';
    console.log('📝 Logging deposit transaction:', { type: 'deposit', amount, accountId });
    await client.query(transQuery, ['deposit', amount, accountId]);

    await client.query('COMMIT');
    console.log('✅ Deposit transaction completed successfully');
    res.json({ success: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
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
  console.log('📊 Transaction history request for account:', accountId);

  // Ensure accountId is a valid number
  const accountIdNum = parseInt(accountId);
  if (isNaN(accountIdNum)) {
    console.error('❌ Invalid account ID:', accountId);
    return res.status(400).json({ error: 'Invalid account ID' });
  }

  const query = 'SELECT id, type, amount, date, account_id FROM transactions WHERE account_id = $1 ORDER BY date DESC LIMIT 10';
  console.log('🔍 Executing transaction history query:', query, 'with accountId:', accountIdNum);

  try {
    const result = await pool.query(query, [accountIdNum]);
    console.log('✅ Transaction history retrieved:', result.rows.length, 'transactions');
    console.log('📋 Transaction data:', JSON.stringify(result.rows, null, 2));

    // Ensure we return an array even if empty
    res.setHeader('Content-Type', 'application/json');
    res.json(result.rows || []);
  } catch (err) {
    console.error('❌ Error fetching transaction history:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
}
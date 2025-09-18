const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6v4KrEMDJNqt@ep-tiny-pond-adclgmi5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('💸 Transfer request received:', req.body);
  const { fromAccountId, toAccountNumber, amount } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check sender's balance
    const senderQuery = 'SELECT balance FROM accounts WHERE id = $1';
    const senderResult = await client.query(senderQuery, [fromAccountId]);

    if (senderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.json({ success: false, message: 'Sender account not found' });
    }

    if (senderResult.rows[0].balance < amount) {
      await client.query('ROLLBACK');
      return res.json({ success: false, message: 'Insufficient funds' });
    }

    // Check recipient account exists
    const recipientQuery = 'SELECT id FROM accounts WHERE account_number = $1';
    const recipientResult = await client.query(recipientQuery, [toAccountNumber]);

    if (recipientResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.json({ success: false, message: 'Recipient account not found' });
    }

    const recipientId = recipientResult.rows[0].id;

    // Prevent self-transfer
    if (fromAccountId === recipientId) {
      await client.query('ROLLBACK');
      return res.json({ success: false, message: 'Cannot transfer to the same account' });
    }

    // Update sender balance
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromAccountId]
    );

    // Update recipient balance
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, recipientId]
    );

    // Log transaction for sender
    await client.query(
      'INSERT INTO transactions (type, amount, account_id) VALUES ($1, $2, $3)',
      ['transfer', amount, fromAccountId]
    );

    await client.query('COMMIT');
    console.log('✅ Transfer completed successfully');
    res.json({ success: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
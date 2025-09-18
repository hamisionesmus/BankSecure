import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // PostgreSQL client for Neon
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_6v4KrEMDJNqt@ep-tiny-pond-adclgmi5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔐 Authentication request received');

    const { cardNumber, pin } = req.body;
    console.log('Parsed cardNumber:', cardNumber);

    // Query PostgreSQL database
    const result = await client.query(
      'SELECT id, name, card_number FROM customers WHERE card_number = $1 AND pin = $2',
      [cardNumber, pin]
    );

    if (result.rows.length > 0) {
      console.log('✅ Authentication successful for:', result.rows[0].name);
      return res.status(200).json({
        success: true,
        customer: result.rows[0]
      });
    } else {
      console.log('❌ Authentication failed - invalid credentials');
      return res.status(200).json({
        success: false,
        message: 'Invalid card number or PIN'
      });
    }
  } catch (error) {
    console.error('❌ Database error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      message: error.message
    });
  } finally {
    await client.end();
  }
}
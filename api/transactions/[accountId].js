import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iuvcxrsmgaahqmdmzoau.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

  try {
    console.log('🔍 Fetching transaction history from Supabase');

    const { data, error } = await supabase
      .from('transactions')
      .select('id, type, amount, date, account_id')
      .eq('account_id', accountIdNum)
      .order('date', { ascending: false })
      .limit(10);

    if (error) {
      console.log('❌ Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    console.log('✅ Transaction history retrieved:', data?.length || 0, 'transactions');
    console.log('📋 Transaction data:', JSON.stringify(data, null, 2));

    // Ensure we return an array even if empty
    res.setHeader('Content-Type', 'application/json');
    res.json(data || []);

  } catch (err) {
    console.error('❌ Transaction history error:', err);
    res.status(500).json({ error: 'Transaction service error', message: err.message });
  }
}
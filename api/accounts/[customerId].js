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

  const { customerId } = req.query;

  try {
    console.log('🏦 Fetching accounts for customer:', customerId);

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('customer_id', customerId);

    if (error) {
      console.log('❌ Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }

    console.log('✅ Accounts retrieved:', data?.length || 0, 'accounts');
    res.json(data || []);

  } catch (err) {
    console.error('❌ Accounts fetch error:', err);
    res.status(500).json({ error: 'Accounts service error', message: err.message });
  }
}
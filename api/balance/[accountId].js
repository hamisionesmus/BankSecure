const { createClient } = require('@supabase/supabase-js');

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

  // Supabase client configuration
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: 'Supabase configuration missing',
      message: 'SUPABASE_URL and SUPABASE_ANON_KEY environment variables required'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { accountId } = req.query;

  try {
    console.log('💰 Balance request for account:', accountId);

    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .single();

    if (error) {
      console.log('❌ Supabase query error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Account not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch balance' });
    }

    if (!data) {
      console.log('❌ Account not found');
      return res.status(404).json({ error: 'Account not found' });
    }

    console.log('✅ Balance retrieved:', data.balance);
    res.json({ balance: data.balance });

  } catch (err) {
    console.error('❌ Balance fetch error:', err);
    res.status(500).json({ error: 'Balance service error', message: err.message });
  }
}
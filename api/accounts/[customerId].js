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
  const supabaseUrl = process.env.SUPABASE_URL || 'https://iuvcxrsmgaahqmdmzoau.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dmN4cnNtZ2FhaHFtZG16b2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTI0NzIsImV4cCI6MjA3Mzc2ODQ3Mn0.NQW58uk4YPUiCG4_weoJ1pXXG5Ew872u-zj6uwwrSLQ';

  const supabase = createClient(supabaseUrl, supabaseKey);

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
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('💰 Deposit request received:', req.body);
  const { accountId, amount } = req.body;

  try {
    // Get current balance
    const { data: account, error: balanceError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .single();

    if (balanceError || !account) {
      console.log('❌ Account not found:', balanceError);
      return res.json({ success: false, message: 'Account not found' });
    }

    // Update balance
    const newBalance = account.balance + amount;
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);

    if (updateError) {
      console.log('❌ Balance update failed:', updateError);
      return res.status(500).json({ error: 'Failed to update balance' });
    }

    // Log transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        type: 'deposit',
        amount: amount,
        account_id: accountId
      });

    if (transactionError) {
      console.log('❌ Transaction logging failed:', transactionError);
    }

    console.log('✅ Deposit transaction completed successfully');
    res.json({ success: true });

  } catch (err) {
    console.error('❌ Deposit error:', err);
    res.status(500).json({ error: 'Deposit service error', message: err.message });
  }
}
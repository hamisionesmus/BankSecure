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

  console.log('💰 Withdraw request received:', req.body);
  const { accountId, amount } = req.body;

  try {
    // Check balance first
    const { data: account, error: balanceError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .single();

    if (balanceError || !account) {
      console.log('❌ Account not found:', balanceError);
      return res.json({ success: false, message: 'Account not found' });
    }

    if (account.balance < amount) {
      console.log('❌ Insufficient funds:', { balance: account.balance, requested: amount });
      return res.json({ success: false, message: 'Insufficient funds' });
    }

    // Update balance
    const newBalance = account.balance - amount;
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
        type: 'withdraw',
        amount: amount,
        account_id: accountId
      });

    if (transactionError) {
      console.log('❌ Transaction logging failed:', transactionError);
      // Note: Balance was already updated, but transaction logging failed
      // In production, you might want to implement a compensation mechanism
    }

    console.log('✅ Withdrawal transaction completed successfully');
    res.json({ success: true });

  } catch (err) {
    console.error('❌ Withdrawal error:', err);
    res.status(500).json({ error: 'Withdrawal service error', message: err.message });
  }
}
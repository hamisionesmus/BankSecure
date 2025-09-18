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

  console.log('💸 Transfer request received:', req.body);
  const { fromAccountId, toAccountNumber, amount } = req.body;

  try {
    // Check sender's balance
    const { data: senderAccount, error: senderError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', fromAccountId)
      .single();

    if (senderError || !senderAccount) {
      console.log('❌ Sender account not found:', senderError);
      return res.json({ success: false, message: 'Sender account not found' });
    }

    if (senderAccount.balance < amount) {
      console.log('❌ Insufficient funds:', { balance: senderAccount.balance, requested: amount });
      return res.json({ success: false, message: 'Insufficient funds' });
    }

    // Check recipient account exists
    const { data: recipientAccount, error: recipientError } = await supabase
      .from('accounts')
      .select('id')
      .eq('account_number', toAccountNumber)
      .single();

    if (recipientError || !recipientAccount) {
      console.log('❌ Recipient account not found:', recipientError);
      return res.json({ success: false, message: 'Recipient account not found' });
    }

    const recipientId = recipientAccount.id;

    // Prevent self-transfer
    if (fromAccountId === recipientId) {
      console.log('❌ Self-transfer attempted');
      return res.json({ success: false, message: 'Cannot transfer to the same account' });
    }

    // Update sender balance
    const senderNewBalance = senderAccount.balance - amount;
    const { error: senderUpdateError } = await supabase
      .from('accounts')
      .update({ balance: senderNewBalance })
      .eq('id', fromAccountId);

    if (senderUpdateError) {
      console.log('❌ Sender balance update failed:', senderUpdateError);
      return res.status(500).json({ error: 'Failed to update sender balance' });
    }

    // Update recipient balance
    const { data: recipientData, error: recipientBalanceError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', recipientId)
      .single();

    if (recipientBalanceError || !recipientData) {
      console.log('❌ Failed to get recipient balance:', recipientBalanceError);
      return res.status(500).json({ error: 'Failed to get recipient balance' });
    }

    const recipientNewBalance = recipientData.balance + amount;
    const { error: recipientUpdateError } = await supabase
      .from('accounts')
      .update({ balance: recipientNewBalance })
      .eq('id', recipientId);

    if (recipientUpdateError) {
      console.log('❌ Recipient balance update failed:', recipientUpdateError);
      return res.status(500).json({ error: 'Failed to update recipient balance' });
    }

    // Log transaction for sender
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        type: 'transfer',
        amount: amount,
        account_id: fromAccountId
      });

    if (transactionError) {
      console.log('❌ Transaction logging failed:', transactionError);
    }

    console.log('✅ Transfer completed successfully');
    res.json({ success: true });

  } catch (err) {
    console.error('❌ Transfer error:', err);
    res.status(500).json({ error: 'Transfer service error', message: err.message });
  }
}
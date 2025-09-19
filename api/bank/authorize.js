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

  try {
    console.log('🏦 Bank transaction authorization request received:', req.body);
    const { transactionType, accountId, amount, cardNumber } = req.body;

    // Validate transaction type
    const validTypes = ['withdraw', 'deposit', 'transfer'];
    if (!validTypes.includes(transactionType)) {
      return res.json({
        success: false,
        message: 'Invalid transaction type'
      });
    }

    // Check if account exists and belongs to the card
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, balance, customer_id')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      console.log('❌ Account not found:', accountError);
      return res.json({
        success: false,
        message: 'Account not found'
      });
    }

    // Verify card belongs to account owner
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, card_number')
      .eq('id', account.customer_id)
      .single();

    if (customerError || customer.card_number !== cardNumber) {
      console.log('❌ Card verification failed');
      return res.json({
        success: false,
        message: 'Card verification failed'
      });
    }

    // Authorization logic based on transaction type
    let authorized = false;
    let message = '';

    switch (transactionType) {
      case 'withdraw':
        if (account.balance >= amount) {
          authorized = true;
          message = 'Withdrawal authorized';
        } else {
          authorized = false;
          message = 'Insufficient funds';
        }
        break;

      case 'deposit':
        authorized = true;
        message = 'Deposit authorized';
        break;

      case 'transfer':
        if (account.balance >= amount) {
          authorized = true;
          message = 'Transfer authorized';
        } else {
          authorized = false;
          message = 'Insufficient funds for transfer';
        }
        break;
    }

    console.log(`✅ Bank authorization ${authorized ? 'approved' : 'denied'}: ${message}`);

    res.json({
      success: true,
      authorized,
      message,
      account: {
        id: account.id,
        balance: account.balance
      }
    });

  } catch (err) {
    console.error('❌ Bank authorization error:', err);
    res.status(500).json({ error: 'Bank authorization service error', message: err.message });
  }
}
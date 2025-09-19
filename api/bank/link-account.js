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
    console.log('🔗 Bank account linking request received:', req.body);
    const { cardNumber } = req.body;

    if (!cardNumber) {
      return res.json({
        success: false,
        message: 'Card number is required'
      });
    }

    // Find customer by card number
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, name, card_number')
      .eq('card_number', cardNumber)
      .single();

    if (customerError || !customer) {
      console.log('❌ Customer not found for card:', cardNumber);
      return res.json({
        success: false,
        message: 'Card not found in system'
      });
    }

    // Get all accounts for this customer
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('customer_id', customer.id);

    if (accountsError) {
      console.log('❌ Error fetching accounts:', accountsError);
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }

    if (!accounts || accounts.length === 0) {
      console.log('❌ No accounts found for customer');
      return res.json({
        success: false,
        message: 'No accounts found for this card'
      });
    }

    console.log(`✅ Account linking successful for ${customer.name}: ${accounts.length} accounts found`);

    res.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        cardNumber: customer.card_number
      },
      accounts: accounts.map(account => ({
        id: account.id,
        accountNumber: account.account_number,
        balance: parseFloat(account.balance),
        type: account.type
      })),
      message: `Found ${accounts.length} account(s) linked to card ${cardNumber}`
    });

  } catch (err) {
    console.error('❌ Bank account linking error:', err);
    res.status(500).json({ error: 'Bank account linking service error', message: err.message });
  }
}
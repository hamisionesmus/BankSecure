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
    console.log('🔐 Authentication request received');

    const { cardNumber, pin } = req.body;
    console.log('Parsed cardNumber:', cardNumber);

    // Query Supabase database
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, card_number')
      .eq('card_number', cardNumber)
      .eq('pin', pin)
      .single();

    if (error) {
      console.log('❌ Supabase query error:', error);
      return res.status(200).json({
        success: false,
        message: 'Invalid card number or PIN'
      });
    }

    if (data) {
      console.log('✅ Authentication successful for:', data.name);
      return res.status(200).json({
        success: true,
        customer: data
      });
    } else {
      console.log('❌ Authentication failed - no matching customer');
      return res.status(200).json({
        success: false,
        message: 'Invalid card number or PIN'
      });
    }
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication service error',
      message: error.message
    });
  }
}
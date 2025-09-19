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
    console.log('🔄 ATM replenishment request received:', req.body);
    const { atmId, technicianId, supplies } = req.body;

    // Update ATM supplies status
    const suppliesStatus = supplies.cash ? 'Cash replenished' :
                          supplies.ink ? 'Ink replenished' :
                          supplies.paper ? 'Paper replenished' : 'Supplies OK';

    const { error: updateError } = await supabase
      .from('atms')
      .update({
        supplies_status: suppliesStatus,
        cash_available: supplies.cash || undefined,
        last_maintenance: new Date().toISOString()
      })
      .eq('id', atmId);

    if (updateError) {
      console.log('❌ ATM update failed:', updateError);
      return res.status(500).json({ error: 'Failed to update ATM supplies' });
    }

    // Log maintenance activity
    const { error: logError } = await supabase
      .from('maintenance')
      .insert({
        maintenance_type: 'replenish',
        description: `ATM replenished: ${suppliesStatus}`,
        technician_id: technicianId,
        atm_id: atmId,
        notes: `Supplies: ${JSON.stringify(supplies)}`
      });

    if (logError) {
      console.log('⚠️ Maintenance logging failed:', logError);
      // Don't fail the request if logging fails
    }

    console.log('✅ ATM replenishment completed successfully');
    res.json({
      success: true,
      message: 'ATM replenished successfully',
      suppliesStatus
    });

  } catch (err) {
    console.error('❌ Replenishment error:', err);
    res.status(500).json({ error: 'Replenishment service error', message: err.message });
  }
}
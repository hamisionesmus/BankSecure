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
    console.log('⬆️ ATM upgrade request received:', req.body);
    const { atmId, technicianId, upgradeType, version } = req.body;

    // Validate upgrade type
    const validTypes = ['hardware', 'software', 'firmware'];
    if (!validTypes.includes(upgradeType)) {
      return res.json({
        success: false,
        message: 'Invalid upgrade type. Must be: hardware, software, or firmware'
      });
    }

    // Update ATM with upgrade info
    const upgradeNotes = `${upgradeType} upgraded to ${version || 'latest'}`;
    const { error: updateError } = await supabase
      .from('atms')
      .update({
        supplies_status: `Upgraded: ${upgradeNotes}`,
        last_maintenance: new Date().toISOString()
      })
      .eq('id', atmId);

    if (updateError) {
      console.log('❌ ATM upgrade update failed:', updateError);
      return res.status(500).json({ error: 'Failed to update ATM upgrade status' });
    }

    // Log upgrade activity
    const { error: logError } = await supabase
      .from('maintenance')
      .insert({
        maintenance_type: 'upgrade',
        description: `ATM ${upgradeType} upgrade performed`,
        technician_id: technicianId,
        atm_id: atmId,
        notes: upgradeNotes,
        status: 'completed'
      });

    if (logError) {
      console.log('⚠️ Upgrade logging failed:', logError);
    }

    console.log('✅ ATM upgrade completed successfully');
    res.json({
      success: true,
      message: `ATM ${upgradeType} upgrade completed successfully`,
      upgradeDetails: {
        type: upgradeType,
        version: version || 'latest',
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('❌ Upgrade error:', err);
    res.status(500).json({ error: 'Upgrade service error', message: err.message });
  }
}
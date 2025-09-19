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
    console.log('🔍 ATM diagnostics request received:', req.body);
    const { atmId, technicianId } = req.body;

    // Get ATM current status
    const { data: atm, error: atmError } = await supabase
      .from('atms')
      .select('*')
      .eq('id', atmId)
      .single();

    if (atmError || !atm) {
      console.log('❌ ATM not found:', atmError);
      return res.json({ success: false, message: 'ATM not found' });
    }

    // Perform diagnostic checks
    const diagnostics = {
      atmId: atm.atm_id,
      location: atm.location,
      operational: atm.is_operational,
      suppliesStatus: atm.supplies_status,
      cashAvailable: atm.cash_available,
      lastMaintenance: atm.last_maintenance,
      issues: []
    };

    // Check for issues
    if (atm.cash_available < 1000) {
      diagnostics.issues.push('Low cash reserves');
    }
    if (!atm.is_operational) {
      diagnostics.issues.push('ATM marked as non-operational');
    }
    if (atm.supplies_status !== 'OK') {
      diagnostics.issues.push(`Supplies issue: ${atm.supplies_status}`);
    }

    // Calculate health score
    let healthScore = 100;
    if (diagnostics.issues.length > 0) {
      healthScore -= diagnostics.issues.length * 20;
    }
    diagnostics.healthScore = Math.max(0, healthScore);

    // Log diagnostic activity
    const { error: logError } = await supabase
      .from('maintenance')
      .insert({
        maintenance_type: 'diagnose',
        description: `ATM diagnostics performed - Health: ${healthScore}%`,
        technician_id: technicianId,
        atm_id: atmId,
        notes: `Issues found: ${diagnostics.issues.join(', ') || 'None'}`,
        status: diagnostics.issues.length > 0 ? 'issues_found' : 'healthy'
      });

    if (logError) {
      console.log('⚠️ Diagnostic logging failed:', logError);
    }

    console.log('✅ ATM diagnostics completed:', diagnostics);
    res.json({
      success: true,
      diagnostics,
      message: diagnostics.issues.length > 0 ?
        `Diagnostics completed. ${diagnostics.issues.length} issues found.` :
        'ATM diagnostics completed. All systems healthy.'
    });

  } catch (err) {
    console.error('❌ Diagnostics error:', err);
    res.status(500).json({ error: 'Diagnostics service error', message: err.message });
  }
}
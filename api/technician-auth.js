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
    console.log('🔧 Technician authentication request received');

    const { technicianId, pin } = req.body;
    console.log('Parsed technicianId:', technicianId);

    // For now, we'll use a simple PIN-based authentication
    // In production, this should be more secure
    const { data, error } = await supabase
      .from('technicians')
      .select('id, technician_id, name, contact_info, assigned_bank')
      .eq('technician_id', technicianId)
      .single();

    if (error) {
      console.log('❌ Supabase query error:', error);
      return res.status(200).json({
        success: false,
        message: 'Invalid technician ID'
      });
    }

    if (data) {
      // Simple PIN validation - in production use proper authentication
      if (pin === 'tech123') { // Default technician PIN
        console.log('✅ Technician authentication successful for:', data.name);
        return res.status(200).json({
          success: true,
          technician: data
        });
      } else {
        console.log('❌ Invalid PIN for technician');
        return res.status(200).json({
          success: false,
          message: 'Invalid PIN'
        });
      }
    } else {
      console.log('❌ Technician not found');
      return res.status(200).json({
        success: false,
        message: 'Technician not found'
      });
    }
  } catch (error) {
    console.error('❌ Technician authentication error:', error);
    return res.status(500).json({
      error: 'Technician authentication service error',
      message: error.message
    });
  }
}
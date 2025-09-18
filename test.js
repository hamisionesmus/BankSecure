export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    console.log('🧪 Test API called');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);

    return res.status(200).json({
      success: true,
      message: 'API is working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });

  } catch (error) {
    console.error('❌ Test API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
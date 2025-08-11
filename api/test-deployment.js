// api/test-deployment.js - Simple test endpoint to verify deployment
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const testData = {
      status: 'success',
      message: 'API deployment is working correctly',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent']
      },
      vercel_region: process.env.VERCEL_REGION || 'unknown',
      runtime: 'nodejs22.x'
    };

    console.log('Test deployment endpoint called:', testData);
    
    res.status(200).json(testData);
  } catch (error) {
    console.error('Test deployment error:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

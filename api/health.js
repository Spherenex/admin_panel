// Simple health check endpoint for Vercel with Node.js 22.x support

// Ensure compatibility with Node.js 22.x
if (typeof globalThis === 'undefined') {
  global.globalThis = global;
}

module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Return detailed health status
    const healthData = {
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      server_info: {
        platform: 'vercel',
        runtime: 'nodejs22.x',
        razorpay_configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
      }
    };

    console.log('Health check response:', healthData);
    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
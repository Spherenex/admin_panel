// Simple health check endpoint for Vercel with Node.js 22.x support

// Ensure compatibility with Node.js 22.x
if (typeof globalThis === 'undefined') {
  global.globalThis = global;
}

module.exports = async (req, res) => {
  try {
    // Set comprehensive CORS headers for production
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    res.setHeader('Content-Type', 'application/json');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow GET requests for health check
    if (req.method !== 'GET') {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed',
        allowed_methods: ['GET', 'OPTIONS']
      });
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
        razorpay_configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
        deployment_region: process.env.VERCEL_REGION || 'unknown',
        function_name: 'health'
      },
      api_endpoints: {
        health: '/api/health',
        create_order: '/api/create-razorpay-order',
        verify_payment: '/api/verify-razorpay-payment',
        payment_status: '/api/payment-status/:id',
        vendor_transfer: '/api/vendor-transfer'
      }
    };

    console.log('Health check response:', healthData);
    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
      function_name: 'health'
    });
  }
};
// api/verify-razorpay-payment.js - Vercel serverless function for verifying Razorpay payments
const crypto = require('crypto');

// CORS headers for Vercel
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Allow-Credentials': 'false',
  'Access-Control-Max-Age': '86400'
};

// Helper function to handle CORS
const handleCORS = (req, res) => {
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};

module.exports = async (req, res) => {
  try {
    // Handle CORS
    if (handleCORS(req, res)) return;

    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed',
        allowed_methods: ['POST'],
        current_method: req.method
      });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    console.log('Verifying Razorpay payment:', { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature: razorpay_signature ? 'provided' : 'missing'
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Missing required fields',
        required_fields: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'],
        received: {
          razorpay_order_id: !!razorpay_order_id,
          razorpay_payment_id: !!razorpay_payment_id,
          razorpay_signature: !!razorpay_signature
        }
      });
    }

    // Create signature for verification
    const secret = process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    console.log('Signature verification:', {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature
    });

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log('Payment verification successful');
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment_details: {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          status: 'verified'
        },
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Payment verification failed - signature mismatch');
      
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed',
        message: 'Invalid signature',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return res.status(500).json({
      error: 'Payment verification error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

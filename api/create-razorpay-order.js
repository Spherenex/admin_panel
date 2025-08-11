// api/create-razorpay-order.js - Vercel serverless function for creating Razorpay orders
const Razorpay = require('razorpay');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u',
});

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

    const { amount, currency = 'INR', receipt, notes } = req.body;

    console.log('Creating Razorpay order:', { amount, currency, receipt });

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      });
    }

    // Create order options
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paisa (smallest currency unit)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: notes || {}
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(orderOptions);

    console.log('Razorpay order created successfully:', order.id);

    // Return success response
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at
      },
      razorpay_key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp'
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    return res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

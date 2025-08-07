// api/index.js - Vercel serverless function for Razorpay integration
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Ensure compatibility with Node.js 22.x
if (typeof globalThis === 'undefined') {
  global.globalThis = global;
}

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u',
});

// CORS headers for Vercel
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true'
};

// Helper function to handle CORS
const handleCORS = (req, res) => {
  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};

// Main handler function for Vercel
module.exports = async (req, res) => {
  try {
    // Handle CORS
    if (handleCORS(req, res)) return;

    const { url, method } = req;
    
    // Extract path from URL - handle both /api and direct paths
    let path = url;
    if (path.startsWith('/api')) {
      path = path.replace('/api', '');
    }
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    console.log(`${method} ${path} - Origin: ${req.headers.origin || 'Unknown'}`);
    console.log('Full URL:', url);

    // Route handling
    switch (true) {
      case path === '/health' && method === 'GET':
        return handleHealth(req, res);
      
      case path === '/create-razorpay-order' && method === 'POST':
        return handleCreateOrder(req, res);
      
      case path === '/verify-razorpay-payment' && method === 'POST':
        return handleVerifyPayment(req, res);
      
      case path.startsWith('/payment-status/') && method === 'GET':
        return handlePaymentStatus(req, res);
      
      case path === '/create-refund' && method === 'POST':
        return handleCreateRefund(req, res);
      
      case path === '/razorpay-orders' && method === 'GET':
        return handleGetOrders(req, res);
      
      case path === '/vendor-transfer' && method === 'POST':
        return handleVendorTransfer(req, res);
      
      default:
        return res.status(404).json({ 
          error: 'Endpoint not found',
          path: path,
          method: method,
          available_endpoints: [
            'GET /api/health',
            'POST /api/create-razorpay-order',
            'POST /api/verify-razorpay-payment',
            'GET /api/payment-status/:paymentId',
            'POST /api/create-refund',
            'GET /api/razorpay-orders',
            'POST /api/vendor-transfer'
          ]
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// Health check endpoint
async function handleHealth(req, res) {
  try {
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
    res.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Create Razorpay order
async function handleCreateOrder(req, res) {
  try {
    const { amount, currency, receipt } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Convert to paise if amount is in rupees
    const orderAmount = Math.round(amount * 100);

    const options = {
      amount: orderAmount, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    console.log('Creating Razorpay order:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);
    
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order', 
      details: error.message 
    });
  }
}

// Verify Razorpay payment
async function handleVerifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        error: 'Missing required payment details',
        required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
      });
    }

    // Generate signature for verification
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log('Payment verification successful');
      res.json({ 
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id
      });
    } else {
      console.log('Payment verification failed - signature mismatch');
      res.json({ 
        success: false, 
        error: 'Invalid signature' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Payment verification failed', 
      details: error.message 
    });
  }
}

// Get payment status
async function handlePaymentStatus(req, res) {
  try {
    const paymentId = req.url.split('/').pop();
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }
    
    console.log('Fetching payment status for:', paymentId);
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      created_at: payment.created_at,
      method: payment.method
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment status', 
      details: error.message 
    });
  }
}

// Create refund
async function handleCreateRefund(req, res) {
  try {
    const { paymentId, amount, notes } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }
    
    const refundOptions = {
      payment_id: paymentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      notes: notes || {},
    };
    
    console.log('Creating refund for payment:', paymentId);
    const refund = await razorpay.refunds.create(refundOptions);
    
    res.json(refund);
  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({ 
      error: 'Failed to create refund', 
      details: error.message 
    });
  }
}

// Get orders list
async function handleGetOrders(req, res) {
  try {
    console.log('Fetching Razorpay orders');
    const orders = await razorpay.orders.all({
      count: 10
    });
    
    res.json({
      orders: orders.items.map(order => ({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders', 
      details: error.message 
    });
  }
}

// Handle vendor transfer
async function handleVendorTransfer(req, res) {
  try {
    const { vendorId, amount, notes, receipt } = req.body;
    
    if (!vendorId || !amount) {
      return res.status(400).json({ 
        error: 'Vendor ID and amount are required' 
      });
    }

    // For now, simulate a successful transfer
    // In a real implementation, you would integrate with a transfer API
    const transferResponse = {
      id: `txn_${Date.now()}`,
      vendor_id: vendorId,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      status: 'processed',
      notes: notes || {},
      receipt: receipt || `receipt_${Date.now()}`,
      created_at: Math.floor(Date.now() / 1000)
    };

    console.log('Vendor transfer processed:', transferResponse);
    
    res.json({
      success: true,
      transfer: transferResponse
    });
  } catch (error) {
    console.error('Error processing vendor transfer:', error);
    res.status(500).json({ 
      error: 'Failed to process vendor transfer', 
      details: error.message 
    });
  }
}

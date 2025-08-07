// server.js - Razorpay integration server
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS configuration to allow frontend access
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://localhost:5174',
    'https://admin-panel-mu-sepia.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_psQiRu5RCF99Dp',
  key_secret: 'MLb1hejwBSaeg9ysJjO24O0u',
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check accessed from:', req.headers.origin || 'Unknown');
  res.json({ 
    status: 'ok', 
    message: 'Razorpay server is running',
    timestamp: new Date().toISOString()
  });
});

// Create Razorpay order
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    console.log('Creating Razorpay order:', req.body);
    
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

// Verify Razorpay payment
app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    console.log('Verifying Razorpay payment:', req.body);
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required payment verification parameters' 
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', 'MLb1hejwBSaeg9ysJjO24O0u')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    
    console.log('Payment verification result:', isAuthentic);
    
    if (isAuthentic) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Payment verification failed',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Razorpay server is running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Ready to process Razorpay payments!`);
});

module.exports = app;

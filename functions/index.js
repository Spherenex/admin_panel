const functions = require('firebase-functions');
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');

// Get environment variables from Firebase config
const razorpayConfig = functions.config().razorpay || {
  key_id: 'rzp_test_psQiRu5RCF99Dp',
  key_secret: 'MLb1hejwBSaeg9ysJjO24O0u'
};

// Create Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>Razorpay API Server is running</h1>
    <p>Try the health check at <a href="/api/health">/api/health</a></p>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    config: {
      key_id: razorpayConfig.key_id,
      // Don't expose the secret key in responses
      has_secret: !!razorpayConfig.key_secret
    }
  });
});

// Create Razorpay order
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const orderAmount = Math.round(amount * 100); // Convert to paise

    const options = {
      amount: orderAmount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Verify Razorpay payment
app.post('/api/verify-razorpay-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment details' });
    }

    const generated_signature = crypto
      .createHmac('sha256', razorpayConfig.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
  }
});

// Get payment status
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }
    
    const payment = await razorpay.payments.fetch(paymentId);
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment status:', error.message);
    res.status(500).json({ error: 'Failed to fetch payment status', details: error.message });
  }
});

// Create refund
app.post('/api/create-refund', async (req, res) => {
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
    
    const refund = await razorpay.refunds.create(refundOptions);
    res.json(refund);
  } catch (error) {
    console.error('Error creating refund:', error.message);
    res.status(500).json({ error: 'Failed to create refund', details: error.message });
  }
});

// Get list of orders
app.get('/api/razorpay-orders', async (req, res) => {
  try {
    const orders = await razorpay.orders.all({
      count: 10 // Get the last 10 orders
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
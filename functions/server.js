



// // server.js - Universal Razorpay integration
// const express = require('express');
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const os = require('os');

// dotenv.config({ debug: true });

// // Create Express app
// const app = express();
// app.use(express.json());

// // CORS configuration to allow ANY origin
// app.use(cors({
//   origin: 'http://localhost:5002', // Allow all origins
//   methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
// }));

// // Additional CORS headers for problematic clients
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5002');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

// // Initialize Razorpay with environment variables
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u',
// });

// // Helper function to get network interfaces
// const getNetworkInterfaces = () => {
//   const interfaces = {};
//   const networkInterfaces = os.networkInterfaces();
  
//   for (const name of Object.keys(networkInterfaces)) {
//     for (const netInterface of networkInterfaces[name]) {
//       // Skip internal and non-IPv4 addresses
//       if (!netInterface.internal && netInterface.family === 'IPv4') {
//         if (!interfaces[name]) {
//           interfaces[name] = [];
//         }
//         interfaces[name].push(netInterface.address);
//       }
//     }
//   }
  
//   return interfaces;
// };

// // Root endpoint with server info
// app.get('/', (req, res) => {
//   const interfaces = getNetworkInterfaces();
//   const interfacesList = Object.entries(interfaces).map(([name, addresses]) => 
//     `${name}: ${addresses.join(', ')}`
//   ).join('\n');
  
//   res.send(`
//     <h1>Razorpay API Server is running</h1>
//     <p>Server is accessible at:</p>
//     <ul>
//       <li>Local: <a href="http://localhost:${PORT}">http://localhost:${PORT}</a></li>
//       ${Object.entries(interfaces).flatMap(([name, addresses]) => 
//         addresses.map(address => 
//           `<li>${name}: <a href="http://${address}:${PORT}">http://${address}:${PORT}</a></li>`
//         )
//       ).join('\n')}
//     </ul>
//     <p>Try the health check at <a href="/api/health">/api/health</a></p>
//   `);
// });

// // Enhanced health check endpoint
// app.get('/api/health', (req, res) => {
//   console.log('Health check endpoint accessed from:', req.headers.origin || 'Unknown origin');
  
//   const interfaces = getNetworkInterfaces();
  
//   res.json({ 
//     status: 'ok', 
//     timestamp: new Date(),
//     server_info: {
//       hostname: os.hostname(),
//       platform: os.platform(),
//       uptime: os.uptime(),
//       interfaces: interfaces
//     }
//   });
// });

// // Endpoint to create Razorpay order
// app.post('/api/create-razorpay-order', async (req, res) => {
//   try {
//     // Log request details
//     console.log('Create order request from:', req.headers.origin || 'Unknown origin');
//     console.log('Request body:', req.body);
    
//     const { amount, currency, receipt } = req.body;

//     // Validate amount (convert to paise if in rupees)
//     if (!amount || isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ error: 'Invalid amount' });
//     }
//     const orderAmount = Math.round(amount * 100); // Convert to paise

//     const options = {
//       amount: orderAmount, // Amount in paise
//       currency: currency || 'INR',
//       receipt: receipt || `receipt_${Date.now()}`,
//     };

//     console.log('Creating Razorpay order with options:', options);
//     const order = await razorpay.orders.create(options);
//     console.log('Razorpay order created:', order);
    
//     // Add network interfaces to the response for debugging
//     const responseWithServerInfo = {
//       ...order,
//       _server_debug: {
//         interfaces: getNetworkInterfaces(),
//         hostname: os.hostname()
//       }
//     };
    
//     res.json(responseWithServerInfo);
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error.message);
//     res.status(500).json({ error: 'Failed to create order', details: error.message });
//   }
// });

// // Endpoint to verify Razorpay payment
// app.post('/api/verify-razorpay-payment', (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     console.log('Verifying payment from:', req.headers.origin || 'Unknown origin');
//     console.log('Payment details:', { razorpay_order_id, razorpay_payment_id });

//     // Validate required fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ error: 'Missing required payment details' });
//     }

//     const generated_signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u')
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     console.log('Generated signature:', generated_signature);
//     console.log('Received signature:', razorpay_signature);

//     if (generated_signature === razorpay_signature) {
//       console.log('Payment verification successful');
//       res.json({ success: true });
//     } else {
//       console.log('Payment verification failed - signature mismatch');
//       res.json({ success: false, error: 'Invalid signature' });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error.message);
//     res.status(500).json({ error: 'Payment verification failed', details: error.message });
//   }
// });

// // Get payment status by payment ID
// app.get('/api/payment-status/:paymentId', async (req, res) => {
//   try {
//     const { paymentId } = req.params;
    
//     if (!paymentId) {
//       return res.status(400).json({ error: 'Payment ID is required' });
//     }
    
//     console.log('Fetching payment status for payment ID:', paymentId);
//     const payment = await razorpay.payments.fetch(paymentId);
//     console.log('Payment status:', payment.status);
//     res.json(payment);
//   } catch (error) {
//     console.error('Error fetching payment status:', error.message);
//     res.status(500).json({ error: 'Failed to fetch payment status', details: error.message });
//   }
// });

// // Create refund
// app.post('/api/create-refund', async (req, res) => {
//   try {
//     const { paymentId, amount, notes } = req.body;
    
//     if (!paymentId) {
//       return res.status(400).json({ error: 'Payment ID is required' });
//     }
    
//     const refundOptions = {
//       payment_id: paymentId,
//       amount: amount ? Math.round(amount * 100) : undefined, // Optional: partial refund amount in paise
//       notes: notes || {}, // Optional: notes for the refund
//     };
    
//     console.log('Creating refund for payment ID:', paymentId);
//     const refund = await razorpay.refunds.create(refundOptions);
//     console.log('Refund created:', refund);
//     res.json(refund);
//   } catch (error) {
//     console.error('Error creating refund:', error.message);
//     res.status(500).json({ error: 'Failed to create refund', details: error.message });
//   }
// });

// // Get list of orders
// app.get('/api/razorpay-orders', async (req, res) => {
//   try {
//     console.log('Fetching Razorpay orders');
//     const orders = await razorpay.orders.all({
//       count: 10 // Get the last 10 orders
//     });
//     res.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error.message);
//     res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
//   }
// });

// // Start the server
// // In server.js
// const PORT = process.env.PORT || 8080; // Change to 8080 or another port

// // Listen on all network interfaces (0.0.0.0) to make it accessible from other devices
// app.listen(PORT, '0.0.0.0', () => {
//   const interfaces = getNetworkInterfaces();
  
//   console.log(`✅ Razorpay Server running on port ${PORT}`);
//   console.log('📱 Server is accessible at the following addresses:');
//   console.log(`   💻 Local: http://localhost:${PORT}`);
  
//   // Print all available network interfaces
//   for (const [name, addresses] of Object.entries(interfaces)) {
//     for (const address of addresses) {
//       console.log(`   🌐 ${name}: http://${address}:${PORT}`);
//     }
//   }
  
//   console.log(`👉 Try the health check at http://localhost:${PORT}/api/health`);
//   console.log('🔄 Server ready to accept connections from ANY device');
// });




// // server.js - Universal Razorpay integration
// const express = require('express');
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const os = require('os');

// dotenv.config({ debug: true });

// // Create Express app
// const app = express();
// app.use(express.json());

// // CORS configuration properly set for localhost:5002
// app.use(cors({
//   origin: ['http://localhost:5002','https://zappcart-control-panel.web.app'],
//   methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   credentials: true // IMPORTANT: Allow credentials
// }));

// // Additional CORS headers for problematic clients
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5002');
//   res.header('Access-Control-Allow-Credentials', 'true'); // IMPORTANT: Allow credentials
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

// // Initialize Razorpay with environment variables
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp',
//   key_secret: process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u',
// });

// // Helper function to get network interfaces
// const getNetworkInterfaces = () => {
//   const interfaces = {};
//   const networkInterfaces = os.networkInterfaces();
  
//   for (const name of Object.keys(networkInterfaces)) {
//     for (const netInterface of networkInterfaces[name]) {
//       // Skip internal and non-IPv4 addresses
//       if (!netInterface.internal && netInterface.family === 'IPv4') {
//         if (!interfaces[name]) {
//           interfaces[name] = [];
//         }
//         interfaces[name].push(netInterface.address);
//       }
//     }
//   }
  
//   return interfaces;
// };

// // Root endpoint with server info
// app.get('/', (req, res) => {
//   const interfaces = getNetworkInterfaces();
//   const interfacesList = Object.entries(interfaces).map(([name, addresses]) => 
//     `${name}: ${addresses.join(', ')}`
//   ).join('\n');
  
//   res.send(`
//     <h1>Razorpay API Server is running</h1>
//     <p>Server is accessible at:</p>
//     <ul>
//       <li>Local: <a href="http://localhost:${PORT}">http://localhost:${PORT}</a></li>
//       ${Object.entries(interfaces).flatMap(([name, addresses]) => 
//         addresses.map(address => 
//           `<li>${name}: <a href="http://${address}:${PORT}">http://${address}:${PORT}</a></li>`
//         )
//       ).join('\n')}
//     </ul>
//     <p>Try the health check at <a href="/api/health">/api/health</a></p>
//   `);
// });

// // Enhanced health check endpoint
// app.get('/api/health', (req, res) => {
//   console.log('Health check endpoint accessed from:', req.headers.origin || 'Unknown origin');
  
//   const interfaces = getNetworkInterfaces();
  
//   res.json({ 
//     status: 'ok', 
//     timestamp: new Date(),
//     server_info: {
//       hostname: os.hostname(),
//       platform: os.platform(),
//       uptime: os.uptime(),
//       interfaces: interfaces
//     }
//   });
// });

// // Endpoint to create Razorpay order
// app.post('/api/create-razorpay-order', async (req, res) => {
//   try {
//     // Log request details
//     console.log('Create order request from:', req.headers.origin || 'Unknown origin');
//     console.log('Request body:', req.body);
    
//     const { amount, currency, receipt } = req.body;

//     // Validate amount (convert to paise if in rupees)
//     if (!amount || isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ error: 'Invalid amount' });
//     }
//     const orderAmount = Math.round(amount * 100); // Convert to paise

//     const options = {
//       amount: orderAmount, // Amount in paise
//       currency: currency || 'INR',
//       receipt: receipt || `receipt_${Date.now()}`,
//     };

//     console.log('Creating Razorpay order with options:', options);
//     const order = await razorpay.orders.create(options);
//     console.log('Razorpay order created:', order);
    
//     // Add network interfaces to the response for debugging
//     const responseWithServerInfo = {
//       ...order,
//       _server_debug: {
//         interfaces: getNetworkInterfaces(),
//         hostname: os.hostname()
//       }
//     };
    
//     res.json(responseWithServerInfo);
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error.message);
//     res.status(500).json({ error: 'Failed to create order', details: error.message });
//   }
// });

// // Endpoint to verify Razorpay payment
// app.post('/api/verify-razorpay-payment', (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     console.log('Verifying payment from:', req.headers.origin || 'Unknown origin');
//     console.log('Payment details:', { razorpay_order_id, razorpay_payment_id });

//     // Validate required fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ error: 'Missing required payment details' });
//     }

//     const generated_signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u')
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     console.log('Generated signature:', generated_signature);
//     console.log('Received signature:', razorpay_signature);

//     if (generated_signature === razorpay_signature) {
//       console.log('Payment verification successful');
//       res.json({ success: true });
//     } else {
//       console.log('Payment verification failed - signature mismatch');
//       res.json({ success: false, error: 'Invalid signature' });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error.message);
//     res.status(500).json({ error: 'Payment verification failed', details: error.message });
//   }
// });

// // Get payment status by payment ID
// app.get('/api/payment-status/:paymentId', async (req, res) => {
//   try {
//     const { paymentId } = req.params;
    
//     if (!paymentId) {
//       return res.status(400).json({ error: 'Payment ID is required' });
//     }
    
//     console.log('Fetching payment status for payment ID:', paymentId);
//     const payment = await razorpay.payments.fetch(paymentId);
//     console.log('Payment status:', payment.status);
//     res.json(payment);
//   } catch (error) {
//     console.error('Error fetching payment status:', error.message);
//     res.status(500).json({ error: 'Failed to fetch payment status', details: error.message });
//   }
// });

// // Create refund
// app.post('/api/create-refund', async (req, res) => {
//   try {
//     const { paymentId, amount, notes } = req.body;
    
//     if (!paymentId) {
//       return res.status(400).json({ error: 'Payment ID is required' });
//     }
    
//     const refundOptions = {
//       payment_id: paymentId,
//       amount: amount ? Math.round(amount * 100) : undefined, // Optional: partial refund amount in paise
//       notes: notes || {}, // Optional: notes for the refund
//     };
    
//     console.log('Creating refund for payment ID:', paymentId);
//     const refund = await razorpay.refunds.create(refundOptions);
//     console.log('Refund created:', refund);
//     res.json(refund);
//   } catch (error) {
//     console.error('Error creating refund:', error.message);
//     res.status(500).json({ error: 'Failed to create refund', details: error.message });
//   }
// });

// // Get list of orders
// app.get('/api/razorpay-orders', async (req, res) => {
//   try {
//     console.log('Fetching Razorpay orders');
//     const orders = await razorpay.orders.all({
//       count: 10 // Get the last 10 orders
//     });
//     res.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error.message);
//     res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
//   }
// });

// // Start the server
// // IMPORTANT: Set to port 5000 to match what frontend expects
// const PORT = process.env.PORT || 5000;

// // Listen on all network interfaces (0.0.0.0) to make it accessible from other devices
// app.listen(PORT, '0.0.0.0', () => {
//   const interfaces = getNetworkInterfaces();
  
//   console.log(`✅ Razorpay Server running on port ${PORT}`);
//   console.log('📱 Server is accessible at the following addresses:');
//   console.log(`   💻 Local: http://localhost:${PORT}`);
  
//   // Print all available network interfaces
//   for (const [name, addresses] of Object.entries(interfaces)) {
//     for (const address of addresses) {
//       console.log(`   🌐 ${name}: http://${address}:${PORT}`);
//     }
//   }
  
//   console.log(`👉 Try the health check at http://localhost:${PORT}/api/health`);
//   console.log('🔄 Server ready to accept connections from ANY device');
// });



// server.js - Enhanced Razorpay API Server
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Define PORT - changed to 3001 to match frontend expectations
const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();
app.use(express.json());

// Enhanced CORS setup with proper origin handling
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002', // Added for React frontend
      'http://localhost:5000',
      'https://admin-panel-mu-sepia.vercel.app/',
      
    ];
    
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u',
});

// Helper function to get network interfaces
const getNetworkInterfaces = () => {
  const interfaces = {};
  const networkInterfaces = os.networkInterfaces();
  
  for (const name of Object.keys(networkInterfaces)) {
    for (const netInterface of networkInterfaces[name]) {
      if (!netInterface.internal && netInterface.family === 'IPv4') {
        if (!interfaces[name]) {
          interfaces[name] = [];
        }
        interfaces[name].push(netInterface.address);
      }
    }
  }
  
  return interfaces;
};

// Serve static files for the demo interface
app.use(express.static(path.join(__dirname, 'public')));

// Root endpoint with improved interface
app.get('/', (req, res) => {
  const interfaces = getNetworkInterfaces();
  let interfacesList = '';
  
  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses) {
      interfacesList += `<li>${name}: <a href="http://${address}:${PORT}" target="_blank">http://${address}:${PORT}</a></li>`;
    }
  }
  
  // Read the HTML template if it exists, otherwise use inline HTML
  try {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');
      html = html.replace('{{PORT}}', PORT)
                 .replace('{{INTERFACES}}', interfacesList)
                 .replace('{{SERVER_INFO}}', JSON.stringify({
                   hostname: os.hostname(),
                   platform: os.platform(),
                   uptime: os.uptime(),
                   interfaces: getNetworkInterfaces()
                 }, null, 2));
      return res.send(html);
    }
  } catch (error) {
    console.warn('Could not load HTML template:', error.message);
  }
  
  // Fallback to inline HTML
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Razorpay API Server</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { color: #2d3748; }
        .card { background: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .success { color: #22543d; background: #c6f6d5; }
        a { color: #3182ce; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { background: #edf2f7; padding: 2px 4px; border-radius: 4px; font-size: 0.9em; }
        pre { background: #edf2f7; padding: 12px; border-radius: 4px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>🚀 Razorpay API Server</h1>
      <div class="card success">
        <h2>✅ Server is running!</h2>
        <p>Server is accessible at:</p>
        <ul>
          <li>Local: <a href="http://localhost:${PORT}" target="_blank">http://localhost:${PORT}</a></li>
          ${interfacesList}
        </ul>
      </div>
      <div class="card">
        <h2>API Endpoints</h2>
        <ul>
          <li><a href="/api/health" target="_blank">/api/health</a> - Health check endpoint</li>
          <li><code>POST /api/create-razorpay-order</code> - Create a new Razorpay order</li>
          <li><code>POST /api/verify-razorpay-payment</code> - Verify a Razorpay payment</li>
          <li><code>GET /api/payment-status/:id</code> - Get payment status by ID</li>
          <li><code>GET /api/razorpay-orders</code> - List recent orders</li>
        </ul>
      </div>
      <div class="card">
        <h2>Server Information</h2>
        <pre>${JSON.stringify({
          hostname: os.hostname(),
          platform: os.platform(),
          uptime: os.uptime(),
          interfaces: getNetworkInterfaces()
        }, null, 2)}</pre>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint with more details
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    server_info: {
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime(),
      memoryUsage: process.memoryUsage(),
      interfaces: getNetworkInterfaces()
    },
    razorpay: {
      isConfigured: !!process.env.RAZORPAY_KEY_ID,
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'test'
    }
  });
});

// Create Razorpay order with improved error handling
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Convert to paise (Razorpay uses smallest currency unit)
    const orderAmount = Math.round(amount * 100);

    const options = {
      amount: orderAmount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    console.log(`Creating Razorpay order: ${JSON.stringify(options)}`);
    
    const order = await razorpay.orders.create(options);
    
    console.log(`Order created successfully: ${order.id}`);
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at,
      _server_debug: {
        interfaces: getNetworkInterfaces(),
        hostname: os.hostname()
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    
    // Provide more descriptive error messages
    let errorMessage = 'Failed to create order';
    let statusCode = 500;
    
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage, 
      details: error.error || {},
      timestamp: new Date().toISOString()
    });
  }
});

// Verify Razorpay payment with enhanced security
app.post('/api/verify-razorpay-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment details' });
    }

    // Generate the expected signature
    const secretKey = process.env.RAZORPAY_KEY_SECRET || 'MLb1hejwBSaeg9ysJjO24O0u';
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    console.log(`Verifying payment signature for order ${razorpay_order_id}`);

    // Compare with time-constant comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generated_signature, 'utf8'),
      Buffer.from(razorpay_signature, 'utf8')
    );

    if (isValid) {
      console.log('Payment signature verified successfully');
      res.json({ 
        success: true, 
        message: 'Payment verification successful',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    } else {
      console.warn('Invalid payment signature');
      res.json({ 
        success: false, 
        error: 'Invalid signature',
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    
    let errorMessage = 'Payment verification failed';
    if (error.message === "Input buffers must have the same length") {
      errorMessage = 'Invalid signature format';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Get payment status with better error handling
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }
    
    console.log(`Fetching payment status for ID: ${paymentId}`);
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    // Filter the response to include only necessary details
    const filteredPayment = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      created_at: payment.created_at,
      captured: payment.captured,
      description: payment.description
    };
    
    res.json(filteredPayment);
  } catch (error) {
    console.error('Error fetching payment status:', error.message);
    
    // Provide specific error messages for different cases
    let errorMessage = 'Failed to fetch payment status';
    let statusCode = 500;
    
    if (error.statusCode === 400) {
      errorMessage = 'Invalid payment ID format';
      statusCode = 400;
    } else if (error.statusCode === 404) {
      errorMessage = 'Payment not found';
      statusCode = 404;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage, 
      details: error.error || {},
      timestamp: new Date().toISOString()
    });
  }
});

// Create refund with better error handling
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
    
    console.log(`Creating refund for payment ${paymentId}`);
    
    const refund = await razorpay.refunds.create(refundOptions);
    
    console.log(`Refund created successfully: ${refund.id}`);
    
    res.json({
      id: refund.id,
      payment_id: refund.payment_id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      created_at: refund.created_at
    });
  } catch (error) {
    console.error('Error creating refund:', error.message);
    
    let errorMessage = 'Failed to create refund';
    let statusCode = 500;
    
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage, 
      details: error.error || {},
      timestamp: new Date().toISOString()
    });
  }
});

// Get list of orders with pagination and filtering
app.get('/api/razorpay-orders', async (req, res) => {
  try {
    const { count = 10, skip = 0, from, to } = req.query;
    
    const options = {
      count: parseInt(count),
      skip: parseInt(skip)
    };
    
    if (from) {
      options.from = new Date(from).getTime();
    }
    
    if (to) {
      options.to = new Date(to).getTime();
    }
    
    console.log(`Fetching orders with options: ${JSON.stringify(options)}`);
    
    const orders = await razorpay.orders.all(options);
    
    res.json({
      count: orders.count,
      items: orders.items.map(order => ({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to fetch orders', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Add a basic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start the server with better logging
const server = app.listen(PORT, '0.0.0.0', () => {
  const interfaces = getNetworkInterfaces();
  
  console.log('\n========================================');
  console.log(`✅ Razorpay Server running on port ${PORT}`);
  console.log('----------------------------------------');
  console.log('📱 Server is accessible at:');
  console.log(`   💻 Local: http://localhost:${PORT}`);
  
  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses) {
      console.log(`   🌐 ${name}: http://${address}:${PORT}`);
    }
  }
  
  console.log('----------------------------------------');
  console.log('📘 API Documentation:');
  console.log(`   👉 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   👉 Create Order: POST http://localhost:${PORT}/api/create-razorpay-order`);
  console.log(`   👉 Verify Payment: POST http://localhost:${PORT}/api/verify-razorpay-payment`);
  console.log('========================================\n');
  
  console.log('Razorpay Keys:');
  console.log(`   Key ID: ${process.env.RAZORPAY_KEY_ID || 'rzp_test_psQiRu5RCF99Dp'}`);
  console.log(`   Key Secret: ${process.env.RAZORPAY_KEY_SECRET ? '*********************' : 'MLb1hejwBSaeg9ysJjO24O0u'}`);
  console.log('----------------------------------------\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
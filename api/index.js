// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const axios = require('axios');
// const admin = require('firebase-admin');
// const app = express();

// // Initialize Firebase Admin SDK
// // This approach uses a JSON string in an environment variable
// let serviceAccount;
// try {
//   // Try to parse the service account from environment variable
//   if (process.env.FIREBASE_SERVICE_ACCOUNT) {
//     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
//     if (!admin.apps.length) {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//       });
//     }
//     console.log('Firebase Admin initialized successfully');
//   } else {
//     console.warn('FIREBASE_SERVICE_ACCOUNT environment variable not set');
//   }
// } catch (error) {
//   console.error('Failed to initialize Firebase Admin:', error);
// }

// // CORS configuration
// app.use(cors({
//   origin: [
//     'http://localhost:5174', 
//     'http://127.0.0.1:5174', 
//     'http://localhost:5001',
//     'https://admin-panel-mu-sepia.vercel.app',
//     process.env.FRONTEND_URL,
//   ].filter(Boolean),
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Vendor Payout Server is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//     firebase: admin.apps.length > 0 ? 'connected' : 'not connected'
//   });
// });

// // VENDOR TRANSFER PAYMENT API
// app.post('/api/vendor-transfer', async (req, res) => {
//   console.log('Received vendor transfer request:', req.body);
//   try {
//     const { 
//       vendor_id, 
//       amount, 
//       beneficiary_name,
//       beneficiary_account_number,
//       beneficiary_ifsc,
//       beneficiary_upi,
//       payment_mode,
//       purpose,
//       merchant_email // Get merchant email from request if needed
//     } = req.body;

//     // Validation
//     if (!vendor_id || !amount || !beneficiary_name) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: vendor_id, amount, or beneficiary_name'
//       });
//     }

//     // Payment mode validation
//     if (payment_mode === 'NEFT' || payment_mode === 'IMPS') {
//       if (!beneficiary_account_number || !beneficiary_ifsc) {
//         return res.status(400).json({
//           status: 0,
//           msg: 'Missing bank details: account_number and ifsc_code required for bank transfers'
//         });
//       }
//     } else if (payment_mode === 'UPI') {
//       if (!beneficiary_upi) {
//         return res.status(400).json({
//           status: 0,
//           msg: 'Missing UPI ID for UPI transfers'
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Invalid payment_mode. Must be NEFT, IMPS, or UPI'
//       });
//     }

//     // Format amount to 2 decimal places
//     const formattedAmount = parseFloat(amount).toFixed(2);

//     // Get Easebuzz credentials
//     const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
//     const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';
//     const merchant_email_to_use = merchant_email || process.env.EASEBUZZ_MERCHANT_EMAIL || 'payout@easebuzz.in';

//     // Generate unique payout reference ID
//     const merchant_ref_id = `PAYOUT${Date.now()}`;

//     // Format payout date
//     const today = new Date();
//     const payout_date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

//     // Prepare Easebuzz Payout API data
//     const payoutData = {
//       key: key,
//       merchant_email: merchant_email_to_use,
//       payout_date: payout_date,
//       amount: formattedAmount,
//       merchant_ref_id: merchant_ref_id,
      
//       beneficiary_name: beneficiary_name,
//       beneficiary_account_number: beneficiary_account_number || '',
//       beneficiary_ifsc: beneficiary_ifsc || '',
//       beneficiary_upi: beneficiary_upi || '',
      
//       payment_mode: payment_mode,
//       purpose: purpose || `Payment to vendor ${vendor_id}`,
      
//       beneficiary_mobile: '',
//       beneficiary_email: ''
//     };

//     // Generate hash
//     const hashString = 
//       key + '|' + 
//       merchant_email_to_use + '|' + 
//       payout_date + '|' + 
//       formattedAmount + '|' + 
//       merchant_ref_id + '|' + 
//       salt;

//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     payoutData.hash = hash;

//     // Log the request (sensitive info redacted)
//     console.log('Payout request to Easebuzz:', {
//       ...payoutData,
//       beneficiary_account_number: payoutData.beneficiary_account_number 
//         ? `XXXX${payoutData.beneficiary_account_number.slice(-4)}` 
//         : '',
//       hash: `${hash.substring(0, 10)}...`
//     });

//     let easebuzzResult;
//     const USE_MOCK_RESPONSES = process.env.USE_MOCK_RESPONSES === 'false' ? false : true;

//     // Use mock or real API call
//     if (USE_MOCK_RESPONSES) {
//       console.log('Using mock payout response for testing');
      
//       easebuzzResult = {
//         status: 1,
//         msg: "Payout initiated successfully",
//         data: {
//           payout_id: "MOCK" + Date.now(),
//           status: "initiated",
//           reference_id: merchant_ref_id,
//           beneficiary_name: beneficiary_name,
//           amount: formattedAmount
//         }
//       };
//     } else {
//       try {
//         const apiUrl = process.env.EASEBUZZ_API_URL || 'https://testpay.easebuzz.in/api/v1/payout/initiate';
//         const easebuzzResponse = await axios.post(
//           apiUrl,
//           payoutData, 
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             validateStatus: function (status) {
//               return true; 
//             }
//           }
//         );

//         // Check response
//         const contentType = easebuzzResponse.headers['content-type'] || '';
//         const isHtml = contentType.includes('html');
        
//         if (isHtml || easebuzzResponse.status !== 200) {
//           console.log('Received HTML or error response from API:', 
//             isHtml ? 'HTML content detected' : `Status: ${easebuzzResponse.status}`);
          
//           throw new Error('Payment gateway API endpoint not found or inaccessible');
//         }

//         easebuzzResult = easebuzzResponse.data;
//         console.log('Easebuzz payout response:', easebuzzResult);
//       } catch (apiError) {
//         console.error('API call error:', apiError);
//         throw new Error(`API error: ${apiError.message}`);
//       }
//     }

//     // Store payout record in Firestore
//     const payoutRecord = {
//       vendor_id: vendor_id,
//       merchant_ref_id: merchant_ref_id,
//       amount: formattedAmount,
//       beneficiary_name: beneficiary_name,
//       payment_mode: payment_mode,
//       purpose: purpose,
//       status: easebuzzResult.status === 1 ? 'initiated' : 'failed',
//       timestamp: new Date().toISOString(),
//       payout_date: payout_date,
//       easebuzz_response: easebuzzResult
//     };
    
//     // Check if Firebase is connected before trying to use it
//     if (admin.apps.length > 0) {
//       await admin.firestore().collection('vendorPayouts').doc(merchant_ref_id).set(payoutRecord);
//     } else {
//       console.warn('Firebase not connected, payment record not saved to database');
//     }

//     // Return success or failure response
//     if (easebuzzResult.status === 1) {
//       res.json({
//         status: 1,
//         msg: 'Vendor transfer initiated successfully',
//         data: {
//           vendor_id: vendor_id,
//           merchant_ref_id: merchant_ref_id,
//           amount: formattedAmount,
//           beneficiary_name: beneficiary_name,
//           payment_mode: payment_mode,
//           payout_id: easebuzzResult.data?.payout_id || '',
//           status: 'initiated',
//           payout_date: payout_date,
//           purpose: purpose
//         }
//       });
//     } else {
//       res.status(400).json({
//         status: 0,
//         msg: easebuzzResult.msg || 'Vendor transfer failed',
//         error: {
//           vendor_id: vendor_id,
//           merchant_ref_id: merchant_ref_id,
//           amount: formattedAmount,
//           reason: easebuzzResult.msg || 'Transfer failed',
//           timestamp: new Date().toISOString()
//         }
//       });
//     }

//   } catch (error) {
//     console.error('Vendor transfer error:', error);
    
//     res.status(500).json({
//       status: 0,
//       msg: 'Vendor transfer failed due to server error',
//       error: {
//         message: error.message,
//         timestamp: new Date().toISOString()
//       }
//     });
//   }
// });

// // CHECK VENDOR TRANSFER STATUS
// app.get('/api/vendor-transfer-status/:merchant_ref_id', async (req, res) => {
//   try {
//     const merchant_ref_id = req.params.merchant_ref_id;

//     // Check Firestore for record
//     let payoutRecord = null;
//     if (admin.apps.length > 0) {
//       const doc = await admin.firestore().collection('vendorPayouts').doc(merchant_ref_id).get();
//       if (doc.exists) {
//         payoutRecord = doc.data();
//       }
//     }
    
//     const USE_MOCK_RESPONSES = process.env.USE_MOCK_RESPONSES === 'false' ? false : true;
//     if (!payoutRecord && USE_MOCK_RESPONSES) {
//       return res.status(404).json({
//         status: 0,
//         msg: 'Transfer not found',
//         error: {
//           merchant_ref_id: merchant_ref_id,
//           reason: 'Not found in database'
//         }
//       });
//     }

//     // Get Easebuzz credentials
//     const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
//     const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';
//     const merchant_email = process.env.EASEBUZZ_MERCHANT_EMAIL || 'payout@easebuzz.in';

//     // Prepare status check data
//     const statusData = {
//       key: key,
//       merchant_email: merchant_email,
//       merchant_ref_id: merchant_ref_id
//     };

//     // Generate hash for status check
//     const hashString = key + '|' + merchant_email + '|' + merchant_ref_id + '|' + salt;
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     statusData.hash = hash;

//     let statusResult;

//     // Mock or real API call
//     if (USE_MOCK_RESPONSES) {
//       console.log('Using mock status response for testing');
      
//       const mockStatuses = ['initiated', 'processing', 'completed', 'failed'];
//       const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
//       statusResult = {
//         status: 1,
//         msg: "Status retrieved successfully",
//         data: {
//           merchant_ref_id: merchant_ref_id,
//           payout_id: "MOCK" + merchant_ref_id.substring(6),
//           status: randomStatus,
//           amount: payoutRecord?.amount || "100.00",
//           beneficiary_name: payoutRecord?.beneficiary_name || "Test Vendor",
//           payment_mode: payoutRecord?.payment_mode || "UPI",
//           status_message: `Payout ${randomStatus}`,
//           timestamp: new Date().toISOString()
//         }
//       };
//     } else {
//       // Call Easebuzz status API
//       try {
//         const apiUrl = process.env.EASEBUZZ_STATUS_API_URL || 'https://testpay.easebuzz.in/api/v1/payout/status';
//         const statusResponse = await axios.post(
//           apiUrl,
//           statusData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             validateStatus: function (status) {
//               return true;
//             }
//           }
//         );

//         // Check response
//         const contentType = statusResponse.headers['content-type'] || '';
//         const isHtml = contentType.includes('html');
        
//         if (isHtml || statusResponse.status !== 200) {
//           console.log('Received HTML or error response from status API:', 
//             isHtml ? 'HTML content detected' : `Status: ${statusResponse.status}`);
          
//           throw new Error('Payment gateway status API endpoint not found or inaccessible');
//         }

//         statusResult = statusResponse.data;
//       } catch (apiError) {
//         console.error('Status API call error:', apiError);
//         throw new Error(`Status API error: ${apiError.message}`);
//       }
//     }

//     console.log('Status check response:', statusResult);

//     // Update Firestore record if found
//     if (payoutRecord && statusResult.status === 1 && admin.apps.length > 0) {
//       await admin.firestore().collection('vendorPayouts').doc(merchant_ref_id).update({
//         current_status: statusResult.data?.status || 'unknown',
//         last_status_check: new Date().toISOString(),
//         status_response: statusResult.data
//       });
//     }

//     // Return status response
//     if (statusResult.status === 1) {
//       res.json({
//         status: 1,
//         msg: 'Status retrieved successfully',
//         data: {
//           merchant_ref_id: merchant_ref_id,
//           payout_status: statusResult.data?.status || 'unknown',
//           amount: statusResult.data?.amount || '',
//           beneficiary_name: statusResult.data?.beneficiary_name || '',
//           payout_id: statusResult.data?.payout_id || '',
//           status_message: statusResult.data?.status_message || '',
//           last_updated: new Date().toISOString()
//         }
//       });
//     } else {
//       res.status(404).json({
//         status: 0,
//         msg: statusResult.msg || 'Transfer not found',
//         error: {
//           merchant_ref_id: merchant_ref_id,
//           reason: statusResult.msg || 'Not found'
//         }
//       });
//     }

//   } catch (error) {
//     console.error('Status check error:', error);
//     res.status(500).json({
//       status: 0,
//       msg: 'Status check failed',
//       error: {
//         message: error.message,
//         timestamp: new Date().toISOString()
//       }
//     });
//   }
// });

// // GET ALL VENDOR TRANSFERS
// app.get('/api/vendor-transfers', async (req, res) => {
//   try {
//     let payoutsArray = [];
    
//     // Fetch from Firestore if connected
//     if (admin.apps.length > 0) {
//       const snapshot = await admin.firestore()
//         .collection('vendorPayouts')
//         .orderBy('timestamp', 'desc')
//         .get();
      
//       payoutsArray = snapshot.docs.map(doc => doc.data());
//     } else {
//       console.warn('Firebase not connected, returning empty payments list');
//     }
    
//     res.json({
//       status: 1,
//       msg: 'Vendor transfers retrieved successfully',
//       count: payoutsArray.length,
//       data: payoutsArray
//     });
//   } catch (error) {
//     console.error('Error fetching transfers:', error);
//     res.status(500).json({
//       status: 0,
//       msg: 'Failed to retrieve transfers',
//       error: {
//         message: error.message,
//         timestamp: new Date().toISOString()
//       }
//     });
//   }
// });

// // Fallback and error handling routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     status: 0,
//     msg: 'API endpoint not found',
//     path: req.originalUrl
//   });
// });

// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({
//     status: 0,
//     msg: 'Internal server error',
//     error: {
//       message: err.message,
//       timestamp: new Date().toISOString()
//     }
//   });
// });

// // Export the Express app for Vercel
// module.exports = app;

// api/index.js
const express = require('express');
const app = express();

// Simple middleware to parse JSON requests
app.use(express.json());

// Basic CORS setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Vendor payment endpoint stub
app.post('/api/vendor-transfer', (req, res) => {
  const { vendor_id, amount, beneficiary_name } = req.body;
  
  // Mock successful response
  res.json({
    status: 1,
    msg: 'Vendor transfer initiated successfully (mock)',
    data: {
      vendor_id: vendor_id || 'test-vendor',
      merchant_ref_id: `PAYOUT${Date.now()}`,
      amount: amount || '100.00',
      beneficiary_name: beneficiary_name || 'Test Vendor',
      status: 'initiated',
      timestamp: new Date().toISOString()
    }
  });
});

// Payment status endpoint stub
app.get('/api/vendor-transfer-status/:merchant_ref_id', (req, res) => {
  const { merchant_ref_id } = req.params;
  
  // Mock status response
  res.json({
    status: 1,
    msg: 'Status retrieved successfully (mock)',
    data: {
      merchant_ref_id: merchant_ref_id,
      payout_status: 'completed',
      amount: '100.00',
      beneficiary_name: 'Test Vendor',
      last_updated: new Date().toISOString()
    }
  });
});

// Get all payments endpoint stub
app.get('/api/vendor-transfers', (req, res) => {
  // Mock payments list
  res.json({
    status: 1,
    msg: 'Vendor transfers retrieved successfully (mock)',
    count: 1,
    data: [{
      vendor_id: 'test-vendor',
      merchant_ref_id: `PAYOUT${Date.now() - 1000}`,
      amount: '100.00',
      beneficiary_name: 'Test Vendor',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000).toISOString()
    }]
  });
});
// Add this near your other route handlers
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Vendor Payment API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .endpoint { background: #f5f5f5; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
          code { background: #eee; padding: 2px 4px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Vendor Payment API</h1>
        <p>The API is running successfully. Available endpoints:</p>
        
        <div class="endpoint">
          <strong>GET /api/health</strong> - Check API status
        </div>
        
        <div class="endpoint">
          <strong>GET /api/test</strong> - Test endpoint
        </div>
        
        <div class="endpoint">
          <strong>POST /api/vendor-transfer</strong> - Process a payment
          <pre><code>
{
  "vendor_id": "VENDOR123",
  "amount": "100.00",
  "beneficiary_name": "Vendor Name",
  "beneficiary_upi": "vendor@upi",
  "payment_mode": "UPI",
  "purpose": "Payment for services"
}
          </code></pre>
        </div>
        
        <div class="endpoint">
          <strong>GET /api/vendor-transfer-status/:merchant_ref_id</strong> - Check payment status
        </div>
        
        <div class="endpoint">
          <strong>GET /api/vendor-transfers</strong> - Get all payments
        </div>
        
        <p>Last updated: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});
// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 0,
    msg: 'API endpoint not found'
  });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  });
}

// For Vercel
module.exports = app;
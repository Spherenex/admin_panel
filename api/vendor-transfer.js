// api/vendor-transfer.js - Vercel serverless function for vendor payment transfers

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
      vendorId, 
      amount, 
      transferMode = 'upi',
      accountDetails 
    } = req.body;

    console.log('Vendor transfer request:', { 
      vendorId, 
      amount, 
      transferMode,
      accountDetails: accountDetails ? 'provided' : 'missing'
    });

    // Validate required fields
    if (!vendorId || !amount || amount <= 0) {
      return res.status(400).json({
        error: 'Missing or invalid required fields',
        required_fields: ['vendorId', 'amount (positive number)'],
        received: {
          vendorId: !!vendorId,
          amount: amount,
          valid_amount: amount > 0
        }
      });
    }

    // For development/testing, simulate transfer processing
    // In production, you would integrate with actual payment gateway for transfers
    const transferSimulation = {
      success: true,
      transfer_id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'processed',
      vendor_id: vendorId,
      amount: amount,
      transfer_mode: transferMode,
      processing_fee: Math.round(amount * 0.02 * 100) / 100, // 2% fee
      net_amount: Math.round((amount * 0.98) * 100) / 100,
      timestamp: new Date().toISOString(),
      expected_settlement: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      reference_number: `REF${Date.now()}`
    };

    console.log('Vendor transfer processed (simulated):', transferSimulation);

    return res.status(200).json({
      success: true,
      message: 'Vendor transfer initiated successfully',
      transfer_details: transferSimulation,
      vendor_id: vendorId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing vendor transfer:', error);
    
    return res.status(500).json({
      error: 'Vendor transfer failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

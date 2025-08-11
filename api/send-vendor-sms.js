// api/send-vendor-sms.js - Vercel serverless function for sending SMS notifications to vendors

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
      vendorPhone, 
      vendorName, 
      message, 
      paymentId, 
      amount 
    } = req.body;

    console.log('SMS notification request:', { 
      vendorPhone, 
      vendorName, 
      paymentId, 
      amount,
      messageLength: message ? message.length : 0
    });

    // Validate required fields
    if (!vendorPhone || !vendorName || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required_fields: ['vendorPhone', 'vendorName', 'message'],
        received: {
          vendorPhone: !!vendorPhone,
          vendorName: !!vendorName,
          message: !!message
        }
      });
    }

    // For development/testing, simulate SMS sending
    // In production, you would integrate with actual SMS service like Twilio, AWS SNS, etc.
    const smsSimulation = {
      success: true,
      message_id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      to: vendorPhone,
      message: message,
      cost: 0.05, // Simulated cost
      timestamp: new Date().toISOString(),
      provider: 'SMS_SIMULATION'
    };

    console.log('SMS sent successfully (simulated):', smsSimulation);

    return res.status(200).json({
      success: true,
      message: 'SMS notification sent successfully',
      sms_details: smsSimulation,
      vendor_details: {
        name: vendorName,
        phone: vendorPhone
      },
      payment_reference: paymentId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending SMS notification:', error);
    
    return res.status(500).json({
      error: 'SMS notification failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

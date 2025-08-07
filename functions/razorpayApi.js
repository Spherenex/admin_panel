

// // RazorpayApiService.js - Optimized for production and development

// // Production API URL - Update this with your deployed Vercel app URL
// const PRODUCTION_API_URL = 'https://admin-panel-mu-sepia.vercel.app/api';

// // List of possible local server addresses to try
// const LOCAL_DEVELOPMENT_URLS = [
//   // Try localhost first (most common)
//   'http://localhost:3000/api',
//   'http://localhost:3001/api',
  
//   // Include a few more common IPs for local development
//   'http://192.168.1.2:5000/api',
//   'http://192.168.1.3:5000/api',
//   'http://192.168.1.4:5000/api',
//   'http://192.168.1.5:5000/api',
  
//   // Fallback to the production URL if none of the above work
//   PRODUCTION_API_URL
// ];

// // Storage for the successful API URL
// let discoveredApiUrl = null;

// // Function to find a working API server
// const discoverApiServer = async () => {
//   // If we're in production, use the production URL directly
//   if (window.location.hostname !== 'localhost' && 
//       !window.location.hostname.startsWith('192.168.')) {
//     console.log('Production environment detected, using production API URL');
//     return PRODUCTION_API_URL;
//   }
  
//   // If we've already found a working URL, reuse it
//   if (discoveredApiUrl) {
//     return discoveredApiUrl;
//   }
  
//   console.log('Discovering Razorpay API server...');
  
//   // Try each URL until we find one that works
//   for (const url of LOCAL_DEVELOPMENT_URLS) {
//     try {
//       console.log(`Trying API server at: ${url}`);
      
//       // Set a shorter timeout for faster discovery
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 1000);
      
//       const response = await fetch(`${url}/health`, {
//         signal: controller.signal
//       });
      
//       clearTimeout(timeoutId);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Found working API server:', url);
//         console.log('Server info:', data);
        
//         // Save the working URL for future requests
//         discoveredApiUrl = url;
//         return url;
//       }
//     } catch (error) {
//       // Ignore errors and try the next URL
//       console.log(`Server at ${url} not available:`, error.name);
//     }
//   }
  
//   // If we reach here, none of the URLs worked
//   console.error('Could not find a working API server');
  
//   // Fall back to the production URL
//   return PRODUCTION_API_URL;
// };

// // Function to call the API with automatic server discovery
// export const callApi = async (endpoint, method = 'GET', data = null) => {
//   try {
//     // Discover the API server if needed
//     const apiBaseUrl = await discoverApiServer();
    
//     // Make sure endpoint starts with a slash if needed
//     const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//     const url = `${apiBaseUrl}${formattedEndpoint}`;
    
//     console.log(`Calling API: ${method} ${url}`);
    
//     const options = {
//       method,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };
    
//     if (data) {
//       options.body = JSON.stringify(data);
//     }
    
//     const response = await fetch(url, options);
    
//     if (!response.ok) {
//       throw new Error(`API error: ${response.status} ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('API call error:', error);
//     throw error;
//   }
// };

// // Razorpay API functions
// export const RazorpayService = {
//   // Create a new order
//   createOrder: async (amount, currency = 'INR', receipt = null) => {
//     try {
//       const orderData = await callApi('/create-razorpay-order', 'POST', {
//         amount,
//         currency,
//         receipt: receipt || `receipt_${Date.now()}`
//       });
//       return orderData;
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   },
  
//   // Verify payment after completion
//   verifyPayment: async (paymentData) => {
//     try {
//       const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
      
//       const result = await callApi('/verify-razorpay-payment', 'POST', {
//         razorpay_payment_id,
//         razorpay_order_id,
//         razorpay_signature
//       });
      
//       return result;
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       throw error;
//     }
//   },
  
//   // Get payment status
//   getPaymentStatus: async (paymentId) => {
//     try {
//       return await callApi(`/payment-status/${paymentId}`, 'GET');
//     } catch (error) {
//       console.error('Error getting payment status:', error);
//       throw error;
//     }
//   },
  
//   // Function to load Razorpay script
//   loadScript: () => {
//     return new Promise((resolve) => {
//       // Check if the script is already loaded
//       if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
//         // Check if the global object is available
//         if (window.Razorpay) {
//           console.log('Razorpay script already loaded');
//           resolve(true);
//           return;
//         }
        
//         // If script exists but global object is not available, wait a bit
//         const checkInterval = setInterval(() => {
//           if (window.Razorpay) {
//             console.log('Razorpay global object became available');
//             clearInterval(checkInterval);
//             resolve(true);
//           }
//         }, 100);
        
//         // Set a timeout to prevent infinite waiting
//         setTimeout(() => {
//           clearInterval(checkInterval);
//           console.error('Timed out waiting for Razorpay global object');
//           resolve(false);
//         }, 5000);
        
//         return;
//       }
      
//       // Create and load the script
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
//       script.onload = () => {
//         console.log('Razorpay script loaded successfully');
//         resolve(true);
//       };
      
//       script.onerror = () => {
//         console.error('Failed to load Razorpay script');
//         resolve(false);
//       };
      
//       document.body.appendChild(script);
//     });
//   },
  
//   // Initialize and open Razorpay checkout
//   openCheckout: (options) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         // Ensure Razorpay script is loaded
//         const scriptLoaded = await RazorpayService.loadScript();
//         if (!scriptLoaded) {
//           throw new Error('Failed to load Razorpay script');
//         }
        
//         // Check if Razorpay is available
//         if (!window.Razorpay) {
//           throw new Error('Razorpay SDK not loaded');
//         }
        
//         // Add handler for success and dismiss if not already provided
//         if (!options.handler) {
//           options.handler = function(response) {
//             resolve(response);
//           };
//         }
        
//         if (!options.modal || !options.modal.ondismiss) {
//           if (!options.modal) options.modal = {};
//           options.modal.ondismiss = function() {
//             console.log("Payment dismissed by user");
//             reject(new Error('Payment cancelled by user'));
//           };
//         }
        
//         // Create Razorpay instance
//         const razorpay = new window.Razorpay(options);
        
//         // Add payment.failed event listener if not already added
//         razorpay.on('payment.failed', function(response) {
//           console.error('Payment failed:', response.error);
//           reject(new Error(response.error.description || 'Payment failed'));
//         });
        
//         // Open Razorpay checkout
//         razorpay.open();
//       } catch (error) {
//         console.error('Error opening Razorpay:', error);
//         reject(error);
//       }
//     });
//   }
// };

// export default RazorpayService;



// razorpayApi.js - Enhanced API service for Razorpay integration

// Configuration for different environments
const CONFIG = {
  production: {
    apiUrl: 'https://zappcart-api.herokuapp.com/api',
    razorpayKeyId: 'rzp_test_psQiRu5RCF99Dp'
  },
  development: {
    apiUrl: 'http://localhost:5000/api',
    razorpayKeyId: 'rzp_test_psQiRu5RCF99Dp'
  },
  // FIXED: Corrected Vercel URL
  vercel: {
    apiUrl: 'https://admin-panel-mu-sepia.vercel.app/api',
    razorpayKeyId: 'rzp_test_psQiRu5RCF99Dp'
  }
};

// Cache for discovered API URL
let discoveredApiUrl = null;
let razorpayScriptLoaded = false;

/**
 * Determines the current environment
 * @returns {string} The current environment ('production', 'development', or 'vercel')
 */
const getEnvironment = () => {
  const hostname = window.location.hostname;
  
  // FIXED: Removed protocol and trailing slash
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname === 'admin-panel-mu-sepia.vercel.app') {
    return 'vercel';
  } else if (hostname === 'zappcart-control-panel.web.app' || 
             hostname === 'zappcart-control-panel.firebaseapp.com') {
    return 'production';
  }
  
  // Default to development for any other hostname
  console.warn(`Unknown hostname: ${hostname}, defaulting to development config`);
  return 'development';
};

/**
 * Get the configuration for the current environment
 * @returns {Object} The configuration for the current environment
 */
const getConfig = () => {
  const env = getEnvironment();
  return CONFIG[env] || CONFIG.development;
};

/**
 * List of possible local server addresses to try in development mode
 */
const LOCAL_DEVELOPMENT_URLS = [
  // Try localhost first (most common)
  'http://localhost:3001/api',
  'http://localhost:5000/api',
  
  // Include local network IPs for mobile testing
  'http://192.168.1.2:3000/api',
  'http://192.168.1.3:3000/api',
  'http://192.168.1.4:3000/api',
  'http://192.168.1.5:3000/api',
  
  // Some common Docker bridge IPs
  'http://172.17.0.1:5000/api',
  'http://172.18.0.1:5000/api',
  
  // Fallback to the production URL if none of the above work
  CONFIG.production.apiUrl
];

/**
 * Discover the API server by trying multiple URLs
 * @returns {Promise<string>} The URL of the working API server
 */
const discoverApiServer = async () => {
  const env = getEnvironment();
  
  // If we're not in development, use the configured API URL
  if (env !== 'development') {
    return CONFIG[env].apiUrl;
  }
  
  // If we've already found a working URL, reuse it
  if (discoveredApiUrl) {
    return discoveredApiUrl;
  }
  
  console.log('Discovering Razorpay API server...');
  
  // Try each URL until we find one that works
  for (const url of LOCAL_DEVELOPMENT_URLS) {
    try {
      console.log(`Trying API server at: ${url}`);
      
      // Set a shorter timeout for faster discovery
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      
      const response = await fetch(`${url}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Found working API server:', url);
        console.log('Server info:', data);
        
        // Save the working URL for future requests
        discoveredApiUrl = url;
        return url;
      }
    } catch (error) {
      // Ignore errors and try the next URL
      console.log(`Server at ${url} not available:`, error.name);
    }
  }
  
  // If we reach here, none of the URLs worked
  console.error('Could not find a working API server');
  
  // Fall back to the configured URL for the current environment
  return CONFIG[env].apiUrl;
};

/**
 * Loads the Razorpay checkout script
 * @returns {Promise<boolean>} True if the script was loaded successfully
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      razorpayScriptLoaded = true;
      resolve(true);
      return;
    }
    
    // Check if the script is already in the document
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      // Script exists but Razorpay object isn't available yet
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkInterval);
          razorpayScriptLoaded = true;
          resolve(true);
        }
      }, 100);
      
      // Set a timeout to prevent infinite waiting
      setTimeout(() => {
        clearInterval(checkInterval);
        console.error('Timed out waiting for Razorpay global object');
        resolve(false);
      }, 5000);
      
      return;
    }
    
    // Create and load the script
    console.log('Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      razorpayScriptLoaded = true;
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

/**
 * Makes an API call to the discovered server
 * @param {string} endpoint - The API endpoint
 * @param {string} method - The HTTP method
 * @param {Object} data - The data to send
 * @returns {Promise<Object>} The API response
 */
const callApi = async (endpoint, method = 'GET', data = null) => {
  try {
    // Discover the API server if needed
    const apiBaseUrl = await discoverApiServer();
    
    // Ensure endpoint starts with a slash if needed
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${apiBaseUrl}${formattedEndpoint}`;
    
    console.log(`Calling API: ${method} ${url}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include' // Include cookies for CORS requests
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    options.signal = controller.signal;
    
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    
    // Check for non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', text.substring(0, 100) + '...');
      throw new Error(`Expected JSON response but got: ${contentType || 'unknown content type'}`);
    }
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || `API error: ${response.status} ${response.statusText}`);
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API call timed out:', endpoint);
      throw new Error('API request timed out. Please try again later.');
    }
    
    console.error('API call error:', error);
    throw error;
  }
};

/**
 * Razorpay service for handling payments
 */
const RazorpayService = {
  /**
   * Get the Razorpay key ID for the current environment
   * @returns {string} The Razorpay key ID
   */
  getKeyId: () => {
    const config = getConfig();
    return config.razorpayKeyId;
  },
  
  /**
   * Ensures the Razorpay script is loaded
   * @returns {Promise<boolean>} True if the script was loaded successfully
   */
  ensureScriptLoaded: async () => {
    if (razorpayScriptLoaded) return true;
    return await loadRazorpayScript();
  },
  
  /**
   * Create a new Razorpay order
   * @param {number} amount - The amount in the smallest currency unit
   * @param {string} currency - The currency code (default: INR)
   * @param {string} receipt - The receipt ID (default: generated)
   * @returns {Promise<Object>} The created order
   */
  createOrder: async (amount, currency = 'INR', receipt = null) => {
    try {
      const orderData = await callApi('/create-razorpay-order', 'POST', {
        amount,
        currency,
        receipt: receipt || `receipt_${Date.now()}`
      });
      return orderData;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  },
  
  /**
   * Verify a Razorpay payment
   * @param {Object} paymentData - The payment data to verify
   * @returns {Promise<Object>} The verification result
   */
  verifyPayment: async (paymentData) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
      
      const result = await callApi('/verify-razorpay-payment', 'POST', {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      });
      
      return result;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      throw error;
    }
  },
  
  /**
   * Get the status of a payment
   * @param {string} paymentId - The payment ID
   * @returns {Promise<Object>} The payment status
   */
  getPaymentStatus: async (paymentId) => {
    try {
      return await callApi(`/payment-status/${paymentId}`, 'GET');
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },
  
  /**
   * Open the Razorpay checkout
   * @param {Object} options - The checkout options
   * @param {Function} onSuccess - The success callback
   * @param {Function} onDismiss - The dismiss callback
   */
  openCheckout: async (options, onSuccess, onDismiss) => {
    try {
      // Ensure the Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK not loaded');
      }
      
      // Ensure options has the correct key ID
      const config = getConfig();
      if (!options.key) {
        options.key = config.razorpayKeyId;
      }
      
      // Create the Razorpay instance
      const razorpay = new window.Razorpay(options);
      
      // Set up event handlers
      razorpay.on('payment.success', (response) => {
        onSuccess(response);
      });
      
      razorpay.on('payment.error', (error) => {
        console.error('Payment error:', error);
        onDismiss(error);
      });
      
      // Open the checkout
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      onDismiss(error);
      throw error;
    }
  },
  
  /**
   * Make a test call to the server to check its status
   * @returns {Promise<Object>} The server status
   */
  checkServerStatus: async () => {
    try {
      // IMPORTANT: For health check reliability, add retry logic
      let retries = 3;
      let lastError = null;
      
      while (retries > 0) {
        try {
          console.log(`🔍 Checking payment server status... (${retries} retries left)`);
          console.log(`Environment: ${getEnvironment()}`);
          
          const apiBaseUrl = await discoverApiServer();
          const healthEndpoint = `${apiBaseUrl}/health`;
          
          console.log(`🚀 Attempting connection to: ${healthEndpoint}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(healthEndpoint, { 
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          });
          
          clearTimeout(timeoutId);
          
          console.log(`✅ Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            return {
              status: 'online',
              data
            };
          } else {
            console.log(`⚠️ Payment server returned an error response: ${response.status}`);
            retries--;
            lastError = new Error(`Server returned ${response.status}`);
          }
        } catch (error) {
          console.log(`❌ Primary endpoint failed: ${error.message}`);
          retries--;
          lastError = error;
          
          // Try a fallback for connection timeouts
          if (error.name === 'AbortError') {
            console.log('🔄 Trying fallback health endpoint...');
            try {
              // Try root endpoint as fallback
              const apiBaseUrl = CONFIG[getEnvironment()].apiUrl.replace(/\/api$/, '');
              const response = await fetch(`${apiBaseUrl}/api/health`, { timeout: 5000 });
              
              if (response.ok) {
                const data = await response.json();
                return {
                  status: 'online',
                  data,
                  note: 'Connected via fallback endpoint'
                };
              }
            } catch (fallbackError) {
              console.log(`❌ Fallback endpoint also failed: ${fallbackError.message}`);
            }
          }
        }
        
        // Wait before retrying
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      return {
        status: 'offline',
        error: lastError?.message || 'Unknown error'
      };
    } catch (error) {
      console.error('Server health check failed:', error);
      return {
        status: 'offline',
        error: error.message
      };
    }
  },
  
  /**
   * Create a mock order for testing
   * @param {number} amount - The amount
   * @returns {Object} A mock order object
   */
  createMockOrder: (amount) => {
    return {
      id: `order_mock_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_mock_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };
  }
};

export default RazorpayService;
export { callApi, loadRazorpayScript, discoverApiServer };
// Test if the health function is exported correctly
const healthFunction = require('./api/health');

// Check if it's a function
if (typeof healthFunction === 'function') {
  console.log('✅ health.js exports a function correctly!');
  
  // Mock request and response objects
  const req = {};
  const res = {
    status: (code) => ({
      json: (data) => {
        console.log('Response status:', code);
        console.log('Response data:', data);
      }
    }),
    setHeader: () => {}
  };
  
  // Execute the function
  try {
    healthFunction(req, res);
    console.log('✅ Function executed without errors');
  } catch (error) {
    console.error('❌ Function execution failed:', error);
  }
} else {
  console.error('❌ health.js does not export a function!');
  console.log('Exported value type:', typeof healthFunction);
  console.log('Exported value:', healthFunction);
}
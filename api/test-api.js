// api/test-api.js
const express = require('express');
const app = express();

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});
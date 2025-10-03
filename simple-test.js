// Simple test server to debug Railway deployment
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Start server with error handling
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});

module.exports = app;

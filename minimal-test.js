// Minimal test server for Railway
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    message: 'Server is working!'
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});

module.exports = app;

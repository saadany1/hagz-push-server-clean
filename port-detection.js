// Test server that tries to detect what port Railway expects
const express = require('express');
const app = express();

// Try to detect the correct port
const PORT = process.env.PORT || process.env.RAILWAY_PORT || 8080;

console.log('🚀 Starting Railway port detection server...');
console.log('📋 Port detection:', {
  PORT: process.env.PORT,
  RAILWAY_PORT: process.env.RAILWAY_PORT,
  'Final PORT': PORT
});

app.get('/health', (req, res) => {
  console.log('✅ Health check received from:', req.ip);
  res.json({ 
    status: 'OK', 
    port: PORT,
    timestamp: new Date().toISOString(),
    message: 'Port detection server working!'
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!', port: PORT });
});

// Try to start on the detected port
const server = app.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log(`🚀 Server started successfully!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 Address: ${JSON.stringify(address)}`);
  console.log(`🌐 Ready to accept connections`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  console.log('🔄 Trying alternative port...');
  
  // Try alternative port
  const altPort = PORT === 8080 ? 3000 : 8080;
  const altServer = app.listen(altPort, '0.0.0.0', () => {
    console.log(`🚀 Alternative server started on port ${altPort}`);
  });
  
  altServer.on('error', (altError) => {
    console.error('❌ Alternative server also failed:', altError);
    process.exit(1);
  });
});

module.exports = app;

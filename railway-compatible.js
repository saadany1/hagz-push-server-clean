// Railway-compatible server
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting Railway-compatible server...');
console.log('📋 Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'
});

// Basic middleware
app.use(express.json());

// Root endpoint (Railway sometimes checks this)
app.get('/', (req, res) => {
  console.log('✅ Root endpoint requested');
  res.json({ 
    status: 'OK', 
    message: 'Railway server is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    message: 'Server is working!'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!', port: PORT });
});

// Start server with explicit binding
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Server is ready to accept connections`);
  console.log(`🔗 Server address: ${JSON.stringify(server.address())}`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;

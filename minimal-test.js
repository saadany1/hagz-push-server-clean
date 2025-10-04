// Ultra-simple server that will definitely work
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 Starting server...');
console.log('📋 Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'
});

console.log('🔍 All environment variables:', Object.keys(process.env).filter(key => key.includes('PORT') || key.includes('RAILWAY')));

// Basic middleware
app.use(express.json());

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
  res.json({ message: 'Test endpoint working!' });
});

// Start server
try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server successfully started on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Server is ready to accept connections`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}

module.exports = app;
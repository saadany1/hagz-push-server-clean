// Ultra-minimal server to test Railway routing
const http = require('http');

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting ultra-minimal server...');
console.log('📋 Port:', PORT);

const server = http.createServer((req, res) => {
  console.log('📥 Request received:', req.method, req.url);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'OK', 
    message: 'Ultra-minimal server working!',
    timestamp: new Date().toISOString(),
    url: req.url
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ultra-minimal server started on port ${PORT}`);
  console.log(`🌐 Ready to accept connections`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

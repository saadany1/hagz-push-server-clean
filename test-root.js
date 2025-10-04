// Test the root endpoint instead of health
const https = require('https');

const SERVER_URL = 'https://hagz-production-11b7.up.railway.app';

console.log('🔍 Testing Railway root endpoint...');
console.log('📡 Server URL:', SERVER_URL);

// Test root endpoint
const req = https.get(`${SERVER_URL}/`, (res) => {
  console.log('📊 Response status:', res.statusCode);
  console.log('📋 Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('📄 Response body:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ Root endpoint is working!');
    } else {
      console.log('❌ Root endpoint returned error:', res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request failed:', err.message);
});

req.setTimeout(10000, () => {
  console.log('⏰ Request timeout');
  req.destroy();
});

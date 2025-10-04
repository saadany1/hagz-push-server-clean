// Simple test to check Railway routing
const https = require('https');

const SERVER_URL = 'https://hagz-production-11b7.up.railway.app';

console.log('🔍 Testing Railway server routing...');
console.log('📡 Server URL:', SERVER_URL);

// Test with a simple GET request
const req = https.get(`${SERVER_URL}/health`, (res) => {
  console.log('📊 Response status:', res.statusCode);
  console.log('📋 Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('📄 Response body:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ Server is working!');
    } else {
      console.log('❌ Server returned error:', res.statusCode);
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
// Test with different approaches to bypass caching
const https = require('https');

const SERVER_URL = 'https://hagz-production-11b7.up.railway.app';

console.log('🔍 Testing Railway server with different approaches...');

// Test 1: Root endpoint with cache-busting
function testRoot() {
  return new Promise((resolve, reject) => {
    const url = `${SERVER_URL}/?t=${Date.now()}`;
    console.log('📡 Testing root endpoint:', url);
    
    const req = https.get(url, (res) => {
      console.log('📊 Root response status:', res.statusCode);
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📄 Root response body:', data);
        resolve({ status: res.statusCode, body: data });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      console.log('⏰ Root request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Test 2: Health endpoint with cache-busting
function testHealth() {
  return new Promise((resolve, reject) => {
    const url = `${SERVER_URL}/health?t=${Date.now()}`;
    console.log('📡 Testing health endpoint:', url);
    
    const req = https.get(url, (res) => {
      console.log('📊 Health response status:', res.statusCode);
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📄 Health response body:', data);
        resolve({ status: res.statusCode, body: data });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      console.log('⏰ Health request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Test 3: Test endpoint
function testTest() {
  return new Promise((resolve, reject) => {
    const url = `${SERVER_URL}/test?t=${Date.now()}`;
    console.log('📡 Testing test endpoint:', url);
    
    const req = https.get(url, (res) => {
      console.log('📊 Test response status:', res.statusCode);
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📄 Test response body:', data);
        resolve({ status: res.statusCode, body: data });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      console.log('⏰ Test request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Run all tests
async function runTests() {
  try {
    console.log('🚀 Starting comprehensive Railway tests...\n');
    
    console.log('=== TEST 1: Root Endpoint ===');
    await testRoot();
    console.log('');
    
    console.log('=== TEST 2: Health Endpoint ===');
    await testHealth();
    console.log('');
    
    console.log('=== TEST 3: Test Endpoint ===');
    await testTest();
    console.log('');
    
    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();

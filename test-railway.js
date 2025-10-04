// Test script to send notifications via Railway server
const https = require('https');

const SERVER_URL = 'https://hagz-production-11b7.up.railway.app';

// Test server health
function testHealth() {
  return new Promise((resolve, reject) => {
    const url = `${SERVER_URL}/health`;
    console.log('🔍 Testing server health:', url);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Health check response:', data);
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      console.error('❌ Health check failed:', err.message);
      reject(err);
    });
  });
}

// Test sending notification to all users
function sendNotificationToAll() {
  return new Promise((resolve, reject) => {
    const url = `${SERVER_URL}/send-notification-to-all`;
    const postData = JSON.stringify({
      title: 'HAGZ Test',
      body: 'This is a test notification from Railway server!',
      data: { test: true }
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('📤 Sending notification to all users:', url);
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Notification response:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (err) => {
      console.error('❌ Notification failed:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log('🚀 Starting Railway server tests...\n');
    
    // Test 1: Health check
    console.log('=== TEST 1: Health Check ===');
    await testHealth();
    console.log('');
    
    // Test 2: Send notification
    console.log('=== TEST 2: Send Notification ===');
    await sendNotificationToAll();
    console.log('');
    
    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = { testHealth, sendNotificationToAll };

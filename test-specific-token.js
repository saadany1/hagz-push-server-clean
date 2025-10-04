// Test sending notification to a specific token
const https = require('https');

const SERVER_URL = 'https://hagz-push-server-clean-production.up.railway.app';

// Test sending to a specific token
function testSpecificToken(token) {
  return new Promise((resolve, reject) => {
    const url = `${SERVER_URL}/test-token`;
    const postData = JSON.stringify({
      token: token,
      title: 'HAGZ Test',
      body: 'Testing specific token delivery',
      data: { test: true }
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('📤 Testing specific token:', token);
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('📊 Response status:', res.statusCode);
        console.log('📄 Response body:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request failed:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Test with the token you mentioned
const testToken = 'ExponentPushToken[EPyomKCMj65gpaCyJf6jmF]';

console.log('🧪 Testing specific token delivery...');
testSpecificToken(testToken)
  .then(result => {
    console.log('✅ Test completed:', result);
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
  });

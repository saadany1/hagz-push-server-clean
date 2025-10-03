// Test script for push notifications
const { sendPushNotifications } = require('./pushNotificationSender');

async function testNotification() {
  console.log('🧪 Testing push notification...');
  
  // Replace with your actual token
  const testToken = 'ExponentPushToken[c-mLLnDKvCgMvBcqq5NYwL]';
  
  const result = await sendPushNotifications(
    [testToken],
    'HAGZ',
    'Test notification from server!',
    { 
      screen: 'More',
      test: true,
      timestamp: new Date().toISOString()
    }
  );
  
  console.log('🧪 Test result:', result);
}

// Run test if called directly
if (require.main === module) {
  testNotification().then(() => {
    console.log('✅ Test completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testNotification };

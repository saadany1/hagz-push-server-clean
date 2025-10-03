// Push Notification Sender using Expo Push Service
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notifications to multiple users
 */
async function sendPushNotifications(tokens, title, body, data = {}) {
  console.log(`📤 Sending push notifications to ${tokens.length} devices...`);
  console.log('🔍 Debug - Token validation:', tokens.map(token => ({
    token: token.substring(0, 20) + '...',
    isValid: Expo.isExpoPushToken(token),
    length: token.length
  })));

  // Create the messages that you want to send to clients
  const messages = [];
  
  for (const pushToken of tokens) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`❌ Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message
    messages.push({
      to: pushToken,
      sound: 'notification_sound.wav',
      title: 'HAGZ',
      body: body,
      data: data,
      priority: 'high',
    });
  }

  // The Expo push notification service accepts batches of notifications
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  
  // Send the chunks to the Expo push notification service
  for (const chunk of chunks) {
    try {
      console.log('📤 Sending chunk with messages:', chunk.map(m => ({
        to: m.to.substring(0, 20) + '...',
        title: m.title,
        body: m.body?.substring(0, 50) + '...'
      })));
      
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('📨 Sent chunk response:', ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('❌ Error sending chunk:', error);
      console.error('❌ Chunk details:', chunk);
    }
  }

  // Count results
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens = [];

  tickets.forEach((ticket, index) => {
    if (ticket.status === 'ok') {
      successCount++;
      console.log(`✅ Successfully sent to ${tokens[index].substring(0, 20)}...`);
    } else {
      failureCount++;
      console.error(`❌ Failed to send notification to ${tokens[index]}:`, ticket);
      
      // Collect invalid tokens for cleanup
      if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
        invalidTokens.push(tokens[index]);
        console.log(`🧹 Marking token as invalid: ${tokens[index].substring(0, 20)}...`);
      }
    }
  });

  console.log(`✅ Results: ${successCount} success, ${failureCount} failed`);
  
  return {
    success: successCount,
    failed: failureCount,
    total: tokens.length,
    invalidTokens,
    tickets
  };
}

/**
 * Send broadcast notification to all users
 */
async function sendBroadcastNotification(title, message, userTokens, data = {}) {
  console.log('📢 Sending broadcast notification...');
  
  const result = await sendPushNotifications(
    userTokens,
    title,
    message,
    {
      ...data,
      type: 'broadcast',
      screen: 'More'
    }
  );
  
  return result;
}

module.exports = {
  sendPushNotifications,
  sendBroadcastNotification
};

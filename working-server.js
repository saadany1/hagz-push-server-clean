// Working Railway server with notification functionality
const express = require('express');
const { Expo } = require('expo-server-sdk');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const expo = new Expo();

console.log('🚀 Starting Railway notification server...');
console.log('📋 Environment:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_ROLE_KEY: supabaseKey ? 'SET' : 'NOT SET'
});

// Basic middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint requested');
  res.json({ 
    status: 'OK', 
    message: 'Railway notification server is working!',
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

// Send notification to all users
app.post('/send-notification-to-all', async (req, res) => {
  try {
    console.log('📤 Sending notification to all users...');
    
    const { title = 'HAGZ', body, data = {} } = req.body;
    
    // Get all users with push tokens
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('push_token')
      .not('push_token', 'is', null);
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
    
    if (!users || users.length === 0) {
      console.log('⚠️ No users with push tokens found');
      return res.json({ 
        success: true, 
        message: 'No users with push tokens found',
        sent: 0 
      });
    }
    
    // Filter valid Expo push tokens
    const validTokens = users
      .map(user => user.push_token)
      .filter(token => Expo.isExpoPushToken(token));
    
    if (validTokens.length === 0) {
      console.log('⚠️ No valid Expo push tokens found');
      return res.json({ 
        success: true, 
        message: 'No valid Expo push tokens found',
        sent: 0 
      });
    }
    
    console.log(`📱 Sending to ${validTokens.length} valid tokens`);
    
    // Create messages
    const messages = validTokens.map(token => ({
      to: token,
      title: title,
      body: body || 'New notification from HAGZ!',
      data: data,
      sound: 'default',
      priority: 'high'
    }));
    
    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log(`✅ Sent chunk of ${chunk.length} notifications`);
      } catch (error) {
        console.error('❌ Error sending chunk:', error);
      }
    }
    
    console.log(`🎉 Successfully sent ${tickets.length} notifications`);
    
    res.json({
      success: true,
      message: `Sent ${tickets.length} notifications`,
      sent: tickets.length,
      totalTokens: validTokens.length
    });
    
  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    res.status(500).json({ 
      error: 'Failed to send notifications', 
      details: error.message 
    });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!', port: PORT });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Server is ready to accept connections`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

module.exports = app;

// Keep-alive script to prevent Render spin down
// Run this with: node keep-alive.js

const https = require('https');

function pingBackend() {
  const url = 'https://algolend-ai-backend.onrender.com/health';
  
  https.get(url, (res) => {
    console.log(`✅ Ping successful at ${new Date().toISOString()}`);
  }).on('error', (err) => {
    console.log(`❌ Ping failed: ${err.message}`);
  });
}

// Ping every 10 minutes (600 seconds)
setInterval(pingBackend, 10 * 60 * 1000);

// Ping immediately
pingBackend();

console.log('🔄 Keep-alive script started. Pinging every 10 minutes...');

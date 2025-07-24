const axios = require('axios');
require('dotenv').config();

async function testShortIO() {
  const apiKey = process.env.SHORTIO_API_KEY;
  console.log('🔍 Testing Short.io API...');
  console.log('API Key:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }
  
  try {
    const testUrl = 'https://zoom.us/oauth/authorize?test=123';
    console.log('📝 Testing URL:', testUrl);
    
    const response = await axios.post('https://api.short.io/links', {
      originalURL: testUrl,
      domain: 'short.io',
      allowDuplicates: true, // Allow duplicates for testing
      tags: ['test', 'la-nube-bot']
    }, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Success!');
    console.log('Short URL:', response.data.shortURL);
    console.log('Full response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
  }
}

testShortIO();

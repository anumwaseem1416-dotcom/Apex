// Test script to verify credit connection
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testCreditConnection() {
  try {
    console.log('Testing credit connection...');
    
    // Test getting all credits
    const creditsResponse = await axios.get(`${API_BASE_URL}/credits`, {
      headers: {
        'Authorization': 'Bearer your-token-here' // Replace with actual token
      }
    });
    
    console.log('Credits response:', creditsResponse.data);
    
    // Test getting all sales
    const salesResponse = await axios.get(`${API_BASE_URL}/sales`, {
      headers: {
        'Authorization': 'Bearer your-token-here' // Replace with actual token
      }
    });
    
    console.log('Sales response:', salesResponse.data);
    
  } catch (error) {
    console.error('Error testing connection:', error.response?.data || error.message);
  }
}

testCreditConnection();
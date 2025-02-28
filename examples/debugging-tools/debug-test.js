/**
 * Debug Test for Cloudflare Browser Rendering
 * 
 * This script helps debug issues with the Browser Rendering binding
 * by making a request to the info endpoint of the Worker.
 */

const axios = require('axios');

// The URL of the deployed Worker
// Replace YOUR_WORKER_URL_HERE with your actual worker URL when testing
const WORKER_URL = 'https://YOUR_WORKER_URL_HERE';

/**
 * Test the info endpoint
 */
async function testInfoEndpoint() {
  console.log('Testing info endpoint...');
  
  try {
    // Make a request to the info endpoint
    const response = await axios.get(`${WORKER_URL}/info`);
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error testing info endpoint:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
}

/**
 * Main function to run the tests
 */
async function runTests() {
  try {
    // Test the info endpoint
    await testInfoEndpoint();
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
  }
}

// Run the tests
runTests();

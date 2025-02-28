/**
 * Content Test for Cloudflare Browser Rendering
 * 
 * This script tests the content fetching functionality of the Worker
 * by making a request to the content endpoint.
 */

const axios = require('axios');

// The URL of the deployed Worker
// Replace YOUR_WORKER_URL_HERE with your actual worker URL when testing
const WORKER_URL = 'https://YOUR_WORKER_URL_HERE';

/**
 * Test the content endpoint
 */
async function testContentEndpoint() {
  console.log('Testing content endpoint...');
  
  try {
    // Make a request to the content endpoint
    const response = await axios.post(`${WORKER_URL}/content`, {
      url: 'https://example.com',
      rejectResourceTypes: ['image', 'font', 'media'],
    });
    
    console.log('Response status:', response.status);
    console.log('Content length:', response.data.content.length);
    console.log('Content preview:', response.data.content.substring(0, 200) + '...');
    
    return response.data.content;
  } catch (error) {
    console.error('Error testing content endpoint:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Main function to run the tests
 */
async function runTests() {
  try {
    // Test the content endpoint
    await testContentEndpoint();
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
  }
}

// Run the tests
runTests();

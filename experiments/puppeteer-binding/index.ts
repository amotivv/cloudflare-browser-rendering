/**
 * Experiment: Cloudflare Browser Rendering Workers Binding API with Puppeteer
 * 
 * Note: This is a simulation of how you would use the Cloudflare Browser Rendering
 * Workers Binding API with Puppeteer. In a real implementation, this code would
 * run within a Cloudflare Worker with the Browser Rendering binding.
 */

// In a real Cloudflare Worker, you would import Puppeteer like this:
// import puppeteer from '@cloudflare/puppeteer';

/**
 * Simulated function to navigate through Cloudflare documentation and extract structured information
 */
async function navigateAndExtractContent() {
  console.log('Simulating Puppeteer navigation and content extraction...');
  
  // In a real implementation, you would initialize Puppeteer like this:
  /*
  const browser = await puppeteer.launch({
    // Browser Rendering specific options
    userDataDir: '/tmp/puppeteer_user_data',
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to Cloudflare docs
    await page.goto('https://developers.cloudflare.com/browser-rendering/', {
      waitUntil: 'networkidle0',
    });
    
    // Extract headings
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3');
      return Array.from(headingElements).map(el => ({
        level: el.tagName.toLowerCase(),
        text: el.textContent?.trim() || '',
      }));
    });
    
    // Extract code examples
    const codeExamples = await page.evaluate(() => {
      const codeElements = document.querySelectorAll('pre code');
      return Array.from(codeElements).map(el => ({
        language: el.className.replace('language-', ''),
        code: el.textContent?.trim() || '',
      }));
    });
    
    // Navigate to a different section
    await page.click('a[href*="rest-api"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Extract API endpoints
    const apiEndpoints = await page.evaluate(() => {
      const endpointElements = document.querySelectorAll('.endpoint');
      return Array.from(endpointElements).map(el => ({
        method: el.querySelector('.method')?.textContent?.trim() || '',
        path: el.querySelector('.path')?.textContent?.trim() || '',
        description: el.querySelector('.description')?.textContent?.trim() || '',
      }));
    });
    
    return {
      headings,
      codeExamples,
      apiEndpoints,
    };
  } finally {
    // In a real implementation with session reuse, you would use:
    // await browser.disconnect();
    // Instead of:
    // await browser.close();
  }
  */
  
  // For this simulation, we'll return mock data
  return {
    headings: [
      { level: 'h1', text: 'Browser Rendering' },
      { level: 'h2', text: 'Overview' },
      { level: 'h2', text: 'REST API' },
      { level: 'h3', text: 'Content Endpoint' },
      { level: 'h3', text: 'Screenshot Endpoint' },
      { level: 'h2', text: 'Workers Binding API' },
    ],
    codeExamples: [
      {
        language: 'javascript',
        code: `
// Example of using the REST API
fetch('https://browser-rendering.example.workers.dev/content', {
  method: 'POST',
  body: JSON.stringify({
    url: 'https://example.com',
    rejectResourceTypes: ['image', 'font']
  })
})
.then(response => response.json())
.then(data => console.log(data.content));
        `
      },
      {
        language: 'javascript',
        code: `
// Example of using the Workers Binding API
import puppeteer from '@cloudflare/puppeteer';

export default {
  async fetch(request, env) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const content = await page.content();
    await browser.disconnect();
    return new Response(content);
  }
};
        `
      }
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/content',
        description: 'Fetches rendered HTML content from a URL'
      },
      {
        method: 'POST',
        path: '/screenshot',
        description: 'Captures a screenshot of a web page'
      },
      {
        method: 'POST',
        path: '/pdf',
        description: 'Renders a web page as a PDF document'
      },
      {
        method: 'POST',
        path: '/scrape',
        description: 'Extracts structured data from HTML elements'
      }
    ]
  };
}

/**
 * Simulated function to demonstrate session reuse
 */
async function demonstrateSessionReuse() {
  console.log('Simulating Puppeteer session reuse...');
  
  // In a real implementation, you would use code like this:
  /*
  // Get existing browser sessions
  const sessions = await puppeteer.sessions();
  
  let browser;
  if (sessions.length > 0) {
    // Connect to an existing session
    browser = await puppeteer.connect({ sessionId: sessions[0].id });
    console.log('Connected to existing session');
  } else {
    // Create a new session
    browser = await puppeteer.launch();
    console.log('Created new session');
  }
  
  try {
    // Use the browser...
    const page = await browser.newPage();
    await page.goto('https://example.com');
    // ...
  } finally {
    // Disconnect instead of closing to keep the session alive
    await browser.disconnect();
  }
  */
  
  console.log('In a real implementation, you would:');
  console.log('1. Check for existing sessions with puppeteer.sessions()');
  console.log('2. Connect to an existing session or create a new one');
  console.log('3. Use browser.disconnect() instead of browser.close() to keep the session alive');
}

/**
 * Main function to run the experiment
 */
async function runExperiment() {
  console.log('Starting Browser Rendering Workers Binding API experiment...');
  
  try {
    // Simulate navigating and extracting content
    const extractedData = await navigateAndExtractContent();
    
    // Display the extracted data
    console.log('\nExtracted headings:');
    extractedData.headings.forEach(heading => {
      console.log(`${heading.level}: ${heading.text}`);
    });
    
    console.log('\nExtracted API endpoints:');
    extractedData.apiEndpoints.forEach(endpoint => {
      console.log(`${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
    });
    
    console.log('\nExtracted code examples (first example):');
    if (extractedData.codeExamples.length > 0) {
      console.log(`Language: ${extractedData.codeExamples[0].language}`);
      console.log(extractedData.codeExamples[0].code);
    }
    
    // Simulate session reuse
    await demonstrateSessionReuse();
    
    console.log('\nNote: This is a simulation. In a real implementation:');
    console.log('1. This code would run within a Cloudflare Worker');
    console.log('2. You would use the actual @cloudflare/puppeteer package');
    console.log('3. You would need to set up the Browser Rendering binding in your wrangler.toml');
    
  } catch (error) {
    console.error('Experiment failed:', error);
  }
}

// Run the experiment
runExperiment();

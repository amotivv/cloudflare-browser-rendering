import axios from 'axios';

// Cloudflare Browser Rendering REST API endpoint
// Note: In a real implementation, this would be your Cloudflare account's endpoint
const BROWSER_RENDERING_API = 'https://browser-rendering.youraccount.workers.dev';

/**
 * Fetches rendered HTML content from a URL using Cloudflare Browser Rendering
 * @param url The URL to fetch content from
 * @returns The rendered HTML content
 */
async function fetchRenderedContent(url: string): Promise<string> {
  try {
    const response = await axios.post(`${BROWSER_RENDERING_API}/content`, {
      url,
      // Optional parameters to optimize performance
      rejectResourceTypes: ['image', 'font', 'media'],
      // Wait for network to be idle (no requests for 500ms)
      waitUntil: 'networkidle0',
    });

    return response.data.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching content:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

/**
 * Extracts main content from Cloudflare documentation HTML
 * @param html The full HTML content
 * @returns The extracted main content
 */
function extractMainContent(html: string): string {
  // In a real implementation, we would use a proper HTML parser
  // For this experiment, we'll use a simple regex approach
  
  // Try to find the main content container in Cloudflare docs
  const mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  
  if (mainContentMatch && mainContentMatch[1]) {
    return mainContentMatch[1];
  }
  
  return 'Could not extract main content';
}

/**
 * Main function to run the experiment
 */
async function runExperiment() {
  console.log('Starting Browser Rendering REST API experiment...');
  
  // Fetch content from Cloudflare docs
  const url = 'https://developers.cloudflare.com/browser-rendering/';
  console.log(`Fetching content from: ${url}`);
  
  try {
    // Note: In a real implementation, you would use your actual Cloudflare Browser Rendering endpoint
    // For this experiment, we'll simulate the response
    console.log('This is a simulation since we need a real Cloudflare Browser Rendering endpoint');
    
    // Simulated content
    const simulatedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cloudflare Browser Rendering</title>
        </head>
        <body>
          <header>
            <nav>Navigation</nav>
          </header>
          <main>
            <h1>Browser Rendering</h1>
            <p>Cloudflare Browser Rendering is a serverless headless browser service that allows execution of browser actions within Cloudflare Workers.</p>
            <h2>Features</h2>
            <ul>
              <li>REST API for simple operations</li>
              <li>Workers Binding API for complex automation</li>
              <li>Puppeteer integration</li>
            </ul>
          </main>
          <footer>Footer content</footer>
        </body>
      </html>
    `;
    
    // Extract main content
    const mainContent = extractMainContent(simulatedHtml);
    console.log('\nExtracted main content:');
    console.log(mainContent);
    
    console.log('\nIn a real implementation, you would:');
    console.log('1. Replace the BROWSER_RENDERING_API constant with your actual endpoint');
    console.log('2. Uncomment the fetchRenderedContent call');
    console.log('3. Use a proper HTML parser for content extraction');
    
  } catch (error) {
    console.error('Experiment failed:', error);
  }
}

// Run the experiment
runExperiment();

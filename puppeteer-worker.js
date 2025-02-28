import puppeteer from '@cloudflare/puppeteer';

/**
 * Cloudflare Worker with Browser Rendering binding
 * 
 * This worker demonstrates how to use the Browser Rendering binding
 * with the @cloudflare/puppeteer package.
 */

// Define the allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://example.com',
  'http://localhost:3000',
];

/**
 * Handle CORS preflight requests
 */
function handleOptions(request) {
  const origin = request.headers.get('Origin');
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Add CORS headers to a response
 */
function addCorsHeaders(response, request) {
  const origin = request.headers.get('Origin');
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
  
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : ALLOWED_ORIGINS[0]);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Handle the /content endpoint
 */
async function handleContent(request, env) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Launch a browser using the binding
    const browser = await puppeteer.launch(env.browser);
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set viewport size
      await page.setViewport({
        width: 1280,
        height: 800,
      });
      
      // Set request rejection patterns if provided
      if (body.rejectResourceTypes && Array.isArray(body.rejectResourceTypes)) {
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (body.rejectResourceTypes.includes(req.resourceType())) {
            req.abort();
          } else {
            req.continue();
          }
        });
      }
      
      // Navigate to the URL
      await page.goto(body.url, {
        waitUntil: body.waitUntil || 'networkidle0',
        timeout: body.timeout || 30000,
      });
      
      // Get the page content
      const content = await page.content();
      
      // Return the content
      return new Response(JSON.stringify({ content }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      // Always close the browser to avoid resource leaks
      await browser.close();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Handle the /screenshot endpoint
 */
async function handleScreenshot(request, env) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Launch a browser using the binding
    const browser = await puppeteer.launch(env.browser);
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set viewport size
      await page.setViewport({
        width: body.width || 1280,
        height: body.height || 800,
      });
      
      // Navigate to the URL
      await page.goto(body.url, {
        waitUntil: body.waitUntil || 'networkidle0',
        timeout: body.timeout || 30000,
      });
      
      // Take a screenshot
      const screenshot = await page.screenshot({
        fullPage: body.fullPage || false,
        type: 'png',
        encoding: 'base64',
      });
      
      // Return the screenshot
      return new Response(JSON.stringify({ screenshot }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      // Always close the browser to avoid resource leaks
      await browser.close();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Main worker handler
 */
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    // Get the URL pathname
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();
    
    // Route the request to the appropriate handler
    let response;
    
    try {
      if (path === '/content' && request.method === 'POST') {
        response = await handleContent(request, env);
      } else if (path === '/screenshot' && request.method === 'POST') {
        response = await handleScreenshot(request, env);
      } else if (path === '/info') {
        // Return information about the environment
        response = new Response(JSON.stringify({
          env: Object.keys(env),
          hasBrowser: 'browser' in env,
          puppeteer: {
            version: puppeteer.version,
          },
        }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response = new Response(JSON.stringify({ 
          error: 'Endpoint not found',
          availableEndpoints: ['/content', '/screenshot', '/info'],
          method: request.method,
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      response = new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Add CORS headers to the response
    return addCorsHeaders(response, request);
  },
};

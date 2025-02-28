/**
 * Basic Cloudflare Worker with Browser Rendering binding
 * 
 * This is a simple example of how to use the Browser Rendering binding
 * in a Cloudflare Worker.
 */

export default {
  async fetch(request, env, ctx) {
    // Get the URL from the request query parameters
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url') || 'https://example.com';
    
    // Create a response with information about the request
    const info = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      worker: {
        name: 'browser-rendering-example',
        environment: Object.keys(env),
      },
    };
    
    // Return the information as JSON
    return new Response(JSON.stringify(info, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

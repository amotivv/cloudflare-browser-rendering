/**
 * Minimal Cloudflare Worker with Browser Rendering binding
 * 
 * This is a minimal example that just returns information about
 * the environment and the browser binding.
 */

export default {
  async fetch(request, env, ctx) {
    // Check if browser binding exists
    const hasBrowser = 'browser' in env;
    
    // Return information about the environment
    return new Response(JSON.stringify({
      env: Object.keys(env),
      hasBrowser,
      browser: hasBrowser ? {
        type: typeof env.browser,
        methods: Object.getOwnPropertyNames(Object.getPrototypeOf(env.browser) || {})
          .filter(prop => typeof env.browser[prop] === 'function'),
      } : null,
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

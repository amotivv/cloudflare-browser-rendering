# Cloudflare Browser Rendering Experiments & MCP Server

This project demonstrates how to use Cloudflare Browser Rendering to extract web content for LLM context. It includes experiments with the REST API and Workers Binding API, as well as an MCP server implementation that can be used to provide web context to LLMs.

<a href="https://glama.ai/mcp/servers/wg9fikq571">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/wg9fikq571/badge" alt="Web Content Server MCP server" />
</a>

## Project Structure

```
cloudflare-browser-rendering/
├── examples/                   # Example implementations and utilities
│   ├── basic-worker-example.js # Basic Worker with Browser Rendering
│   ├── minimal-worker-example.js # Minimal implementation
│   ├── debugging-tools/        # Tools for debugging
│   │   └── debug-test.js       # Debug test utility
│   └── testing/                # Testing utilities
│       └── content-test.js     # Content testing utility
├── experiments/                # Educational experiments
│   ├── basic-rest-api/         # REST API tests
│   ├── puppeteer-binding/      # Workers Binding API tests
│   └── content-extraction/     # Content processing tests
├── src/                        # MCP server source code
│   ├── index.ts                # Main entry point
│   ├── server.ts               # MCP server implementation
│   ├── browser-client.ts       # Browser Rendering client
│   └── content-processor.ts    # Content processing utilities
├── puppeteer-worker.js         # Cloudflare Worker with Browser Rendering binding
├── test-puppeteer.js           # Tests for the main implementation
├── wrangler.toml               # Wrangler configuration for the Worker
├── cline_mcp_settings.json.example # Example MCP settings for Cline
├── .gitignore                  # Git ignore file
└── LICENSE                     # MIT License
```

## Prerequisites

- Node.js (v16 or later)
- A Cloudflare account with Browser Rendering enabled
- TypeScript
- Wrangler CLI (for deploying the Worker)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cloudflare-browser-rendering.git
cd cloudflare-browser-rendering
```

2. Install dependencies:

```bash
npm install
```

## Cloudflare Worker Setup

1. Install the Cloudflare Puppeteer package:

```bash
npm install @cloudflare/puppeteer
```

2. Configure Wrangler:

```toml
# wrangler.toml
name = "browser-rendering-api"
main = "puppeteer-worker.js"
compatibility_date = "2023-10-30"
compatibility_flags = ["nodejs_compat"]

[browser]
binding = "browser"
```

3. Deploy the Worker:

```bash
npx wrangler deploy
```

4. Test the Worker:

```bash
node test-puppeteer.js
```

## Running the Experiments

### Basic REST API Experiment

This experiment demonstrates how to use the Cloudflare Browser Rendering REST API to fetch and process web content:

```bash
npm run experiment:rest
```

### Puppeteer Binding API Experiment

This experiment demonstrates how to use the Cloudflare Browser Rendering Workers Binding API with Puppeteer for more advanced browser automation:

```bash
npm run experiment:puppeteer
```

### Content Extraction Experiment

This experiment demonstrates how to extract and process web content specifically for use as context in LLMs:

```bash
npm run experiment:content
```

## MCP Server

The MCP server provides tools for fetching and processing web content using Cloudflare Browser Rendering for use as context in LLMs.

### Building the MCP Server

```bash
npm run build
```

### Running the MCP Server

```bash
npm start
```

Or, for development:

```bash
npm run dev
```

### MCP Server Tools

The MCP server provides the following tools:

1. `fetch_page` - Fetches and processes a web page for LLM context
2. `search_documentation` - Searches Cloudflare documentation and returns relevant content
3. `extract_structured_content` - Extracts structured content from a web page using CSS selectors
4. `summarize_content` - Summarizes web content for more concise LLM context

## Configuration

To use your Cloudflare Browser Rendering endpoint, set the `BROWSER_RENDERING_API` environment variable:

```bash
export BROWSER_RENDERING_API=https://YOUR_WORKER_URL_HERE
```

Replace `YOUR_WORKER_URL_HERE` with the URL of your deployed Cloudflare Worker. You'll need to replace this placeholder in several files:

1. In test files: `test-puppeteer.js`, `examples/debugging-tools/debug-test.js`, `examples/testing/content-test.js`
2. In the MCP server configuration: `cline_mcp_settings.json.example`
3. In the browser client: `src/browser-client.ts` (as a fallback if the environment variable is not set)

## Integrating with Cline

To integrate the MCP server with Cline, copy the `cline_mcp_settings.json.example` file to the appropriate location:

```bash
cp cline_mcp_settings.json.example ~/Library/Application\ Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

Or add the configuration to your existing `cline_mcp_settings.json` file.

## Key Learnings

1. Cloudflare Browser Rendering requires the `@cloudflare/puppeteer` package to interact with the browser binding.
2. The correct pattern for using the browser binding is:
   ```javascript
   import puppeteer from '@cloudflare/puppeteer';
   
   // Then in your handler:
   const browser = await puppeteer.launch(env.browser);
   const page = await browser.newPage();
   ```
3. When deploying a Worker that uses the Browser Rendering binding, you need to enable the `nodejs_compat` compatibility flag.
4. Always close the browser after use to avoid resource leaks.

## License

MIT
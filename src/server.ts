import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { BrowserClient } from './browser-client.js';
import { ContentProcessor } from './content-processor.js';

/**
 * Cloudflare Browser Rendering MCP Server
 * 
 * This server provides tools for fetching and processing web content
 * using Cloudflare Browser Rendering for use as context in LLMs.
 */
export class BrowserRenderingServer {
  private server: Server;
  private browserClient: BrowserClient;
  private contentProcessor: ContentProcessor;

  constructor() {
    this.server = new Server(
      {
        name: 'cloudflare-browser-rendering',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize the browser client and content processor
    this.browserClient = new BrowserClient();
    this.contentProcessor = new ContentProcessor();

    // Set up request handlers
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Set up tool handlers for the MCP server
   */
  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'fetch_page',
          description: 'Fetches and processes a web page for LLM context',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to fetch',
              },
              includeScreenshot: {
                type: 'boolean',
                description: 'Whether to include a screenshot (base64 encoded)',
              },
              maxContentLength: {
                type: 'number',
                description: 'Maximum content length to return',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'search_documentation',
          description: 'Searches Cloudflare documentation and returns relevant content',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of results to return',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'extract_structured_content',
          description: 'Extracts structured content from a web page using CSS selectors',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to extract content from',
              },
              selectors: {
                type: 'object',
                description: 'CSS selectors to extract content',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
            required: ['url', 'selectors'],
          },
        },
        {
          name: 'summarize_content',
          description: 'Summarizes web content for more concise LLM context',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to summarize',
              },
              maxLength: {
                type: 'number',
                description: 'Maximum length of the summary',
              },
            },
            required: ['url'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'fetch_page':
            return await this.handleFetchPage(args);
          case 'search_documentation':
            return await this.handleSearchDocumentation(args);
          case 'extract_structured_content':
            return await this.handleExtractStructuredContent(args);
          case 'summarize_content':
            return await this.handleSummarizeContent(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        console.error(`Error in tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  /**
   * Handle the fetch_page tool
   */
  private async handleFetchPage(args: any) {
    // Validate arguments
    if (typeof args !== 'object' || args === null || typeof args.url !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for fetch_page');
    }

    const { url, includeScreenshot = false, maxContentLength = 10000 } = args;

    try {
      // Fetch the page content
      const html = await this.browserClient.fetchContent(url);
      
      // Process the content for LLM
      const processedContent = this.contentProcessor.processForLLM(html, url);
      
      // Truncate if necessary
      const truncatedContent = processedContent.length > maxContentLength
        ? processedContent.substring(0, maxContentLength) + '...'
        : processedContent;
      
      // Get screenshot if requested
      let screenshot = null;
      if (includeScreenshot) {
        screenshot = await this.browserClient.takeScreenshot(url);
      }
      
      // Return the result
      return {
        content: [
          {
            type: 'text',
            text: truncatedContent,
          },
          ...(screenshot ? [{
            type: 'image',
            image: screenshot,
          }] : []),
        ],
      };
    } catch (error) {
      console.error('Error fetching page:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching page: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Handle the search_documentation tool
   */
  private async handleSearchDocumentation(args: any) {
    // Validate arguments
    if (typeof args !== 'object' || args === null || typeof args.query !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for search_documentation');
    }

    const { query, maxResults = 3 } = args;

    try {
      // In a real implementation, you would:
      // 1. Use Cloudflare Browser Rendering to navigate to the docs
      // 2. Use the search functionality on the docs site
      // 3. Extract the search results
      
      // For this simulation, we'll return mock results
      const mockResults = [
        {
          title: 'Browser Rendering API Overview',
          url: 'https://developers.cloudflare.com/browser-rendering/',
          snippet: 'Cloudflare Browser Rendering is a serverless headless browser service that allows execution of browser actions within Cloudflare Workers.',
        },
        {
          title: 'REST API Reference',
          url: 'https://developers.cloudflare.com/browser-rendering/rest-api/',
          snippet: 'The REST API provides simple endpoints for common browser tasks like fetching content, taking screenshots, and generating PDFs.',
        },
        {
          title: 'Workers Binding API Reference',
          url: 'https://developers.cloudflare.com/browser-rendering/workers-binding/',
          snippet: 'For more advanced use cases, you can use the Workers Binding API with Puppeteer to automate browser interactions.',
        },
      ].slice(0, maxResults);
      
      // Format the results
      const formattedResults = mockResults.map(result => 
        `## [${result.title}](${result.url})\n${result.snippet}\n`
      ).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `# Search Results for "${query}"\n\n${formattedResults}`,
          },
        ],
      };
    } catch (error) {
      console.error('Error searching documentation:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error searching documentation: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Handle the extract_structured_content tool
   */
  private async handleExtractStructuredContent(args: any) {
    // Validate arguments
    if (
      typeof args !== 'object' || 
      args === null || 
      typeof args.url !== 'string' ||
      typeof args.selectors !== 'object'
    ) {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for extract_structured_content');
    }

    const { url, selectors } = args;

    try {
      // In a real implementation, you would:
      // 1. Use Cloudflare Browser Rendering to fetch the page
      // 2. Use the /scrape endpoint to extract content based on selectors
      
      // For this simulation, we'll return mock results
      const mockResults: Record<string, string> = {};
      
      for (const [key, selector] of Object.entries(selectors)) {
        if (typeof selector === 'string') {
          // Simulate extraction based on selector
          mockResults[key] = `Extracted content for selector "${selector}"`;
        }
      }
      
      // Format the results
      const formattedResults = Object.entries(mockResults)
        .map(([key, value]) => `## ${key}\n${value}`)
        .join('\n\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `# Structured Content from ${url}\n\n${formattedResults}`,
          },
        ],
      };
    } catch (error) {
      console.error('Error extracting structured content:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error extracting structured content: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Handle the summarize_content tool
   */
  private async handleSummarizeContent(args: any) {
    // Validate arguments
    if (typeof args !== 'object' || args === null || typeof args.url !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for summarize_content');
    }

    const { url, maxLength = 500 } = args;

    try {
      // In a real implementation, you would:
      // 1. Fetch the page content using Cloudflare Browser Rendering
      // 2. Process the content for LLM
      // 3. Call an LLM API to summarize the content
      
      // For this simulation, we'll return a mock summary
      const mockSummary = `
# Browser Rendering API Summary

Cloudflare Browser Rendering is a serverless headless browser service for Cloudflare Workers that enables:

1. Rendering JavaScript-heavy websites
2. Taking screenshots and generating PDFs
3. Extracting structured data
4. Automating browser interactions

It offers two main interfaces:

- **REST API**: Simple endpoints for common tasks
- **Workers Binding API**: Advanced integration with Puppeteer

The service runs within Cloudflare's network, providing low-latency access to browser capabilities without managing infrastructure.
      `.trim();
      
      // Truncate if necessary
      const truncatedSummary = mockSummary.length > maxLength
        ? mockSummary.substring(0, maxLength) + '...'
        : mockSummary;
      
      return {
        content: [
          {
            type: 'text',
            text: truncatedSummary,
          },
        ],
      };
    } catch (error) {
      console.error('Error summarizing content:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error summarizing content: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Run the MCP server
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

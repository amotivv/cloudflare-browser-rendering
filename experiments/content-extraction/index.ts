import axios from 'axios';

/**
 * Experiment: Content Extraction and Processing for LLM Context
 * 
 * This experiment demonstrates how to extract and process web content
 * specifically for use as context in LLMs using Cloudflare Browser Rendering.
 */

/**
 * Simulated function to extract clean content from a web page
 * @param url The URL to extract content from
 */
async function extractCleanContent(url: string) {
  console.log(`Simulating content extraction from: ${url}`);
  
  // In a real implementation with Cloudflare Browser Rendering, you would:
  // 1. Use the /content endpoint to get the rendered HTML
  // 2. Use the /scrape endpoint to extract specific elements
  // 3. Process the content to make it suitable for LLM context
  
  // Simulated HTML content from Cloudflare docs
  const simulatedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Browser Rendering API | Cloudflare Docs</title>
        <meta name="description" content="Learn how to use Cloudflare's Browser Rendering API">
      </head>
      <body>
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/developers">Developers</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <h1>Browser Rendering API</h1>
            <p class="description">Cloudflare Browser Rendering is a serverless headless browser service that allows execution of browser actions within Cloudflare Workers.</p>
            
            <section id="overview">
              <h2>Overview</h2>
              <p>Browser Rendering allows you to run a headless browser directly within Cloudflare's network, enabling you to:</p>
              <ul>
                <li>Render JavaScript-heavy websites</li>
                <li>Take screenshots of web pages</li>
                <li>Generate PDFs</li>
                <li>Extract structured data</li>
                <li>Automate browser interactions</li>
              </ul>
            </section>
            
            <section id="rest-api">
              <h2>REST API</h2>
              <p>The REST API provides simple endpoints for common browser tasks:</p>
              <div class="endpoint">
                <h3>/content</h3>
                <p>Fetches rendered HTML content from a URL after JavaScript execution.</p>
                <pre><code>
POST /content
{
  "url": "https://example.com",
  "rejectResourceTypes": ["image", "font"]
}
                </code></pre>
              </div>
              
              <div class="endpoint">
                <h3>/screenshot</h3>
                <p>Captures a screenshot of a web page.</p>
              </div>
            </section>
            
            <section id="workers-binding">
              <h2>Workers Binding API</h2>
              <p>For more advanced use cases, you can use the Workers Binding API with Puppeteer.</p>
              <pre><code>
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
              </code></pre>
            </section>
          </article>
        </main>
        <footer>
          <p>&copy; 2025 Cloudflare, Inc.</p>
          <nav>
            <ul>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/privacy">Privacy</a></li>
            </ul>
          </nav>
        </footer>
      </body>
    </html>
  `;
  
  return simulatedHtml;
}

/**
 * Extracts main content from HTML and removes unnecessary elements
 * @param html The HTML content
 * @returns Cleaned content suitable for LLM context
 */
function cleanContentForLLM(html: string): string {
  // In a real implementation, you would use a proper HTML parser
  // For this experiment, we'll use a simple approach with regex
  
  // Extract the article content
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  let content = articleMatch ? articleMatch[1] : html;
  
  // Remove HTML tags but preserve headings and paragraph structure
  content = content
    // Replace headings with markdown-style headings
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    // Replace list items with markdown-style list items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    // Replace paragraphs with newline-separated text
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    // Replace code blocks with markdown-style code blocks
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    // Remove all other HTML tags
    .replace(/<[^>]*>/g, '')
    // Fix multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
  
  return content;
}

/**
 * Extracts metadata from HTML
 * @param html The HTML content
 * @returns Metadata object
 */
function extractMetadata(html: string): Record<string, string> {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/i);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Unknown Title',
    description: descriptionMatch ? descriptionMatch[1].trim() : 'No description available',
    url: 'https://developers.cloudflare.com/browser-rendering/', // Simulated URL
    source: 'Cloudflare Documentation',
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Formats content for LLM context
 * @param content The cleaned content
 * @param metadata The metadata
 * @returns Formatted content for LLM context
 */
function formatForLLMContext(content: string, metadata: Record<string, string>): string {
  // Create a header with metadata
  const header = `
Title: ${metadata.title}
Source: ${metadata.source}
URL: ${metadata.url}
Extracted: ${metadata.extractedAt}
Description: ${metadata.description}
---

`;
  
  // Combine header and content
  return header + content;
}

/**
 * Simulates content summarization using an LLM
 * @param content The content to summarize
 * @returns Summarized content
 */
function simulateLLMSummarization(content: string): string {
  // In a real implementation, you would call an LLM API here
  console.log('Simulating LLM summarization...');
  
  // For this simulation, we'll return a mock summary
  return `
# Browser Rendering API Summary

Cloudflare Browser Rendering is a serverless headless browser service for Cloudflare Workers that enables:

1. Rendering JavaScript-heavy websites
2. Taking screenshots and generating PDFs
3. Extracting structured data
4. Automating browser interactions

It offers two main interfaces:

- **REST API**: Simple endpoints for common tasks like fetching content (/content) and taking screenshots (/screenshot)
- **Workers Binding API**: Advanced integration with Puppeteer for complex automation

The service runs within Cloudflare's network, providing low-latency access to browser capabilities without managing infrastructure.
  `;
}

/**
 * Main function to run the experiment
 */
async function runExperiment() {
  console.log('Starting Content Extraction and Processing experiment...');
  
  try {
    // Extract content from Cloudflare docs
    const url = 'https://developers.cloudflare.com/browser-rendering/';
    const html = await extractCleanContent(url);
    
    // Clean the content for LLM context
    const cleanedContent = cleanContentForLLM(html);
    console.log('\nCleaned content for LLM:');
    console.log(cleanedContent.substring(0, 500) + '...');
    
    // Extract metadata
    const metadata = extractMetadata(html);
    console.log('\nExtracted metadata:');
    console.log(metadata);
    
    // Format for LLM context
    const formattedContent = formatForLLMContext(cleanedContent, metadata);
    console.log('\nFormatted content for LLM context:');
    console.log(formattedContent.substring(0, 300) + '...');
    
    // Simulate LLM summarization
    const summarizedContent = simulateLLMSummarization(formattedContent);
    console.log('\nSimulated LLM summarization:');
    console.log(summarizedContent);
    
    console.log('\nIn a real implementation, you would:');
    console.log('1. Use Cloudflare Browser Rendering to fetch the actual content');
    console.log('2. Use a proper HTML parser for content extraction');
    console.log('3. Call a real LLM API for summarization');
    console.log('4. Store the processed content in Cloudflare R2 or another storage solution');
    
  } catch (error) {
    console.error('Experiment failed:', error);
  }
}

// Run the experiment
runExperiment();

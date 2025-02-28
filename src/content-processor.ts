/**
 * Processes web content for LLM context
 */
export class ContentProcessor {
  /**
   * Processes HTML content for LLM context
   * @param html The HTML content to process
   * @param url The URL of the content
   * @returns Processed content suitable for LLM context
   */
  processForLLM(html: string, url: string): string {
    // Extract metadata
    const metadata = this.extractMetadata(html, url);
    
    // Clean the content
    const cleanedContent = this.cleanContent(html);
    
    // Format for LLM context
    return this.formatForLLM(cleanedContent, metadata);
  }

  /**
   * Extracts metadata from HTML content
   * @param html The HTML content
   * @param url The URL of the content
   * @returns Metadata object
   */
  private extractMetadata(html: string, url: string): Record<string, string> {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/i);
    
    return {
      title: titleMatch ? titleMatch[1].trim() : 'Unknown Title',
      description: descriptionMatch ? descriptionMatch[1].trim() : 'No description available',
      url,
      source: new URL(url).hostname,
      extractedAt: new Date().toISOString(),
    };
  }

  /**
   * Cleans HTML content for LLM context
   * @param html The HTML content to clean
   * @returns Cleaned content
   */
  private cleanContent(html: string): string {
    // Extract the main content
    // In a real implementation, you would use a proper HTML parser
    // For this simulation, we'll use a simple approach with regex
    
    // Try to find the main content container
    let content = html;
    
    // Try to extract article content
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch && articleMatch[1]) {
      content = articleMatch[1];
    } else {
      // Try to extract main content
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      if (mainMatch && mainMatch[1]) {
        content = mainMatch[1];
      }
    }
    
    // Remove HTML tags but preserve headings and paragraph structure
    content = content
      // Replace headings with markdown-style headings
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n')
      // Replace list items with markdown-style list items
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
      // Replace paragraphs with newline-separated text
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
      // Replace code blocks with markdown-style code blocks
      .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
      // Replace inline code with markdown-style inline code
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
      // Replace links with markdown-style links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      // Replace strong/bold with markdown-style bold
      .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**')
      // Replace emphasis/italic with markdown-style italic
      .replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, '')
      // Fix multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Trim whitespace
      .trim();
    
    return content;
  }

  /**
   * Formats content for LLM context
   * @param content The cleaned content
   * @param metadata The metadata
   * @returns Formatted content for LLM context
   */
  private formatForLLM(content: string, metadata: Record<string, string>): string {
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
   * Summarizes content (in a real implementation, this would call an LLM API)
   * @param content The content to summarize
   * @param maxLength Maximum length of the summary
   * @returns Summarized content
   */
  summarizeContent(content: string, maxLength: number = 500): string {
    // In a real implementation, you would call an LLM API here
    console.log('Simulating content summarization...');
    
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
    return mockSummary.length > maxLength
      ? mockSummary.substring(0, maxLength) + '...'
      : mockSummary;
  }
}

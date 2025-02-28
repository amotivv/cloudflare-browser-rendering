import axios from 'axios';

/**
 * Client for interacting with Cloudflare Browser Rendering
 */
export class BrowserClient {
  private apiEndpoint: string;

  constructor() {
    // Use the deployed Cloudflare Worker or a default placeholder
    // Replace YOUR_WORKER_URL_HERE with your actual worker URL when deploying
    this.apiEndpoint = process.env.BROWSER_RENDERING_API || 'https://YOUR_WORKER_URL_HERE';
  }

  /**
   * Fetches rendered HTML content from a URL
   * @param url The URL to fetch content from
   * @returns The rendered HTML content
   */
  async fetchContent(url: string): Promise<string> {
    try {
      console.log(`Fetching content from: ${url}`);
      
      // Make the API call to the Cloudflare Worker
      const response = await axios.post(`${this.apiEndpoint}/content`, {
        url,
        rejectResourceTypes: ['image', 'font', 'media'],
        waitUntil: 'networkidle0',
      });
      
      return response.data.content;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Takes a screenshot of a URL
   * @param url The URL to take a screenshot of
   * @returns Base64-encoded screenshot image
   */
  async takeScreenshot(url: string): Promise<string> {
    try {
      console.log(`Taking screenshot of: ${url}`);
      
      // Make the API call to the Cloudflare Worker
      const response = await axios.post(`${this.apiEndpoint}/screenshot`, {
        url,
        fullPage: false,
        width: 1280,
        height: 800,
      });
      
      return response.data.screenshot;
    } catch (error) {
      console.error('Error taking screenshot:', error);
      throw new Error(`Failed to take screenshot: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

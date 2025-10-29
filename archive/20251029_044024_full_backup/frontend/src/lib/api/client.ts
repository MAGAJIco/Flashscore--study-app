
import { SharedAPIClient } from '@magajico/shared';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

// Extend the shared API client with frontend-specific methods
export class BackendClient extends SharedAPIClient {
  constructor(baseURL: string = BACKEND_URL) {
    super(baseURL);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getMatches(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.get(`/api/matches${query}`);
  }

  async getPredictions(limit: number = 50) {
    return this.get(`/api/predictions?limit=${limit}`);
  }

  async getNews() {
    return this.get('/api/news');
  }
}

export const backendClient = new BackendClient();

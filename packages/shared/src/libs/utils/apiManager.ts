
interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  cache: boolean;
}

interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  apiKey?: string;
  domain?: string;
  from: string;
}

interface PaymentConfig {
  providers: {
    piNetwork: boolean;
    paypal: boolean;
    stripe: boolean;
  };
  webhookSecret?: string;
  environment: 'sandbox' | 'production';
}

export class APIManager {
  private static instance: APIManager;
  private config: APIConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  private constructor() {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001',
      timeout: 30000,
      retries: 3,
      cache: true
    };
  }

  public static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  // Optimized request handler with caching and retries
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.config.cache && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    let lastError: Error;
    
    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.baseURL}${endpoint}`, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache successful GET requests
        if (this.config.cache && (!options.method || options.method === 'GET')) {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: 300000 // 5 minutes
          });
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError!;
  }

  // CRUD Operations
  async create<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async read<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async update<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Batch operations for optimization
  async batchRequest<T>(requests: Array<{ endpoint: string; options?: RequestInit }>): Promise<T[]> {
    return Promise.all(requests.map(req => this.request<T>(req.endpoint, req.options)));
  }

  // Clear cache
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export default APIManager.getInstance();

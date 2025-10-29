
interface CRUDConfig {
  baseEndpoint: string;
  timeout: number;
  retries: number;
  batchSize: number;
  cacheEnabled: boolean;
}

interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  select?: string[];
  populate?: string[];
}

interface BatchOperation {
  operation: 'create' | 'read' | 'update' | 'delete';
  endpoint: string;
  data?: any;
  id?: string;
}

export class CRUDManager {
  private static instance: CRUDManager;
  private config: CRUDConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private pendingOperations: Map<string, Promise<any>> = new Map();

  private constructor() {
    this.config = {
      baseEndpoint: '/api',
      timeout: 30000,
      retries: 3,
      batchSize: 10,
      cacheEnabled: true
    };
  }

  public static getInstance(): CRUDManager {
    if (!CRUDManager.instance) {
      CRUDManager.instance = new CRUDManager();
    }
    return CRUDManager.instance;
  }

  // Optimized request with deduplication
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey?: string
  ): Promise<T> {
    // Deduplicate identical requests
    const requestKey = `${endpoint}_${JSON.stringify(options)}`;
    const pending = this.pendingOperations.get(requestKey);
    if (pending) {
      return pending;
    }

    // Check cache for GET requests
    if (this.config.cacheEnabled && (!options.method || options.method === 'GET') && cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    const promise = this.executeRequest<T>(endpoint, options, cacheKey);
    this.pendingOperations.set(requestKey, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.pendingOperations.delete(requestKey);
    }
  }

  private async executeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey?: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.baseEndpoint}${endpoint}`, {
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
        if (this.config.cacheEnabled && (!options.method || options.method === 'GET') && cacheKey) {
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

  // CREATE operations
  async create<T>(resource: string, data: any): Promise<T> {
    this.invalidateCache(resource);
    return this.request<T>(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createMany<T>(resource: string, items: any[]): Promise<T[]> {
    this.invalidateCache(resource);
    
    // Process in batches for optimization
    const batches = this.chunk(items, this.config.batchSize);
    const results: T[] = [];

    for (const batch of batches) {
      const batchResults = await this.request<T[]>(`/${resource}/batch`, {
        method: 'POST',
        body: JSON.stringify({ items: batch }),
      });
      results.push(...batchResults);
    }

    return results;
  }

  // READ operations
  async findById<T>(resource: string, id: string, options?: { populate?: string[] }): Promise<T> {
    const cacheKey = `${resource}_${id}_${JSON.stringify(options)}`;
    const query = options ? `?${new URLSearchParams(options as any)}` : '';
    
    return this.request<T>(`/${resource}/${id}${query}`, {}, cacheKey);
  }

  async findAll<T>(resource: string, options?: QueryOptions): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const cacheKey = `${resource}_all_${JSON.stringify(options)}`;
    const query = options ? `?${this.buildQueryString(options)}` : '';
    
    return this.request<{ data: T[]; total: number; page: number; limit: number }>(
      `/${resource}${query}`,
      {},
      cacheKey
    );
  }

  async findOne<T>(resource: string, filter: Record<string, any>): Promise<T | null> {
    const cacheKey = `${resource}_one_${JSON.stringify(filter)}`;
    const query = `?${new URLSearchParams({ filter: JSON.stringify(filter) })}`;
    
    return this.request<T | null>(`/${resource}/findOne${query}`, {}, cacheKey);
  }

  // UPDATE operations
  async update<T>(resource: string, id: string, data: any): Promise<T> {
    this.invalidateCache(resource);
    return this.request<T>(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateMany<T>(resource: string, filter: Record<string, any>, data: any): Promise<{ modifiedCount: number }> {
    this.invalidateCache(resource);
    return this.request<{ modifiedCount: number }>(`/${resource}/updateMany`, {
      method: 'PUT',
      body: JSON.stringify({ filter, data }),
    });
  }

  async patch<T>(resource: string, id: string, data: any): Promise<T> {
    this.invalidateCache(resource);
    return this.request<T>(`/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE operations
  async delete<T>(resource: string, id: string): Promise<T> {
    this.invalidateCache(resource);
    return this.request<T>(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteMany<T>(resource: string, filter: Record<string, any>): Promise<{ deletedCount: number }> {
    this.invalidateCache(resource);
    return this.request<{ deletedCount: number }>(`/${resource}/deleteMany`, {
      method: 'DELETE',
      body: JSON.stringify({ filter }),
    });
  }

  // BATCH operations for optimization
  async batch<T>(operations: BatchOperation[]): Promise<T[]> {
    return this.request<T[]>('/batch', {
      method: 'POST',
      body: JSON.stringify({ operations }),
    });
  }

  // SEARCH operations
  async search<T>(resource: string, query: string, options?: QueryOptions): Promise<{ data: T[]; total: number }> {
    const cacheKey = `${resource}_search_${query}_${JSON.stringify(options)}`;
    const queryString = options ? `&${this.buildQueryString(options)}` : '';
    
    return this.request<{ data: T[]; total: number }>(
      `/${resource}/search?q=${encodeURIComponent(query)}${queryString}`,
      {},
      cacheKey
    );
  }

  // AGGREGATION operations
  async aggregate<T>(resource: string, pipeline: any[]): Promise<T[]> {
    return this.request<T[]>(`/${resource}/aggregate`, {
      method: 'POST',
      body: JSON.stringify({ pipeline }),
    });
  }

  // COUNT operations
  async count(resource: string, filter?: Record<string, any>): Promise<number> {
    const cacheKey = `${resource}_count_${JSON.stringify(filter)}`;
    const query = filter ? `?filter=${encodeURIComponent(JSON.stringify(filter))}` : '';
    
    return this.request<number>(`/${resource}/count${query}`, {}, cacheKey);
  }

  // UTILITY methods
  private buildQueryString(options: QueryOptions): string {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sort) params.append('sort', options.sort);
    if (options.filter) params.append('filter', JSON.stringify(options.filter));
    if (options.select) params.append('select', options.select.join(','));
    if (options.populate) params.append('populate', options.populate.join(','));
    
    return params.toString();
  }

  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private invalidateCache(resource: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(resource)) {
        this.cache.delete(key);
      }
    }
  }

  // Cache management
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

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Connection testing
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const crudManagerInstance = CRUDManager.getInstance();

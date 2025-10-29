import { backendCircuit, mlCircuit } from './circuit-breaker';
import { retryWithBackoff } from './retry';
import { loadBalancer } from './load-balancer';
import { serviceMesh } from './service-mesh';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_BACKEND_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Use load balancer to select backend instance
    const instance = endpoint.includes('/ml/') 
      ? null // ML service doesn't use load balancing yet
      : loadBalancer.selectInstance();
    
    const baseUrl = instance?.url || this.baseURL;
    const url = `${baseUrl}${endpoint}`;
    
    const serviceName = endpoint.includes('/ml/') ? 'ML Service' : 'Backend API';
    const circuit = endpoint.includes('/ml/') ? mlCircuit : backendCircuit;
    
    // Check service mesh health
    if (!serviceMesh.canServeRequest([serviceName.toLowerCase().replace(' ', '')])) {
      console.warn(`⚠️ Service ${serviceName} is degraded, attempting anyway...`);
    }
    
    if (instance) {
      loadBalancer.incrementConnections(instance.url);
    }

    let success = false;

    try {
      const result = await circuit.execute(() => 
        retryWithBackoff(async () => {
          try {
            const response = await fetch(url, {
              ...options,
              headers: {
                ...this.defaultHeaders,
                ...options.headers,
              },
            });

            if (!response.ok) {
              const error = await response.json().catch(() => ({
                message: response.statusText,
              }));
              throw new APIError(
                error.message || 'Request failed',
                response.status,
                error.code
              );
            }

            return response.json();
          } catch (error) {
            if (error instanceof APIError) throw error;

            console.error('API request failed:', error);
            throw new APIError(
              'Network error occurred',
              0,
              'NETWORK_ERROR'
            );
          }
        }, {
          maxAttempts: 3,
          initialDelay: 1000,
          maxDelay: 5000,
        })
      );

      success = true;
      
      // Mark instance as healthy
      if (instance) {
        const responseTime = Date.now() - (options as any).startTime || 0;
        loadBalancer.markHealthy(instance.url, responseTime);
      }
      
      return result;
    } catch (error) {
      // Mark instance as unhealthy on failure
      if (instance) {
        loadBalancer.markUnhealthy(instance.url);
      }
      throw error;
    } finally {
      // Decrement connections
      if (instance) {
        loadBalancer.decrementConnections(instance.url);
      }
      
      // Track error budget
      if (typeof window !== 'undefined') {
        const { errorBudget } = await import('./error-budget');
        errorBudget.track(serviceName, success);
      }
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
export { APIError };
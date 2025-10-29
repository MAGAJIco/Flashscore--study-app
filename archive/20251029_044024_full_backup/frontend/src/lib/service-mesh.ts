
/**
 * Service Mesh - Google-style service coordination
 * Each service is a "pie slice" that can fail independently
 */

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorRate: number;
  lastCheck: number;
}

class ServiceMesh {
  private services: Map<string, ServiceHealth> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.registerService('frontend', { endpoint: '/api/health' });
    this.registerService('backend', { endpoint: '/api/backend/health' });
    this.registerService('ml', { endpoint: '/api/ml/health' });
  }

  private registerService(name: string, config: { endpoint: string }) {
    this.services.set(name, {
      name,
      status: 'healthy',
      responseTime: 0,
      errorRate: 0,
      lastCheck: Date.now(),
    });

    // Start health checks
    if (typeof window !== 'undefined') {
      this.startHealthChecks();
    }
  }

  private startHealthChecks() {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      this.services.forEach((service, name) => {
        this.checkServiceHealth(name);
      });
    }, 30000); // Every 30 seconds
  }

  private async checkServiceHealth(serviceName: string) {
    const service = this.services.get(serviceName);
    if (!service) return;

    const startTime = Date.now();
    try {
      const endpoint = this.getServiceEndpoint(serviceName);
      const response = await fetch(endpoint, {
        signal: AbortSignal.timeout(5000),
      });

      const responseTime = Date.now() - startTime;
      
      service.responseTime = responseTime;
      service.status = response.ok ? 'healthy' : 'degraded';
      service.lastCheck = Date.now();
      service.errorRate = response.ok ? service.errorRate * 0.9 : Math.min(service.errorRate + 0.1, 1);

    } catch (error) {
      service.status = 'down';
      service.errorRate = Math.min(service.errorRate + 0.2, 1);
      service.lastCheck = Date.now();
    }
  }

  private getServiceEndpoint(serviceName: string): string {
    const endpoints: Record<string, string> = {
      frontend: '/api/health',
      backend: '/api/backend/health',
      ml: '/api/ml/health',
    };
    return endpoints[serviceName] || '/api/health';
  }

  getServiceStatus(serviceName: string): ServiceHealth | null {
    return this.services.get(serviceName) || null;
  }

  getAllServices(): ServiceHealth[] {
    return Array.from(this.services.values());
  }

  isHealthy(serviceName: string): boolean {
    const service = this.services.get(serviceName);
    return service?.status === 'healthy' || false;
  }

  // Google-style "graceful degradation"
  canServeRequest(requiredServices: string[]): boolean {
    const criticalDown = requiredServices.some(name => {
      const service = this.services.get(name);
      return service?.status === 'down';
    });
    return !criticalDown;
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const serviceMesh = new ServiceMesh();

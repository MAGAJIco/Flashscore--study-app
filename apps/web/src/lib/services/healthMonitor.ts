
interface ServiceHealth {
  name: string;
  url: string;
  healthy: boolean;
  lastCheck: Date;
  failureCount: number;
}

class HealthMonitorService {
  private services: Map<string, ServiceHealth> = new Map();
  private checkInterval = 30000; // 30 seconds
  private maxFailures = 3;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // In browser, use the current origin to proxy through Next.js API routes
    const isBrowser = typeof window !== 'undefined';
    const apiUrl = isBrowser 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001');
    
    this.services.set('api', {
      name: 'Backend API',
      url: isBrowser ? `${apiUrl}/api/health/keys` : `http://0.0.0.0:3001/health`,
      healthy: true,
      lastCheck: new Date(),
      failureCount: 0
    });

    this.services.set('ml', {
      name: 'ML Service',
      url: `${apiUrl}/api/predictions`,
      healthy: true,
      lastCheck: new Date(),
      failureCount: 0
    });
  }

  async checkHealth(serviceName: string): Promise<boolean> {
    const service = this.services.get(serviceName);
    if (!service) return false;

    try {
      const response = await fetch(service.url, {
        signal: AbortSignal.timeout(5000)
      });

      const healthy = response.ok;
      
      service.healthy = healthy;
      service.lastCheck = new Date();
      service.failureCount = healthy ? 0 : service.failureCount + 1;

      if (service.failureCount >= this.maxFailures) {
        this.handleServiceFailure(serviceName);
      }

      return healthy;
    } catch (error) {
      service.healthy = false;
      service.lastCheck = new Date();
      service.failureCount++;

      if (service.failureCount >= this.maxFailures) {
        this.handleServiceFailure(serviceName);
      }

      return false;
    }
  }

  private handleServiceFailure(serviceName: string) {
    console.warn(`⚠️ Service ${serviceName} is unhealthy`);
    
    // Emit custom event for UI to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('service-unhealthy', {
        detail: { serviceName, service: this.services.get(serviceName) }
      }));
    }
  }

  startMonitoring() {
    this.intervalId = setInterval(() => {
      this.services.forEach((_, name) => {
        this.checkHealth(name);
      });
    }, this.checkInterval);

    // Initial check
    this.services.forEach((_, name) => {
      this.checkHealth(name);
    });
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getServiceStatus(serviceName: string): ServiceHealth | undefined {
    return this.services.get(serviceName);
  }

  getAllStatuses(): ServiceHealth[] {
    return Array.from(this.services.values());
  }

  isHealthy(): boolean {
    return Array.from(this.services.values()).every(s => s.healthy || s.failureCount < this.maxFailures);
  }
}

export const healthMonitor = new HealthMonitorService();

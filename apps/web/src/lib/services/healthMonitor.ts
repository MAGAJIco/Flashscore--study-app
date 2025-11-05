
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
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeServices();
    }
  }

  private initializeServices() {
    const apiUrl = window.location.origin;
    
    this.services.set('api', {
      name: 'Backend API',
      url: `${apiUrl}/api/health/keys`,
      healthy: true,
      lastCheck: new Date(),
      failureCount: 0
    });

    this.services.set('predictions', {
      name: 'Predictions Service',
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(service.url, {
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);
      const healthy = response.ok;
      
      service.healthy = healthy;
      service.lastCheck = new Date();
      service.failureCount = healthy ? 0 : service.failureCount + 1;

      if (service.failureCount >= this.maxFailures && service.failureCount === this.maxFailures) {
        this.handleServiceFailure(serviceName);
      }

      return healthy;
    } catch (error) {
      service.healthy = false;
      service.lastCheck = new Date();
      service.failureCount++;

      if (service.failureCount >= this.maxFailures && service.failureCount === this.maxFailures) {
        this.handleServiceFailure(serviceName);
      }

      return false;
    }
  }

  private handleServiceFailure(serviceName: string) {
    console.warn(`⚠️ Service ${serviceName} is unhealthy`);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('service-unhealthy', {
        detail: { serviceName, service: this.services.get(serviceName) }
      }));
    }
  }

  startMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.isMonitoring = true;

    // Initial check after a short delay
    setTimeout(() => {
      this.services.forEach((_, name) => {
        this.checkHealth(name).catch(err => 
          console.warn(`Initial health check failed for ${name}:`, err)
        );
      });
    }, 2000);

    this.intervalId = setInterval(() => {
      this.services.forEach((_, name) => {
        this.checkHealth(name).catch(err => 
          console.warn(`Health check failed for ${name}:`, err)
        );
      });
    }, this.checkInterval);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
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

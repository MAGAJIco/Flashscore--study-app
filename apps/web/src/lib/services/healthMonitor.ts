
interface ServiceHealth {
  name: string;
  url: string;
  healthy: boolean;
  lastCheck: Date;
  failureCount: number;
  backoffDelay: number;
  lastSuccessfulCheck?: Date;
}

class HealthMonitorService {
  private services: Map<string, ServiceHealth> = new Map();
  private checkInterval = 30000; // 30 seconds
  private maxFailures = 5;
  private intervalId?: NodeJS.Timeout;
  private isMonitoring = false;
  private baseBackoffDelay = 5000;
  private maxBackoffDelay = 60000;

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
      failureCount: 0,
      backoffDelay: this.baseBackoffDelay,
      lastSuccessfulCheck: new Date()
    });

    this.services.set('predictions', {
      name: 'Predictions Service',
      url: `${apiUrl}/api/predictions`,
      healthy: true,
      lastCheck: new Date(),
      failureCount: 0,
      backoffDelay: this.baseBackoffDelay,
      lastSuccessfulCheck: new Date()
    });
  }

  async checkHealth(serviceName: string): Promise<boolean> {
    const service = this.services.get(serviceName);
    if (!service) return false;

    // Implement exponential backoff
    const now = Date.now();
    const timeSinceLastCheck = now - service.lastCheck.getTime();
    if (timeSinceLastCheck < service.backoffDelay && service.failureCount > 0) {
      return service.healthy;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(service.url, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        credentials: 'same-origin'
      });

      clearTimeout(timeoutId);
      const healthy = response.ok;
      
      service.healthy = healthy;
      service.lastCheck = new Date();
      
      if (healthy) {
        service.failureCount = 0;
        service.backoffDelay = this.baseBackoffDelay;
        service.lastSuccessfulCheck = new Date();
      } else {
        service.failureCount++;
        service.backoffDelay = Math.min(
          this.maxBackoffDelay,
          service.backoffDelay * 2
        );
      }

      if (service.failureCount >= this.maxFailures && service.failureCount === this.maxFailures) {
        this.handleServiceFailure(serviceName);
      }

      return healthy;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Differentiate between network errors and aborts
      if (errorMessage.includes('aborted')) {
        console.warn(`⏱️ Health check timeout for ${serviceName}`);
      } else {
        console.warn(`🔌 Network error for ${serviceName}:`, errorMessage);
      }

      service.healthy = false;
      service.lastCheck = new Date();
      service.failureCount++;
      service.backoffDelay = Math.min(
        this.maxBackoffDelay,
        service.backoffDelay * 2
      );

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
        this.checkHealth(name).catch(err => {
          // Silently handle initial failures - system is still loading
          if (process.env.NODE_ENV === 'development') {
            console.debug(`Initial health check for ${name} pending:`, err);
          }
        });
      });
    }, 3000);

    // Adaptive monitoring with staggered checks
    let checkCounter = 0;
    this.intervalId = setInterval(() => {
      checkCounter++;
      
      this.services.forEach((service, name) => {
        // Stagger checks to reduce load
        const staggerDelay = Array.from(this.services.keys()).indexOf(name) * 1000;
        
        setTimeout(() => {
          // Skip check if in backoff period
          const timeSinceLastCheck = Date.now() - service.lastCheck.getTime();
          if (timeSinceLastCheck < service.backoffDelay && service.failureCount > 0) {
            return;
          }

          this.checkHealth(name).catch(err => {
            if (process.env.NODE_ENV === 'development' && checkCounter % 5 === 0) {
              console.debug(`Periodic health check for ${name}:`, err);
            }
          });
        }, staggerDelay);
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

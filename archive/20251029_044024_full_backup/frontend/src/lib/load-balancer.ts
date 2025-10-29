
/**
 * Client-side Load Balancer
 * Distributes requests across multiple backend instances
 */

interface BackendInstance {
  url: string;
  weight: number;
  healthy: boolean;
  activeConnections: number;
  responseTime: number;
}

class LoadBalancer {
  private instances: BackendInstance[] = [];
  private roundRobinIndex = 0;

  constructor() {
    // Initialize with primary backend
    this.addInstance(process.env.NEXT_PUBLIC_BACKEND_URL || '', 10);
    
    // Add fallback instances if available
    const fallback1 = process.env.NEXT_PUBLIC_BACKEND_FALLBACK_1;
    const fallback2 = process.env.NEXT_PUBLIC_BACKEND_FALLBACK_2;
    
    if (fallback1) this.addInstance(fallback1, 5);
    if (fallback2) this.addInstance(fallback2, 3);
  }

  private addInstance(url: string, weight: number) {
    if (!url) return;
    
    this.instances.push({
      url,
      weight,
      healthy: true,
      activeConnections: 0,
      responseTime: 0,
    });
  }

  // Weighted round-robin selection
  selectInstance(): BackendInstance | null {
    const healthyInstances = this.instances.filter(i => i.healthy);
    
    if (healthyInstances.length === 0) {
      console.error('🚨 No healthy backend instances available');
      return this.instances[0] || null; // Fallback to primary even if unhealthy
    }

    if (healthyInstances.length === 1) {
      return healthyInstances[0];
    }

    // Weighted round-robin
    let totalWeight = healthyInstances.reduce((sum, i) => sum + i.weight, 0);
    let selection = (this.roundRobinIndex++ % totalWeight);
    
    for (const instance of healthyInstances) {
      if (selection < instance.weight) {
        return instance;
      }
      selection -= instance.weight;
    }

    return healthyInstances[0];
  }

  // Least connections selection (for WebSocket/long-polling)
  selectLeastConnections(): BackendInstance | null {
    const healthyInstances = this.instances.filter(i => i.healthy);
    
    if (healthyInstances.length === 0) return null;

    return healthyInstances.reduce((min, instance) => 
      instance.activeConnections < min.activeConnections ? instance : min
    );
  }

  markHealthy(url: string, responseTime: number) {
    const instance = this.instances.find(i => i.url === url);
    if (instance) {
      instance.healthy = true;
      instance.responseTime = responseTime;
    }
  }

  markUnhealthy(url: string) {
    const instance = this.instances.find(i => i.url === url);
    if (instance) {
      instance.healthy = false;
      console.warn(`⚠️ Marked instance unhealthy: ${url}`);
    }
  }

  incrementConnections(url: string) {
    const instance = this.instances.find(i => i.url === url);
    if (instance) instance.activeConnections++;
  }

  decrementConnections(url: string) {
    const instance = this.instances.find(i => i.url === url);
    if (instance && instance.activeConnections > 0) {
      instance.activeConnections--;
    }
  }

  getStats() {
    return this.instances.map(i => ({
      url: i.url,
      healthy: i.healthy,
      connections: i.activeConnections,
      avgResponseTime: i.responseTime,
    }));
  }
}

export const loadBalancer = new LoadBalancer();

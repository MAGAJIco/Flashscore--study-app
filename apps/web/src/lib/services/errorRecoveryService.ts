class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly threshold = 5;
  private readonly timeout = 30000; // 30 seconds
  private readonly resetTimeout = 60000; // 1 minute

  async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailureTime !== undefined &&
           Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}

class ErrorRecoveryService {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private retryAttempts = new Map<string, number>();
  private readonly maxRetries = 3;

  async attemptRecovery(error: Error): Promise<boolean> {
    const errorType = error.name || 'UnknownError';

    console.log(`🔄 Attempting recovery for: ${errorType}`);

    // Strategy 1: Clear cache if available
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('✅ Cache cleared');
      } catch (e) {
        console.warn('Failed to clear cache:', e);
      }
    }

    // Strategy 2: Reset circuit breakers
    this.circuitBreakers.forEach((breaker, key) => {
      if (breaker.getState() === 'OPEN') {
        console.log(`🔄 Resetting circuit breaker: ${key}`);
      }
    });

    // Strategy 3: Clear retry counters for fresh start
    this.retryAttempts.clear();

    // Strategy 4: Reload critical resources
    if (errorType.includes('Chunk') || errorType.includes('Module')) {
      console.log('🔄 Detected module loading error, attempting reload...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return true;
    }

    return false;
  }

  getCircuitBreaker(service: string): CircuitBreaker {
    if (!this.circuitBreakers.has(service)) {
      this.circuitBreakers.set(service, new CircuitBreaker());
    }
    return this.circuitBreakers.get(service)!;
  }

  async retryWithBackoff<T>(
    action: () => Promise<T>,
    key: string,
    maxRetries = this.maxRetries
  ): Promise<T> {
    const attempts = this.retryAttempts.get(key) || 0;

    try {
      const result = await action();
      this.retryAttempts.delete(key);
      return result;
    } catch (error) {
      if (attempts >= maxRetries) {
        this.retryAttempts.delete(key);
        throw error;
      }

      this.retryAttempts.set(key, attempts + 1);
      const delay = Math.min(1000 * Math.pow(2, attempts), 10000);

      console.log(`⏳ Retry ${attempts + 1}/${maxRetries} in ${delay}ms for ${key}`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryWithBackoff(action, key, maxRetries);
    }
  }

  reset(): void {
    this.circuitBreakers.clear();
    this.retryAttempts.clear();
  }
}

export const errorRecoveryService = new ErrorRecoveryService();
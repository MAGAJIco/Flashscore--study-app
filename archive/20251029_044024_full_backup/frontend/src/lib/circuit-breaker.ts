
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  name: string;
}

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();
  private options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = options;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker [${this.options.name}] is OPEN`);
      }
      this.state = 'HALF_OPEN';
      console.log(`🔄 Circuit breaker [${this.options.name}] entering HALF_OPEN`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log(`✅ Circuit breaker [${this.options.name}] CLOSED`);
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.timeout;
      console.error(`🚨 Circuit breaker [${this.options.name}] OPEN - retry in ${this.options.timeout}ms`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }
}

// Global circuit breakers for different services
export const backendCircuit = new CircuitBreaker({
  name: 'Backend API',
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30 seconds
});

export const mlCircuit = new CircuitBreaker({
  name: 'ML Service',
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 60000, // 60 seconds
});

export { CircuitBreaker };

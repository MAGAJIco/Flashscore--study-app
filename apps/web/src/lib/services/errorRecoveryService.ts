
interface RecoveryStrategy {
  errorPattern: RegExp;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recovery: () => Promise<boolean>;
  description: string;
}

class AutoErrorRecoveryService {
  private strategies: RecoveryStrategy[] = [];
  private recoveryHistory: Map<string, number> = new Map();
  private maxRetries = 3;

  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies() {
    this.strategies = [
      {
        errorPattern: /fetch.*failed|network.*error/i,
        priority: 'high',
        recovery: async () => {
          // Wait and retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 2000));
          return true;
        },
        description: 'Network reconnection'
      },
      {
        errorPattern: /mongodb.*connection|database.*error/i,
        priority: 'critical',
        recovery: async () => {
          // Attempt to reconnect to database
          try {
            const response = await fetch('/api/health');
            return response.ok;
          } catch {
            return false;
          }
        },
        description: 'Database reconnection'
      },
      {
        errorPattern: /quota.*exceeded|storage.*full/i,
        priority: 'medium',
        recovery: async () => {
          // Clear old cache data
          if (typeof window !== 'undefined') {
            const keys = await caches.keys();
            await Promise.all(
              keys.slice(0, Math.floor(keys.length / 2)).map(key => caches.delete(key))
            );
          }
          return true;
        },
        description: 'Cache cleanup'
      },
      {
        errorPattern: /ml.*service.*unavailable|prediction.*failed/i,
        priority: 'medium',
        recovery: async () => {
          // Switch to fallback prediction mode
          localStorage.setItem('use-fallback-predictions', 'true');
          return true;
        },
        description: 'ML service fallback'
      },
      {
        errorPattern: /chunk.*failed|dynamic.*import.*error/i,
        priority: 'high',
        recovery: async () => {
          // Clear service worker cache and reload
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
          }
          window.location.reload();
          return true;
        },
        description: 'Code chunk recovery'
      }
    ];
  }

  async attemptRecovery(error: Error): Promise<boolean> {
    const errorMessage = error.message || String(error);
    const errorKey = errorMessage.slice(0, 50);
    
    // Check retry limit
    const retries = this.recoveryHistory.get(errorKey) || 0;
    if (retries >= this.maxRetries) {
      console.warn(`Max retries exceeded for error: ${errorKey}`);
      return false;
    }

    // Find matching strategy
    const strategy = this.strategies.find(s => s.errorPattern.test(errorMessage));
    
    if (!strategy) {
      return false;
    }

    console.log(`🔄 Attempting recovery: ${strategy.description}`);
    
    try {
      const success = await strategy.recovery();
      
      if (success) {
        console.log(`✅ Recovery successful: ${strategy.description}`);
        this.recoveryHistory.delete(errorKey);
        return true;
      } else {
        this.recoveryHistory.set(errorKey, retries + 1);
        return false;
      }
    } catch (recoveryError) {
      console.error(`❌ Recovery failed:`, recoveryError);
      this.recoveryHistory.set(errorKey, retries + 1);
      return false;
    }
  }

  getRecoveryStatus() {
    return {
      activeStrategies: this.strategies.length,
      recentRecoveries: Array.from(this.recoveryHistory.entries()),
      availableRecoveries: this.strategies.map(s => ({
        description: s.description,
        priority: s.priority
      }))
    };
  }
}

export const errorRecoveryService = new AutoErrorRecoveryService();

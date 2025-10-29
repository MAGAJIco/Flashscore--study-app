
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ClientCacheManager {
  private static cache = new Map<string, CacheItem<any>>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static size(): number {
    return this.cache.size;
  }
}

// Auto cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    ClientCacheManager.cleanup();
  }, 10 * 60 * 1000);
}

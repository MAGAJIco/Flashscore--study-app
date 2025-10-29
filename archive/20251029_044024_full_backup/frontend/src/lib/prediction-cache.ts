
import { cache } from './cache';

interface PredictionCacheEntry {
  prediction: any;
  confidence: number;
  timestamp: number;
  modelVersion: string;
  features: Record<string, any>;
}

interface CacheStrategy {
  ttl: number;
  maxEntries: number;
  evictionPolicy: 'lru' | 'lfu' | 'confidence-based';
}

class PredictionCache {
  private strategies: Map<string, CacheStrategy> = new Map();
  private accessCounts: Map<string, number> = new Map();
  private lastAccess: Map<string, number> = new Map();

  constructor() {
    // Default strategies by prediction type
    this.strategies.set('live-match', {
      ttl: 30000, // 30 seconds for live matches
      maxEntries: 50,
      evictionPolicy: 'lru',
    });

    this.strategies.set('upcoming-match', {
      ttl: 300000, // 5 minutes for upcoming matches
      maxEntries: 200,
      evictionPolicy: 'confidence-based',
    });

    this.strategies.set('historical', {
      ttl: 3600000, // 1 hour for historical data
      maxEntries: 1000,
      evictionPolicy: 'lfu',
    });
  }

  set(key: string, prediction: any, options?: { type?: string; confidence?: number }) {
    const type = options?.type || 'upcoming-match';
    const strategy = this.strategies.get(type) || this.strategies.get('upcoming-match')!;

    const entry: PredictionCacheEntry = {
      prediction,
      confidence: options?.confidence || 0.5,
      timestamp: Date.now(),
      modelVersion: 'v1.0',
      features: {},
    };

    // Enforce max entries with eviction policy
    this.enforceMaxEntries(type, strategy);

    cache.set(key, entry, strategy.ttl);
    this.accessCounts.set(key, 1);
    this.lastAccess.set(key, Date.now());
  }

  get(key: string): any | null {
    const entry = cache.get<PredictionCacheEntry>(key);
    
    if (entry) {
      // Update access tracking
      this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1);
      this.lastAccess.set(key, Date.now());
      
      return entry.prediction;
    }
    
    return null;
  }

  getWithMetadata(key: string): PredictionCacheEntry | null {
    const entry = cache.get<PredictionCacheEntry>(key);
    
    if (entry) {
      this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1);
      this.lastAccess.set(key, Date.now());
    }
    
    return entry;
  }

  private enforceMaxEntries(type: string, strategy: CacheStrategy) {
    // This is a simplified version - in production, implement proper eviction
    // based on the strategy's evictionPolicy
    const allKeys = Array.from(this.lastAccess.keys());
    
    if (allKeys.length >= strategy.maxEntries) {
      // Evict based on policy
      const keyToEvict = this.selectEvictionKey(allKeys, strategy.evictionPolicy);
      if (keyToEvict) {
        cache.delete(keyToEvict);
        this.accessCounts.delete(keyToEvict);
        this.lastAccess.delete(keyToEvict);
      }
    }
  }

  private selectEvictionKey(keys: string[], policy: string): string | null {
    if (keys.length === 0) return null;

    switch (policy) {
      case 'lru': // Least Recently Used
        return keys.reduce((oldest, key) => {
          const oldestTime = this.lastAccess.get(oldest) || 0;
          const keyTime = this.lastAccess.get(key) || 0;
          return keyTime < oldestTime ? key : oldest;
        });

      case 'lfu': // Least Frequently Used
        return keys.reduce((least, key) => {
          const leastCount = this.accessCounts.get(least) || 0;
          const keyCount = this.accessCounts.get(key) || 0;
          return keyCount < leastCount ? key : least;
        });

      case 'confidence-based': // Evict lowest confidence first
        return keys.reduce((lowest, key) => {
          const lowestEntry = cache.get<PredictionCacheEntry>(lowest);
          const keyEntry = cache.get<PredictionCacheEntry>(key);
          const lowestConf = lowestEntry?.confidence || 0;
          const keyConf = keyEntry?.confidence || 0;
          return keyConf < lowestConf ? key : lowest;
        });

      default:
        return keys[0];
    }
  }

  invalidatePattern(pattern: string) {
    // Clear all cache entries matching a pattern (e.g., "match_12345_*")
    const regex = new RegExp(pattern.replace('*', '.*'));
    const keysToDelete: string[] = [];

    this.lastAccess.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      cache.delete(key);
      this.accessCounts.delete(key);
      this.lastAccess.delete(key);
    });
  }

  getStats() {
    return {
      totalEntries: this.lastAccess.size,
      avgAccessCount: Array.from(this.accessCounts.values()).reduce((a, b) => a + b, 0) / this.accessCounts.size || 0,
      strategies: Array.from(this.strategies.entries()).map(([type, strategy]) => ({
        type,
        ...strategy,
      })),
    };
  }

  clear() {
    cache.clear();
    this.accessCounts.clear();
    this.lastAccess.clear();
  }
}

export const predictionCache = new PredictionCache();

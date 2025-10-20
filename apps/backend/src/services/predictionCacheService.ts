
import { createHash } from 'crypto';

interface CachedPrediction {
  features: number[];
  result: any;
  timestamp: number;
  hitCount: number;
}

class PredictionCacheService {
  private cache = new Map<string, CachedPrediction>();
  private readonly TTL = 3600000; // 1 hour
  private readonly SIMILARITY_THRESHOLD = 0.95;

  private generateKey(features: number[]): string {
    return createHash('md5').update(JSON.stringify(features)).digest('hex');
  }

  private areSimilar(features1: number[], features2: number[]): boolean {
    if (features1.length !== features2.length) return false;
    
    let similarity = 0;
    for (let i = 0; i < features1.length; i++) {
      similarity += 1 - Math.abs(features1[i] - features2[i]);
    }
    return (similarity / features1.length) >= this.SIMILARITY_THRESHOLD;
  }

  get(features: number[]): any | null {
    const key = this.generateKey(features);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.TTL) {
      cached.hitCount++;
      return cached.result;
    }

    // Check for similar predictions
    for (const [_, cachedPred] of this.cache) {
      if (this.areSimilar(features, cachedPred.features) &&
          Date.now() - cachedPred.timestamp < this.TTL) {
        cachedPred.hitCount++;
        return cachedPred.result;
      }
    }

    return null;
  }

  set(features: number[], result: any): void {
    const key = this.generateKey(features);
    this.cache.set(key, {
      features,
      result,
      timestamp: Date.now(),
      hitCount: 0
    });

    // Cleanup old entries
    if (this.cache.size > 1000) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].hitCount - b[1].hitCount);
      
      for (let i = 0; i < 200; i++) {
        this.cache.delete(sortedEntries[i][0]);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      avgHitCount: Array.from(this.cache.values())
        .reduce((sum, v) => sum + v.hitCount, 0) / this.cache.size || 0
    };
  }
}

export default new PredictionCacheService();

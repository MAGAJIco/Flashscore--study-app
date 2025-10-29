
/**
 * Safe Hydration Storage
 * Ensures localStorage operations don't cause hydration mismatches
 */

type StorageValue = string | number | boolean | object | null;

class SafeHydrationStorage {
  private cache = new Map<string, StorageValue>();
  private isClient = typeof window !== 'undefined';

  /**
   * Get value safely without causing hydration mismatch
   */
  get<T = StorageValue>(key: string, defaultValue?: T): T | null {
    // Always return null during SSR
    if (!this.isClient) {
      return defaultValue ?? null;
    }

    // Use cache during hydration phase
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;

      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);
      return parsed as T;
    } catch {
      return defaultValue ?? null;
    }
  }

  /**
   * Set value with hydration safety
   */
  set(key: string, value: StorageValue): boolean {
    if (!this.isClient) return false;

    try {
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
      this.cache.set(key, value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove value safely
   */
  remove(key: string): boolean {
    if (!this.isClient) return false;

    try {
      localStorage.removeItem(key);
      this.cache.delete(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear cache (call this after hydration)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get value only after hydration is complete
   */
  getPostHydration<T = StorageValue>(key: string, defaultValue?: T): Promise<T | null> {
    return new Promise((resolve) => {
      if (!this.isClient) {
        resolve(defaultValue ?? null);
        return;
      }

      // Wait for next tick (after hydration)
      setTimeout(() => {
        resolve(this.get(key, defaultValue));
      }, 0);
    });
  }
}

export const safeStorage = new SafeHydrationStorage();

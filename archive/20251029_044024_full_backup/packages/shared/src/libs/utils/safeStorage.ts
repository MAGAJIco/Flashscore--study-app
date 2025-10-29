
export class SafeStorage {
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Failed to read ${key} from storage:`, e);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Failed to write ${key} to storage:`, e);
      return false;
    }
  }

  static removeItem(key: string): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Failed to remove ${key} from storage:`, e);
    }
  }

  static clear(): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  }
}

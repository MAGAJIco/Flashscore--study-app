
import { ReplitStorage } from '@magajico/shared/utils';

interface ThemePreferences {
  theme: string;
  colorBlindMode: string;
  schedule: any;
  customColors?: Record<string, string>;
  lastUpdated: string;
}

export class ThemeSyncManager {
  private static readonly SYNC_KEY = 'theme_preferences';

  static async syncToCloud(preferences: ThemePreferences): Promise<void> {
    try {
      const data = {
        ...preferences,
        lastUpdated: new Date().toISOString()
      };
      
      const storage = ReplitStorage.getInstance();
      await storage.uploadText(
        `${this.SYNC_KEY}_${this.getUserId()}`,
        JSON.stringify(data)
      );
      
      localStorage.setItem('theme_last_sync', data.lastUpdated);
    } catch (error) {
      console.error('Failed to sync theme to cloud:', error);
    }
  }

  static async syncFromCloud(): Promise<ThemePreferences | null> {
    try {
      const storage = ReplitStorage.getInstance();
      const data = await storage.downloadText(
        `${this.SYNC_KEY}_${this.getUserId()}`
      );
      
      const preferences = JSON.parse(data) as ThemePreferences;
      const localLastSync = localStorage.getItem('theme_last_sync');
      
      if (!localLastSync || new Date(preferences.lastUpdated) > new Date(localLastSync)) {
        this.applyPreferences(preferences);
        return preferences;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to sync theme from cloud:', error);
      return null;
    }
  }

  static async enableAutoSync(intervalMinutes: number = 5): Promise<void> {
    setInterval(async () => {
      const preferences = this.getCurrentPreferences();
      await this.syncToCloud(preferences);
    }, intervalMinutes * 60 * 1000);
  }

  private static getCurrentPreferences(): ThemePreferences {
    return {
      theme: localStorage.getItem('theme') || 'auto',
      colorBlindMode: localStorage.getItem('color_blind_mode') || 'none',
      schedule: JSON.parse(localStorage.getItem('theme_schedule') || 'null'),
      lastUpdated: new Date().toISOString()
    };
  }

  private static applyPreferences(preferences: ThemePreferences): void {
    localStorage.setItem('theme', preferences.theme);
    localStorage.setItem('color_blind_mode', preferences.colorBlindMode);
    if (preferences.schedule) {
      localStorage.setItem('theme_schedule', JSON.stringify(preferences.schedule));
    }
  }

  private static getUserId(): string {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }
}

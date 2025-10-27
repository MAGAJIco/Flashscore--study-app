
import { locales, type Locale } from '@/i18n';

/**
 * Centralized Locale Management System
 * Consolidates all locale-related functionality across the application
 */

export class LocaleManager {
  private static instance: LocaleManager;
  private currentLocale: Locale = 'en';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeLocale();
    }
  }

  static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  /**
   * Initialize locale from cookie, localStorage, or browser
   */
  private initializeLocale(): void {
    const cookieLocale = this.getLocaleFromCookie();
    const storageLocale = this.getLocaleFromStorage();
    const browserLocale = this.getBrowserLocale();

    this.currentLocale = cookieLocale || storageLocale || browserLocale || 'en';
    this.saveLocale(this.currentLocale);
  }

  /**
   * Get current locale
   */
  getLocale(): Locale {
    return this.currentLocale;
  }

  /**
   * Set and persist locale across all storage mechanisms
   */
  setLocale(locale: Locale): void {
    if (!this.isValidLocale(locale)) {
      console.error(`Invalid locale: ${locale}`);
      return;
    }

    this.currentLocale = locale;
    this.saveLocale(locale);
    this.broadcastLocaleChange(locale);
  }

  /**
   * Validate locale
   */
  isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
  }

  /**
   * Get all available locales
   */
  getAvailableLocales(): Locale[] {
    return [...locales];
  }

  /**
   * Get locale display name
   */
  getLocaleDisplayName(locale: Locale): string {
    const names: Record<Locale, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      pt: 'Português'
    };
    return names[locale] || locale;
  }

  /**
   * Get locale from cookie
   */
  private getLocaleFromCookie(): Locale | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    
    if (localeCookie) {
      const locale = localeCookie.split('=')[1];
      return this.isValidLocale(locale) ? locale : null;
    }
    
    return null;
  }

  /**
   * Get locale from localStorage
   */
  private getLocaleFromStorage(): Locale | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem('preferredLocale');
      return stored && this.isValidLocale(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  /**
   * Get browser's preferred locale
   */
  private getBrowserLocale(): Locale | null {
    if (typeof navigator === 'undefined') return null;
    
    const browserLang = navigator.language.split('-')[0];
    return this.isValidLocale(browserLang) ? browserLang : null;
  }

  /**
   * Save locale to all storage mechanisms
   */
  private saveLocale(locale: Locale): void {
    if (typeof window === 'undefined') return;

    // Save to cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    // Save to localStorage
    try {
      localStorage.setItem('preferredLocale', locale);
    } catch (error) {
      console.error('Failed to save locale to localStorage:', error);
    }
  }

  /**
   * Broadcast locale change to other tabs/windows
   */
  private broadcastLocaleChange(locale: Locale): void {
    if (typeof window === 'undefined') return;

    try {
      const channel = new BroadcastChannel('language_sync');
      channel.postMessage({
        type: 'LANGUAGE_CHANGED',
        locale,
        timestamp: Date.now()
      });
      channel.close();
    } catch (error) {
      console.error('Failed to broadcast locale change:', error);
    }

    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'preferredLocale',
      newValue: locale
    }));
  }

  /**
   * Listen for locale changes from other tabs
   */
  static setupCrossTabSync(callback: (locale: Locale) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const channel = new BroadcastChannel('language_sync');
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LANGUAGE_CHANGED') {
        const { locale } = event.data;
        if (LocaleManager.getInstance().isValidLocale(locale)) {
          callback(locale);
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'preferredLocale' && e.newValue) {
        if (LocaleManager.getInstance().isValidLocale(e.newValue)) {
          callback(e.newValue);
        }
      }
    };

    channel.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }
}

// Export singleton instance
export const localeManager = LocaleManager.getInstance();

// Helper functions for components
export function getCurrentLocale(): Locale {
  return localeManager.getLocale();
}

export function setCurrentLocale(locale: Locale): void {
  localeManager.setLocale(locale);
}

export function getAvailableLocales(): Locale[] {
  return localeManager.getAvailableLocales();
}

export function getLocaleDisplayName(locale: Locale): string {
  return localeManager.getLocaleDisplayName(locale);
}

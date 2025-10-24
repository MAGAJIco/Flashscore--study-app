
/**
 * Hydration Auto-Fix Utility
 * Automatically fixes common hydration issues
 */

export class HydrationAutoFix {
  private static instance: HydrationAutoFix;
  private fixApplied = false;

  private constructor() {}

  static getInstance(): HydrationAutoFix {
    if (!HydrationAutoFix.instance) {
      HydrationAutoFix.instance = new HydrationAutoFix();
    }
    return HydrationAutoFix.instance;
  }

  /**
   * Apply all auto-fixes
   */
  applyFixes(): void {
    if (this.fixApplied || typeof window === 'undefined') return;
    this.fixApplied = true;

    this.fixThemeAttribute();
    this.fixDateTimeElements();
    this.fixConditionalElements();
    this.cleanupProblematicStorage();
  }

  /**
   * Fix theme attribute mismatches
   */
  private fixThemeAttribute(): void {
    try {
      const htmlElement = document.documentElement;
      const storedTheme = localStorage.getItem('theme');
      const currentTheme = htmlElement.getAttribute('data-theme');

      if (storedTheme && storedTheme !== currentTheme) {
        htmlElement.setAttribute('data-theme', storedTheme);
      }
    } catch (e) {
      console.warn('Theme fix failed:', e);
    }
  }

  /**
   * Fix date/time elements that change between server and client
   */
  private fixDateTimeElements(): void {
    const timeElements = document.querySelectorAll('[data-time], time');
    
    timeElements.forEach(element => {
      if (!element.hasAttribute('suppresshydrationwarning')) {
        element.setAttribute('suppresshydrationwarning', 'true');
      }
    });
  }

  /**
   * Fix elements that conditionally render based on client state
   */
  private fixConditionalElements(): void {
    const conditionalElements = document.querySelectorAll(
      '[data-client-only], [data-device-specific]'
    );
    
    conditionalElements.forEach(element => {
      element.setAttribute('suppresshydrationwarning', 'true');
    });
  }

  /**
   * Clean up problematic storage that causes mismatches
   */
  private cleanupProblematicStorage(): void {
    try {
      const keysToValidate = [
        'theme',
        'userPreferences',
        'deviceSettings',
        'offlineQueue'
      ];

      keysToValidate.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            JSON.parse(value);
          } catch {
            console.warn(`Removing invalid ${key} from storage`);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.warn('Storage cleanup failed:', e);
    }
  }

  /**
   * Reset and reload if hydration is critically broken
   */
  criticalReset(): void {
    console.warn('🔄 Performing critical hydration reset...');
    
    try {
      // Backup critical data
      const backupData = {
        theme: localStorage.getItem('theme'),
        language: localStorage.getItem('language')
      };

      // Clear everything
      localStorage.clear();
      sessionStorage.clear();

      // Restore critical data
      if (backupData.theme) localStorage.setItem('theme', backupData.theme);
      if (backupData.language) localStorage.setItem('language', backupData.language);

      // Force reload
      window.location.reload();
    } catch (e) {
      console.error('Critical reset failed:', e);
    }
  }
}

// Auto-initialize on client
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    HydrationAutoFix.getInstance().applyFixes();
  });
}


export class LanguageSyncManager {
  private static channel: BroadcastChannel | null = null;

  static init() {
    if (typeof window === 'undefined') return;

    // Create broadcast channel for cross-tab sync
    this.channel = new BroadcastChannel('language_sync');

    this.channel.onmessage = (event) => {
      if (event.data.type === 'LANGUAGE_CHANGED') {
        const { locale } = event.data;
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
      }
    };

    // Listen to storage events for cross-device sync (via cloud)
    window.addEventListener('storage', (e) => {
      if (e.key === 'preferredLocale' && e.newValue) {
        document.cookie = `NEXT_LOCALE=${e.newValue}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
      }
    });
  }

  static broadcastLanguageChange(locale: string) {
    this.channel?.postMessage({
      type: 'LANGUAGE_CHANGED',
      locale,
      timestamp: Date.now()
    });
  }

  static cleanup() {
    this.channel?.close();
  }
}


interface DeepLinkEvent {
  id: string;
  type: 'prediction' | 'match' | 'news' | 'leaderboard';
  source: 'qr' | 'social' | 'direct';
  timestamp: string;
  referrer?: string;
  userAgent: string;
}

export class DeepLinkAnalytics {
  private static readonly ANALYTICS_KEY = 'deep_link_analytics';

  static trackDeepLink(params: {
    type: string;
    id: string;
    source: string;
  }): void {
    const event: DeepLinkEvent = {
      id: params.id,
      type: params.type as any,
      source: params.source as any,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    };

    this.saveEvent(event);
    this.sendToBackend(event);
  }

  private static saveEvent(event: DeepLinkEvent): void {
    const events = this.getEvents();
    events.push(event);
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(events.slice(-100)));
  }

  static getEvents(): DeepLinkEvent[] {
    const data = localStorage.getItem(this.ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getAnalytics(): {
    totalClicks: number;
    byType: Record<string, number>;
    bySource: Record<string, number>;
    conversionRate: number;
  } {
    const events = this.getEvents();
    
    const analytics = {
      totalClicks: events.length,
      byType: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      conversionRate: 0
    };

    events.forEach(event => {
      analytics.byType[event.type] = (analytics.byType[event.type] || 0) + 1;
      analytics.bySource[event.source] = (analytics.bySource[event.source] || 0) + 1;
    });

    return analytics;
  }

  private static async sendToBackend(event: DeepLinkEvent): Promise<void> {
    try {
      await fetch('/api/analytics/deep-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }
}

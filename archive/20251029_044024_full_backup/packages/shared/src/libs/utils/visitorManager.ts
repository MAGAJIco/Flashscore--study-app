
interface VisitorData {
  id: string;
  visitCount: number;
  firstVisit: Date;
  lastVisit: Date;
  ipAddress?: string;
  userAgent?: string;
  accessLevel: 'guest' | 'registered' | 'premium';
  contentAccessed: string[];
  restrictedUntil?: Date;
}

interface ContentRestriction {
  type: 'predictions' | 'live_data' | 'statistics' | 'premium_analysis';
  guestLimit: number;
  registeredLimit: number;
  premiumLimit: number;
}

class VisitorManager {
  private static readonly CONTENT_RESTRICTIONS: ContentRestriction[] = [
    {
      type: 'predictions',
      guestLimit: 3,
      registeredLimit: 15,
      premiumLimit: -1 // unlimited
    },
    {
      type: 'live_data',
      guestLimit: 5,
      registeredLimit: 25,
      premiumLimit: -1
    },
    {
      type: 'statistics',
      guestLimit: 2,
      registeredLimit: 10,
      premiumLimit: -1
    },
    {
      type: 'premium_analysis',
      guestLimit: 0,
      registeredLimit: 3,
      premiumLimit: -1
    }
  ];

  // Check if we're in a browser environment
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  // Generate unique visitor ID based on browser fingerprint
  static generateVisitorId(): string {
    if (!this.isBrowser()) {
      return 'visitor_ssr_' + Math.random().toString(36).substring(7);
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Visitor fingerprint', 2, 2);
      }

      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ].join('|');

      // Simple hash function
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return 'visitor_' + Math.abs(hash).toString(36);
    } catch (error) {
      console.error('Error generating visitor ID:', error);
      return 'visitor_fallback_' + Math.random().toString(36).substring(7);
    }
  }

  // Track visitor and update visit count
  static trackVisitor(userId?: string): VisitorData {
    if (!this.isBrowser()) {
      // Return a default visitor data for SSR
      return {
        id: userId || 'ssr_visitor',
        visitCount: 1,
        firstVisit: new Date(),
        lastVisit: new Date(),
        accessLevel: userId ? 'registered' : 'guest',
        contentAccessed: []
      };
    }

    const visitorId = userId || this.generateVisitorId();
    const stored = localStorage.getItem('visitor_data');
    let visitorData: VisitorData;

    if (stored) {
      visitorData = JSON.parse(stored);
      visitorData.visitCount++;
      visitorData.lastVisit = new Date();
    } else {
      visitorData = {
        id: visitorId,
        visitCount: 1,
        firstVisit: new Date(),
        lastVisit: new Date(),
        accessLevel: userId ? 'registered' : 'guest',
        contentAccessed: []
      };
    }

    // Update access level based on registration status
    if (userId && visitorData.accessLevel === 'guest') {
      visitorData.accessLevel = 'registered';
    }

    localStorage.setItem('visitor_data', JSON.stringify(visitorData));

    // Log visitor activity for security
    try {
      const SecurityUtils = require('./securityUtils').default;
      SecurityUtils.logSecurityEvent('visitor_tracked', {
        visitorId: visitorData.id,
        visitCount: visitorData.visitCount,
        accessLevel: visitorData.accessLevel
      });
    } catch (error) {
      // Silently fail if SecurityUtils is not available
      console.warn('SecurityUtils not available for logging');
    }

    return visitorData;
  }

  // Check if visitor can access content
  static canAccessContent(contentType: string): {
    allowed: boolean;
    reason?: string;
    visitsRemaining?: number;
    upgradeRequired?: boolean;
  } {
    if (!this.isBrowser()) {
      return { allowed: true }; // Allow during SSR
    }

    const visitorData = this.getVisitorData();
    if (!visitorData) {
      return { allowed: false, reason: 'Visitor data not found' };
    }

    const restriction = this.CONTENT_RESTRICTIONS.find(r => r.type === contentType as any);
    if (!restriction) {
      return { allowed: true }; // No restriction defined
    }

    const limit = this.getLimitForAccessLevel(restriction, visitorData.accessLevel);

    if (limit === -1) {
      return { allowed: true }; // Unlimited access
    }

    const accessedCount = visitorData.contentAccessed.filter(c => c.startsWith(contentType)).length;

    if (accessedCount >= limit) {
      return {
        allowed: false,
        reason: `Content limit reached for ${visitorData.accessLevel} users`,
        visitsRemaining: 0,
        upgradeRequired: visitorData.accessLevel === 'guest'
      };
    }

    return {
      allowed: true,
      visitsRemaining: limit - accessedCount
    };
  }

  // Check if guest visit limit exceeded
  static isGuestLimitExceeded(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    const visitorData = this.getVisitorData();
    if (!visitorData || visitorData.accessLevel !== 'guest') {
      return false;
    }

    return visitorData.visitCount > 4; // Guest limit of 4 visits
  }

  // Record content access
  static recordContentAccess(contentType: string, contentId: string): void {
    if (!this.isBrowser()) {
      return;
    }

    const visitorData = this.getVisitorData();
    if (!visitorData) return;

    const accessRecord = `${contentType}:${contentId}:${Date.now()}`;
    visitorData.contentAccessed.push(accessRecord);

    // Keep only last 100 access records
    if (visitorData.contentAccessed.length > 100) {
      visitorData.contentAccessed = visitorData.contentAccessed.slice(-100);
    }

    localStorage.setItem('visitor_data', JSON.stringify(visitorData));
  }

  // Get visitor data
  static getVisitorData(): VisitorData | null {
    if (!this.isBrowser()) {
      return null;
    }

    const stored = localStorage.getItem('visitor_data');
    return stored ? JSON.parse(stored) : null;
  }

  // Generate paywall message based on access level
  static generatePaywallMessage(contentType: string): {
    title: string;
    message: string;
    ctaText: string;
    ctaAction: 'register' | 'upgrade' | 'wait';
  } {
    const visitorData = this.getVisitorData();
    const accessLevel = visitorData?.accessLevel || 'guest';

    if (accessLevel === 'guest') {
      return {
        title: '🚀 Unlock Premium Sports Intelligence',
        message: `You've reached your free limit for ${contentType}. Join thousands of sports fans getting winning predictions and live data!`,
        ctaText: 'Sign Up Free - Get More Access',
        ctaAction: 'register'
      };
    }

    if (accessLevel === 'registered') {
      return {
        title: '⭐ Upgrade to Premium Access',
        message: `You've used your daily ${contentType} allowance. Upgrade for unlimited access to our AI-powered predictions and exclusive features.`,
        ctaText: 'Upgrade to Premium',
        ctaAction: 'upgrade'
      };
    }

    return {
      title: '⏳ Content Limit Reached',
      message: 'You\'ve reached today\'s limit for this content type. Please try again tomorrow.',
      ctaText: 'Wait for Reset',
      ctaAction: 'wait'
    };
  }

  // Reset daily limits (called by cron job)
  static resetDailyLimits(): void {
    if (!this.isBrowser()) {
      return;
    }

    const visitorData = this.getVisitorData();
    if (!visitorData) return;

    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('last_daily_reset');

    if (lastReset !== today) {
      // Filter out today's content accesses
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      visitorData.contentAccessed = visitorData.contentAccessed.filter(record => {
        const timestamp = parseInt(record.split(':')[2]);
        return timestamp < yesterday.getTime();
      });

      localStorage.setItem('visitor_data', JSON.stringify(visitorData));
      localStorage.setItem('last_daily_reset', today);
    }
  }

  // Get content access analytics
  static getAccessAnalytics(): {
    totalVisitors: number;
    guestVisitors: number;
    registeredUsers: number;
    premiumUsers: number;
    contentStats: { [key: string]: number };
  } {
    if (!this.isBrowser()) {
      return {
        totalVisitors: 0,
        guestVisitors: 0,
        registeredUsers: 0,
        premiumUsers: 0,
        contentStats: {}
      };
    }

    const visitorData = this.getVisitorData();

    return {
      totalVisitors: 1,
      guestVisitors: visitorData?.accessLevel === 'guest' ? 1 : 0,
      registeredUsers: visitorData?.accessLevel === 'registered' ? 1 : 0,
      premiumUsers: visitorData?.accessLevel === 'premium' ? 1 : 0,
      contentStats: this.calculateContentStats(visitorData?.contentAccessed || [])
    };
  }

  private static getLimitForAccessLevel(restriction: ContentRestriction, accessLevel: string): number {
    switch (accessLevel) {
      case 'guest': return restriction.guestLimit;
      case 'registered': return restriction.registeredLimit;
      case 'premium': return restriction.premiumLimit;
      default: return restriction.guestLimit;
    }
  }

  private static calculateContentStats(contentAccessed: string[]): { [key: string]: number } {
    const stats: { [key: string]: number } = {};

    contentAccessed.forEach(record => {
      const contentType = record.split(':')[0];
      stats[contentType] = (stats[contentType] || 0) + 1;
    });

    return stats;
  }
}

export { VisitorManager };
export type { VisitorData, ContentRestriction };

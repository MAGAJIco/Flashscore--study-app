
/**
 * Advanced Analytics & Intelligence System
 * Track user behavior, prediction patterns, and system performance
 */

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventType: string;
  category: 'user' | 'prediction' | 'system' | 'business';
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  deviceInfo?: {
    type: 'mobile' | 'desktop' | 'tablet';
    os: string;
    browser: string;
  };
}

export interface UserBehaviorPattern {
  userId: string;
  activeHours: number[];
  favoriteSports: string[];
  avgConfidence: number;
  predictionFrequency: number;
  engagementScore: number;
  churnRisk: number; // 0-100
}

export interface PredictionInsight {
  sport: string;
  accuracy: number;
  totalPredictions: number;
  bestTimeSlots: string[];
  weaknesses: string[];
  recommendations: string[];
}

class AdvancedAnalytics {
  private events: AnalyticsEvent[] = [];
  private readonly MAX_EVENTS = 10000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadEvents();
  }

  // Track any event
  track(eventType: string, category: AnalyticsEvent['category'], properties: Record<string, any> = {}, userId?: string): void {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventType,
      category,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo()
    };

    this.events.unshift(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }
    this.saveEvents();
  }

  // Analyze user behavior patterns
  analyzeUserBehavior(userId: string): UserBehaviorPattern {
    const userEvents = this.events.filter(e => e.userId === userId);
    
    // Extract active hours
    const hours = userEvents.map(e => new Date(e.timestamp).getHours());
    const activeHours = [...new Set(hours)].sort((a, b) => {
      const countA = hours.filter(h => h === a).length;
      const countB = hours.filter(h => h === b).length;
      return countB - countA;
    }).slice(0, 5);

    // Favorite sports
    const sportEvents = userEvents.filter(e => e.eventType === 'prediction_made' && e.properties.sport);
    const sportCounts = sportEvents.reduce((acc, e) => {
      const sport = e.properties.sport;
      acc[sport] = (acc[sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteSports = Object.entries(sportCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([sport]) => sport);

    // Average confidence
    const confidenceValues = userEvents
      .filter(e => e.eventType === 'prediction_made' && typeof e.properties.confidence === 'number')
      .map(e => e.properties.confidence);
    const avgConfidence = confidenceValues.length > 0
      ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
      : 0;

    // Prediction frequency (per day)
    const daysSinceFirstEvent = userEvents.length > 0
      ? (Date.now() - new Date(userEvents[userEvents.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)
      : 1;
    const predictionFrequency = sportEvents.length / Math.max(daysSinceFirstEvent, 1);

    // Engagement score (0-100)
    const recentEvents = userEvents.filter(e => 
      Date.now() - new Date(e.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000
    );
    const engagementScore = Math.min(100, recentEvents.length * 5);

    // Churn risk (0-100)
    const daysSinceLastEvent = userEvents.length > 0
      ? (Date.now() - new Date(userEvents[0].timestamp).getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    const churnRisk = Math.min(100, daysSinceLastEvent * 10);

    return {
      userId,
      activeHours,
      favoriteSports,
      avgConfidence,
      predictionFrequency,
      engagementScore,
      churnRisk
    };
  }

  // Get prediction insights
  getPredictionInsights(userId: string): PredictionInsight[] {
    const predictions = this.events.filter(
      e => e.userId === userId && e.eventType === 'prediction_made'
    );

    const sportGroups = predictions.reduce((acc, pred) => {
      const sport = pred.properties.sport || 'Unknown';
      if (!acc[sport]) acc[sport] = [];
      acc[sport].push(pred);
      return acc;
    }, {} as Record<string, AnalyticsEvent[]>);

    return Object.entries(sportGroups).map(([sport, preds]) => {
      const correct = preds.filter(p => p.properties.correct === true).length;
      const total = preds.length;
      const accuracy = total > 0 ? (correct / total) * 100 : 0;

      // Best time slots
      const hours = preds.map(p => new Date(p.timestamp).getHours());
      const hourCounts = hours.reduce((acc, h) => {
        acc[h] = (acc[h] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      const bestTimeSlots = Object.entries(hourCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => `${hour}:00-${parseInt(hour) + 1}:00`);

      // Identify weaknesses
      const weaknesses: string[] = [];
      if (accuracy < 50) weaknesses.push('Low overall accuracy');
      if (preds.filter(p => p.properties.confidence > 80 && !p.properties.correct).length > 3) {
        weaknesses.push('Overconfidence on incorrect predictions');
      }

      // Recommendations
      const recommendations: string[] = [];
      if (accuracy < 60) {
        recommendations.push('Focus on pre-match analysis and team statistics');
      }
      if (bestTimeSlots.length > 0) {
        recommendations.push(`Your best predictions are made during ${bestTimeSlots[0]}`);
      }

      return {
        sport,
        accuracy,
        totalPredictions: total,
        bestTimeSlots,
        weaknesses,
        recommendations
      };
    });
  }

  // Funnel analysis
  getFunnelAnalysis(): Record<string, number> {
    const total = this.events.length;
    return {
      totalEvents: total,
      uniqueUsers: new Set(this.events.map(e => e.userId).filter(Boolean)).size,
      predictions: this.events.filter(e => e.eventType === 'prediction_made').length,
      challengesCreated: this.events.filter(e => e.eventType === 'challenge_created').length,
      achievementsUnlocked: this.events.filter(e => e.eventType === 'achievement_unlocked').length,
      conversions: this.events.filter(e => e.eventType === 'purchase' || e.eventType === 'subscription').length
    };
  }

  // Real-time metrics
  getRealTimeMetrics(minutes: number = 60): Record<string, any> {
    const cutoff = Date.now() - minutes * 60 * 1000;
    const recentEvents = this.events.filter(e => new Date(e.timestamp).getTime() > cutoff);

    return {
      activeUsers: new Set(recentEvents.map(e => e.userId).filter(Boolean)).size,
      eventsPerMinute: recentEvents.length / minutes,
      topEvents: this.getTopEvents(recentEvents, 5),
      deviceBreakdown: this.getDeviceBreakdown(recentEvents)
    };
  }

  private getTopEvents(events: AnalyticsEvent[], limit: number): Array<{ type: string; count: number }> {
    const counts = events.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([type, count]) => ({ type, count }));
  }

  private getDeviceBreakdown(events: AnalyticsEvent[]): Record<string, number> {
    return events.reduce((acc, e) => {
      const type = e.deviceInfo?.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getDeviceInfo(): AnalyticsEvent['deviceInfo'] {
    if (typeof window === 'undefined') return undefined;

    const ua = navigator.userAgent;
    const type = /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop';
    const os = /windows/i.test(ua) ? 'Windows' : /mac/i.test(ua) ? 'macOS' : /linux/i.test(ua) ? 'Linux' : 'Unknown';
    const browser = /chrome/i.test(ua) ? 'Chrome' : /firefox/i.test(ua) ? 'Firefox' : /safari/i.test(ua) ? 'Safari' : 'Unknown';

    return { type, os, browser };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadEvents(): void {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('analytics_events');
    if (stored) {
      try {
        this.events = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load analytics events:', e);
      }
    }
  }

  private saveEvents(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(0, 1000)));
    } catch (e) {
      console.error('Failed to save analytics events:', e);
    }
  }

  // Export data for external analysis
  exportData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.events, null, 2);
    } else {
      const headers = 'ID,User ID,Event Type,Category,Timestamp,Properties\n';
      const rows = this.events.map(e => 
        `${e.id},${e.userId || ''},${e.eventType},${e.category},${e.timestamp.toISOString()},"${JSON.stringify(e.properties)}"`
      ).join('\n');
      return headers + rows;
    }
  }
}

export const advancedAnalytics = new AdvancedAnalytics();


/**
 * Parental Controls Utilities
 * Helpers for implementing parental supervision features
 */

export interface TimeLimit {
  dailyMinutes: number;
  weeklyMinutes: number;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
}

export interface ParentalSettings {
  timeLimits: TimeLimit;
  allowedSports: string[];
  contentFilters: {
    blockGambling: boolean;
    blockSocialFeatures: boolean;
    requireApprovalForFriends: boolean;
  };
  spendingLimits: {
    dailyMax: number;
    monthlyMax: number;
    requireApproval: boolean;
  };
  notifications: {
    sendDailySummary: boolean;
    alertOnSuspiciousActivity: boolean;
    alertOnNewFriend: boolean;
  };
}

export class ParentalControlsUtil {
  /**
   * Check if current time is within allowed hours
   */
  static isWithinAllowedHours(limits: TimeLimit): boolean {
    if (!limits.startTime || !limits.endTime) return true;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return currentTime >= limits.startTime && currentTime <= limits.endTime;
  }

  /**
   * Check if daily time limit has been reached
   */
  static hasReachedDailyLimit(minutesUsedToday: number, limits: TimeLimit): boolean {
    return minutesUsedToday >= limits.dailyMinutes;
  }

  /**
   * Calculate remaining time for today
   */
  static getRemainingMinutes(minutesUsedToday: number, limits: TimeLimit): number {
    return Math.max(0, limits.dailyMinutes - minutesUsedToday);
  }

  /**
   * Validate if content is appropriate based on settings
   */
  static isContentAllowed(
    contentType: string,
    sport: string,
    settings: ParentalSettings
  ): boolean {
    // Check if sport is allowed
    if (settings.allowedSports.length > 0 && !settings.allowedSports.includes(sport)) {
      return false;
    }

    // Check content type filters
    if (contentType === 'gambling' && settings.contentFilters.blockGambling) {
      return false;
    }

    if (contentType === 'social' && settings.contentFilters.blockSocialFeatures) {
      return false;
    }

    return true;
  }

  /**
   * Check if spending is within limits
   */
  static canSpend(
    amount: number,
    spentToday: number,
    spentThisMonth: number,
    limits: ParentalSettings['spendingLimits']
  ): { allowed: boolean; reason?: string } {
    if (limits.requireApproval) {
      return { allowed: false, reason: 'Requires parental approval' };
    }

    if (spentToday + amount > limits.dailyMax) {
      return { allowed: false, reason: 'Daily spending limit reached' };
    }

    if (spentThisMonth + amount > limits.monthlyMax) {
      return { allowed: false, reason: 'Monthly spending limit reached' };
    }

    return { allowed: true };
  }

  /**
   * Generate activity report for parents
   */
  static generateActivityReport(data: {
    timeSpent: number;
    quizzesCompleted: number;
    predictionsAccuracy: number;
    newFriends: number;
    flaggedContent: number;
  }): string {
    return `
📊 Daily Activity Report

⏰ Time Spent: ${data.timeSpent} minutes
✅ Quizzes Completed: ${data.quizzesCompleted}
🎯 Prediction Accuracy: ${data.predictionsAccuracy}%
👥 New Friends: ${data.newFriends}
⚠️ Flagged Content: ${data.flaggedContent}

${data.flaggedContent > 0 ? '⚠️ Review flagged content in parental dashboard' : '✅ No concerning activity detected'}
    `.trim();
  }

  /**
   * Default safe settings for kids
   */
  static getDefaultKidsSettings(): ParentalSettings {
    return {
      timeLimits: {
        dailyMinutes: 60,
        weeklyMinutes: 420,
        startTime: '08:00',
        endTime: '20:00'
      },
      allowedSports: [], // Empty = all allowed
      contentFilters: {
        blockGambling: true,
        blockSocialFeatures: false,
        requireApprovalForFriends: true
      },
      spendingLimits: {
        dailyMax: 0,
        monthlyMax: 0,
        requireApproval: true
      },
      notifications: {
        sendDailySummary: true,
        alertOnSuspiciousActivity: true,
        alertOnNewFriend: true
      }
    };
  }
}


/**
 * Educational Analytics Service
 * Track learning progress and educational value
 */

export interface LearningMetrics {
  totalQuizzesCompleted: number;
  correctAnswers: number;
  accuracy: number;
  topicsExplored: string[];
  timeSpentLearning: number; // minutes
  streakDays: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  progress: number; // 0-100
  requirement: number;
}

export class EducationalAnalyticsService {
  /**
   * Calculate user's learning level based on metrics
   */
  static calculateLevel(metrics: LearningMetrics): LearningMetrics['level'] {
    const { totalQuizzesCompleted, accuracy } = metrics;

    if (totalQuizzesCompleted < 10) return 'beginner';
    if (totalQuizzesCompleted < 50 || accuracy < 70) return 'intermediate';
    if (totalQuizzesCompleted < 100 || accuracy < 85) return 'advanced';
    return 'expert';
  }

  /**
   * Check achievements and return newly earned ones
   */
  static checkAchievements(
    metrics: LearningMetrics,
    existingAchievements: Achievement[]
  ): Achievement[] {
    const newAchievements: Achievement[] = [];

    const allAchievements = this.getAllAchievements();

    for (const achievement of allAchievements) {
      const existing = existingAchievements.find(a => a.id === achievement.id);
      if (!existing?.earnedAt && this.isAchievementEarned(achievement, metrics)) {
        newAchievements.push({
          ...achievement,
          earnedAt: new Date(),
          progress: 100
        });
      }
    }

    return newAchievements;
  }

  private static isAchievementEarned(achievement: Achievement, metrics: LearningMetrics): boolean {
    switch (achievement.id) {
      case 'first_quiz':
        return metrics.totalQuizzesCompleted >= 1;
      case 'quiz_master':
        return metrics.totalQuizzesCompleted >= 100;
      case 'perfect_score':
        return metrics.accuracy === 100 && metrics.totalQuizzesCompleted >= 10;
      case 'week_streak':
        return metrics.streakDays >= 7;
      case 'sports_explorer':
        return metrics.topicsExplored.length >= 4;
      default:
        return false;
    }
  }

  private static getAllAchievements(): Achievement[] {
    return [
      {
        id: 'first_quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        progress: 0,
        requirement: 1
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 100 quizzes',
        icon: '🏆',
        progress: 0,
        requirement: 100
      },
      {
        id: 'perfect_score',
        name: 'Perfect Accuracy',
        description: 'Achieve 100% accuracy on 10+ quizzes',
        icon: '💯',
        progress: 0,
        requirement: 10
      },
      {
        id: 'week_streak',
        name: 'Weekly Warrior',
        description: 'Learn for 7 days in a row',
        icon: '🔥',
        progress: 0,
        requirement: 7
      },
      {
        id: 'sports_explorer',
        name: 'Sports Explorer',
        description: 'Learn about 4 different sports',
        icon: '🌍',
        progress: 0,
        requirement: 4
      }
    ];
  }

  /**
   * Generate learning insights
   */
  static generateInsights(metrics: LearningMetrics): string[] {
    const insights: string[] = [];

    if (metrics.accuracy > 85) {
      insights.push('Excellent accuracy! Keep up the great work! 🌟');
    } else if (metrics.accuracy < 60) {
      insights.push('Try focusing on understanding concepts before answering 📚');
    }

    if (metrics.streakDays >= 7) {
      insights.push(`Amazing ${metrics.streakDays}-day streak! Consistency is key! 🔥`);
    }

    if (metrics.topicsExplored.length >= 3) {
      insights.push('Great diversity in your learning! 🎨');
    }

    return insights;
  }

  /**
   * Calculate progress towards next achievement
   */
  static calculateAchievementProgress(
    achievementId: string,
    metrics: LearningMetrics
  ): number {
    switch (achievementId) {
      case 'quiz_master':
        return Math.min((metrics.totalQuizzesCompleted / 100) * 100, 100);
      case 'week_streak':
        return Math.min((metrics.streakDays / 7) * 100, 100);
      case 'sports_explorer':
        return Math.min((metrics.topicsExplored.length / 4) * 100, 100);
      default:
        return 0;
    }
  }
}

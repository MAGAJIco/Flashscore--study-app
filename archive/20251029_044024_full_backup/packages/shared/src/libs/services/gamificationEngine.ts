
/**
 * Advanced Gamification Engine
 * Power-ups, quests, seasons, and progression systems
 */

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  type: 'boost' | 'shield' | 'multiplier' | 'insight';
  effect: {
    duration: number; // minutes
    value: number;
  };
  cost: number; // Pi Coins
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cooldown: number; // minutes
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'achievement';
  objectives: Array<{
    id: string;
    description: string;
    target: number;
    current: number;
    completed: boolean;
  }>;
  rewards: {
    piCoins: number;
    experience: number;
    items?: PowerUp[];
    badges?: string[];
  };
  expiresAt?: Date;
  completed: boolean;
}

export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  theme: string;
  tiers: Array<{
    level: number;
    requiredXP: number;
    rewards: string[];
  }>;
  leaderboard: Array<{
    userId: string;
    username: string;
    points: number;
    rank: number;
  }>;
}

export interface PlayerProgress {
  userId: string;
  level: number;
  experience: number;
  nextLevelXP: number;
  activePowerUps: Array<{
    powerUp: PowerUp;
    activatedAt: Date;
    expiresAt: Date;
  }>;
  completedQuests: string[];
  seasonProgress: {
    seasonId: string;
    currentTier: number;
    points: number;
  };
}

class GamificationEngine {
  private readonly POWER_UPS: PowerUp[] = [
    {
      id: 'confidence_boost',
      name: '🚀 Confidence Boost',
      description: 'Increase prediction confidence by 10% for 1 hour',
      type: 'boost',
      effect: { duration: 60, value: 10 },
      cost: 50,
      rarity: 'common',
      cooldown: 120
    },
    {
      id: 'shield_protection',
      name: '🛡️ Shield Protection',
      description: 'Protect your streak from one incorrect prediction',
      type: 'shield',
      effect: { duration: 1440, value: 1 },
      cost: 100,
      rarity: 'rare',
      cooldown: 480
    },
    {
      id: 'pi_multiplier',
      name: '💎 Pi Multiplier',
      description: 'Double Pi Coin rewards for 30 minutes',
      type: 'multiplier',
      effect: { duration: 30, value: 2 },
      cost: 150,
      rarity: 'epic',
      cooldown: 360
    },
    {
      id: 'ai_insight',
      name: '🧠 AI Insight',
      description: 'Reveal advanced ML analysis for next 3 matches',
      type: 'insight',
      effect: { duration: 180, value: 3 },
      cost: 200,
      rarity: 'legendary',
      cooldown: 720
    }
  ];

  // Generate daily quests
  generateDailyQuests(userId: string): Quest[] {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return [
      {
        id: `daily_predictions_${Date.now()}`,
        title: '📊 Daily Predictor',
        description: 'Make 5 predictions today',
        type: 'daily',
        objectives: [
          {
            id: 'obj_1',
            description: 'Make predictions',
            target: 5,
            current: 0,
            completed: false
          }
        ],
        rewards: {
          piCoins: 25,
          experience: 50
        },
        expiresAt: today,
        completed: false
      },
      {
        id: `daily_accuracy_${Date.now()}`,
        title: '🎯 Accuracy Master',
        description: 'Achieve 80% accuracy today',
        type: 'daily',
        objectives: [
          {
            id: 'obj_1',
            description: 'Reach 80% accuracy',
            target: 80,
            current: 0,
            completed: false
          }
        ],
        rewards: {
          piCoins: 50,
          experience: 100
        },
        expiresAt: today,
        completed: false
      },
      {
        id: `daily_social_${Date.now()}`,
        title: '👥 Social Butterfly',
        description: 'Join or create 2 challenges',
        type: 'daily',
        objectives: [
          {
            id: 'obj_1',
            description: 'Participate in challenges',
            target: 2,
            current: 0,
            completed: false
          }
        ],
        rewards: {
          piCoins: 30,
          experience: 75
        },
        expiresAt: today,
        completed: false
      }
    ];
  }

  // Generate weekly challenges
  generateWeeklyQuests(): Quest[] {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: `weekly_streak_${Date.now()}`,
        title: '🔥 Week Warrior',
        description: 'Maintain a 7-day prediction streak',
        type: 'weekly',
        objectives: [
          {
            id: 'obj_1',
            description: 'Daily predictions for 7 days',
            target: 7,
            current: 0,
            completed: false
          }
        ],
        rewards: {
          piCoins: 200,
          experience: 500,
          badges: ['week_warrior']
        },
        expiresAt: nextWeek,
        completed: false
      }
    ];
  }

  // Activate power-up
  activatePowerUp(userId: string, powerUpId: string): { success: boolean; message: string } {
    const powerUp = this.POWER_UPS.find(p => p.id === powerUpId);
    if (!powerUp) {
      return { success: false, message: 'Power-up not found' };
    }

    // Check cooldown
    const lastUsed = this.getLastPowerUpUse(userId, powerUpId);
    if (lastUsed) {
      const cooldownEnd = new Date(lastUsed.getTime() + powerUp.cooldown * 60 * 1000);
      if (Date.now() < cooldownEnd.getTime()) {
        const remaining = Math.ceil((cooldownEnd.getTime() - Date.now()) / (60 * 1000));
        return { success: false, message: `Cooldown active. ${remaining} minutes remaining.` };
      }
    }

    // Activate
    this.storePowerUpActivation(userId, powerUp);
    return { success: true, message: `${powerUp.name} activated!` };
  }

  // Calculate XP for level up
  calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Award XP and check for level up
  awardExperience(userId: string, xp: number): { leveledUp: boolean; newLevel?: number } {
    const progress = this.getPlayerProgress(userId);
    progress.experience += xp;

    let leveledUp = false;
    while (progress.experience >= progress.nextLevelXP) {
      progress.experience -= progress.nextLevelXP;
      progress.level++;
      progress.nextLevelXP = this.calculateXPForLevel(progress.level + 1);
      leveledUp = true;
    }

    this.savePlayerProgress(userId, progress);
    return { leveledUp, newLevel: leveledUp ? progress.level : undefined };
  }

  // Create seasonal competition
  createSeason(name: string, theme: string, durationDays: number): Season {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    return {
      id: `season_${Date.now()}`,
      name,
      startDate,
      endDate,
      theme,
      tiers: this.generateSeasonTiers(),
      leaderboard: []
    };
  }

  private generateSeasonTiers() {
    return Array.from({ length: 10 }, (_, i) => ({
      level: i + 1,
      requiredXP: (i + 1) * 1000,
      rewards: [`Tier ${i + 1} Badge`, `${(i + 1) * 50} Pi Coins`]
    }));
  }

  private getPlayerProgress(userId: string): PlayerProgress {
    if (typeof localStorage === 'undefined') {
      return this.createDefaultProgress(userId);
    }

    const stored = localStorage.getItem(`player_progress_${userId}`);
    return stored ? JSON.parse(stored) : this.createDefaultProgress(userId);
  }

  private createDefaultProgress(userId: string): PlayerProgress {
    return {
      userId,
      level: 1,
      experience: 0,
      nextLevelXP: this.calculateXPForLevel(2),
      activePowerUps: [],
      completedQuests: [],
      seasonProgress: {
        seasonId: 'current',
        currentTier: 1,
        points: 0
      }
    };
  }

  private savePlayerProgress(userId: string, progress: PlayerProgress): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`player_progress_${userId}`, JSON.stringify(progress));
    }
  }

  private getLastPowerUpUse(userId: string, powerUpId: string): Date | null {
    if (typeof localStorage === 'undefined') return null;
    const key = `powerup_${userId}_${powerUpId}`;
    const stored = localStorage.getItem(key);
    return stored ? new Date(stored) : null;
  }

  private storePowerUpActivation(userId: string, powerUp: PowerUp): void {
    if (typeof localStorage !== 'undefined') {
      const key = `powerup_${userId}_${powerUp.id}`;
      localStorage.setItem(key, new Date().toISOString());
    }
  }

  getPowerUps(): PowerUp[] {
    return this.POWER_UPS;
  }
}

export const gamificationEngineInstance = new GamificationEngine();

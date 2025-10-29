const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

export interface UserPrediction {
  id: string;
  userId: string;
  matchId: string;
  prediction: string;
  confidence: number;
  result?: 'win' | 'loss' | 'pending';
  timestamp: Date;
}

export interface GrowthScore {
  userId: string;
  totalPredictions: number;
  correctPredictions: number;
  winRate: number;
  growthLevel: number;
  empireRank: string;
  streak: number;
}

export interface EmpireLevel {
  level: number;
  name: string;
  minWinRate: number;
  minPredictions: number;
  powerMultiplier: number;
}

export const EMPIRE_LEVELS: EmpireLevel[] = [
  { level: 1, name: 'Foundation Builder', minWinRate: 0, minPredictions: 0, powerMultiplier: 1.0 },
  { level: 2, name: 'Rising Analyst', minWinRate: 0.5, minPredictions: 10, powerMultiplier: 1.2 },
  { level: 3, name: 'Expert Predictor', minWinRate: 0.6, minPredictions: 25, powerMultiplier: 1.5 },
  { level: 4, name: 'Master Strategist', minWinRate: 0.7, minPredictions: 50, powerMultiplier: 2.0 },
  { level: 5, name: 'Empire Legend', minWinRate: 0.75, minPredictions: 100, powerMultiplier: 3.0 },
  { level: 6, name: 'Legendary Rooftop', minWinRate: 0.8, minPredictions: 200, powerMultiplier: 5.0 },
];

export const sportsIntegration = {
  async fetchUserPredictions(userId: string): Promise<UserPrediction[]> {
    try {
      const response = await fetch(`${API_URL}/api/predictions/user/${userId}`);
      if (!response.ok) {
        console.warn('Failed to fetch predictions, returning empty array');
        return [];
      }
      const data = await response.json() as { predictions?: UserPrediction[] };
      return data.predictions || [];
    } catch (error) {
      console.error('Error fetching user predictions:', error);
      return [];
    }
  },

  calculateGrowthScore(predictions: UserPrediction[]): GrowthScore {
    const totalPredictions = predictions.length;
    const correctPredictions = predictions.filter(p => p.result === 'win').length;
    const winRate = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;

    let streak = 0;
    for (let i = predictions.length - 1; i >= 0; i--) {
      if (predictions[i].result === 'win') {
        streak++;
      } else if (predictions[i].result === 'loss') {
        break;
      }
    }

    const empireLevel = this.getEmpireLevel(winRate, totalPredictions);

    return {
      userId: predictions[0]?.userId || '',
      totalPredictions,
      correctPredictions,
      winRate,
      growthLevel: empireLevel.level,
      empireRank: empireLevel.name,
      streak,
    };
  },

  getEmpireLevel(winRate: number, totalPredictions: number): EmpireLevel {
    for (let i = EMPIRE_LEVELS.length - 1; i >= 0; i--) {
      const level = EMPIRE_LEVELS[i];
      if (winRate >= level.minWinRate && totalPredictions >= level.minPredictions) {
        return level;
      }
    }
    return EMPIRE_LEVELS[0];
  },

  async getUserGrowthScore(userId: string): Promise<GrowthScore> {
    const predictions = await this.fetchUserPredictions(userId);
    return this.calculateGrowthScore(predictions);
  },

  calculatePowerBonus(growthScore: GrowthScore): number {
    const empireLevel = EMPIRE_LEVELS.find(l => l.level === growthScore.growthLevel);
    const basePower = growthScore.correctPredictions * 10;
    const streakBonus = growthScore.streak * 5;
    const multiplier = empireLevel?.powerMultiplier || 1.0;
    
    return Math.floor((basePower + streakBonus) * multiplier);
  },
};

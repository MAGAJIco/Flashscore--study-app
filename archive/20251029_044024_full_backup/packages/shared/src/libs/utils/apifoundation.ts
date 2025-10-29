export interface Phase {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  building?: boolean;
  requiredPower: number;
  rewards?: {
    piCoins?: number;
    experience?: number;
    items?: string[];
  };
}

export interface FoundationUser {
  userId: string;
  power: number;
  level: number;
  completedPhases: number[];
  currentPhase?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  power: number;
  level: number;
  completedPhases: number;
}

class FoundationAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/foundation') {
    this.baseUrl = baseUrl;
  }

  async getUserProgress(userId: string): Promise<FoundationUser> {
    const response = await fetch(`${this.baseUrl}/progress/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user progress');
    return response.json();
  }

  async getPhases(): Promise<Phase[]> {
    const response = await fetch(`${this.baseUrl}/phases`);
    if (!response.ok) throw new Error('Failed to fetch phases');
    return response.json();
  }

  async completePhase(userId: string, phaseId: number): Promise<FoundationUser> {
    const response = await fetch(`${this.baseUrl}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, phaseId })
    });
    if (!response.ok) throw new Error('Failed to complete phase');
    return response.json();
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/leaderboard?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  }

  async addPower(userId: string, power: number): Promise<FoundationUser> {
    const response = await fetch(`${this.baseUrl}/power`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, power })
    });
    if (!response.ok) throw new Error('Failed to add power');
    return response.json();
  }
}

export const foundationApi = new FoundationAPI();
export type { FoundationAPI };
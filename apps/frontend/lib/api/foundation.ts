const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Phase {
  id: string;
  name: string;
  description: string;
  requiredPower: number;
  powerBoost: number;
  category: string;
  unlocked?: boolean;
  completed?: boolean;
  building?: boolean;
  components: Array<{
    id: string;
    title: string;
    description: string;
    powerGain: number;
  }>;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalPower: number;
  completedPhases: number;
  totalPhases: number;
}

interface ProgressResponse {
  phases: Phase[];
  totalPower: number;
}

interface BuildingResponse {
  phases: Phase[];
  totalPower: number;
}

interface CompletePhaseResponse {
  data: {
    phases: Phase[];
    totalPower: number;
  };
  powerBoost: number;
}

export const foundationApi = {
  async getProgress(userId: string): Promise<ProgressResponse> {
    try {
      const response = await fetch(`${API_BASE}/foundation/progress/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${API_BASE}/foundation/leaderboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  async getUserProgress(userId: string) {
    try {
      const response = await fetch(`${API_BASE}/foundation/progress/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user progress');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  },

  async startBuilding(userId: string, phaseId: string): Promise<BuildingResponse> {
    try {
      const response = await fetch(`${API_BASE}/foundation/start-building`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, phaseId }),
      });
      if (!response.ok) {
        throw new Error('Failed to start building');
      }
      return await response.json();
    } catch (error) {
      console.error('Error starting building:', error);
      throw error;
    }
  },

  async completePhase(userId: string, phaseId: string): Promise<CompletePhaseResponse> {
    try {
      const response = await fetch(`${API_BASE}/foundation/complete-phase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, phaseId }),
      });
      if (!response.ok) {
        throw new Error('Failed to complete phase');
      }
      return await response.json();
    } catch (error) {
      console.error('Error completing phase:', error);
      throw error;
    }
  },
};

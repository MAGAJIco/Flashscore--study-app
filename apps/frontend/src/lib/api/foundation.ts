
export interface Component {
  id: string;
  name: string;
  installed: boolean;
  powerBoost: number;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  requiredPower: number;
  unlocked: boolean;
  building: boolean;
  completed: boolean;
  components: Component[];
}

export interface FoundationData {
  userId: string;
  totalPower: number;
  phases: Phase[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

export const foundationApi = {
  async getProgress(userId: string): Promise<FoundationData> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foundation/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch foundation progress');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching foundation progress:', error);
      throw error;
    }
  },

  async startBuilding(userId: string, phaseId: string): Promise<FoundationData> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foundation/${userId}/start-building`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId })
      });
      if (!response.ok) throw new Error('Failed to start building');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error starting building:', error);
      throw error;
    }
  },

  async completePhase(userId: string, phaseId: string): Promise<{ data: FoundationData; powerBoost: number }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foundation/${userId}/complete-phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId })
      });
      if (!response.ok) throw new Error('Failed to complete phase');
      const result = await response.json();
      return { data: result.data, powerBoost: result.powerBoost };
    } catch (error) {
      console.error('Error completing phase:', error);
      throw error;
    }
  },

  async reset(userId: string): Promise<FoundationData> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foundation/${userId}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to reset foundation');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error resetting foundation:', error);
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foundation/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  async submitContribution(data: any) {
    try {
      const response = await fetch('/api/empire/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit contribution');
      return await response.json();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      throw error;
    }
  }
};
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalPower: number;
  completedPhases: number;
  totalPhases: number;
}

export const foundationApi = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
      const response = await fetch(`${backendUrl}/foundation/leaderboard`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  async submitContribution(data: any) {
    try {
      const response = await fetch('/api/empire/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit contribution');
      return await response.json();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      throw error;
    }
  }
};

export interface Phase {
  id: number;
  name: string;
  description: string;
  requiredPower: number;
  unlocked: boolean;
  building: boolean;
  completed: boolean;
  components: Array<{
    name: string;
    type: string;
    powerBoost: number;
    installed: boolean;
  }>;
}

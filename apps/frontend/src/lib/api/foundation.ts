
export interface Component {
  name: string;
  type: 'ai' | 'prediction' | 'community' | 'crypto' | 'security';
  powerBoost: number;
  installed: boolean;
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

export interface FoundationProgress {
  userId: string;
  totalPower: number;
  phases: Phase[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const foundationApi = {
  async getProgress(userId: string): Promise<FoundationProgress> {
    try {
      const response = await fetch(`${API_BASE}/api/foundation/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching foundation progress:', error);
      throw error;
    }
  },

  async startBuilding(userId: string, phaseId: string): Promise<FoundationProgress> {
    try {
      const response = await fetch(`${API_BASE}/api/foundation/${userId}/start-building`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId })
      });
      if (!response.ok) throw new Error('Failed to start building');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error starting build:', error);
      throw error;
    }
  },

  async completePhase(userId: string, phaseId: string): Promise<{ data: FoundationProgress; powerBoost: number }> {
    try {
      const response = await fetch(`${API_BASE}/api/foundation/${userId}/complete-phase`, {
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

  async reset(userId: string): Promise<FoundationProgress> {
    try {
      const response = await fetch(`${API_BASE}/api/foundation/${userId}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to reset');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error resetting foundation:', error);
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE}/api/foundation/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const result = await response.json();
      return result.data || [];
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

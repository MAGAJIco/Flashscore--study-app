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
  requiredPower?: number;
  unlocked?: boolean;
  building?: boolean;
  completed?: boolean;
  components?: Component[];
  status?: 'locked' | 'active' | 'completed';
  progress?: number;
}

export interface FoundationData {
  userId: string;
  totalPower: number;
  phases: Phase[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username?: string;
  totalPower?: number;
  power?: number;
  completedPhases?: number;
  totalPhases?: number;
  contributions?: number;
}

import { sharedAPIClient } from '@magajico/shared';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

export const foundationApi = {
  async getProgress(userId: string): Promise<FoundationData> {
    try {
      const result = await sharedAPIClient.get<{ data: FoundationData }>(`/api/foundation/${userId}`);
      return result.data;
    } catch (error) {
      console.error('Error fetching foundation progress:', error);
      throw error;
    }
  },

  async getPhases(): Promise<Phase[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backend/foundation/phases`);
      if (!response.ok) throw new Error('Failed to fetch phases');
      return await response.json();
    } catch (error) {
      console.error('Error fetching phases:', error);
      return [];
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

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foundation/leaderboard`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : (Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  async submitContribution(data: any) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/empire/leaderboard`, {
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
  },

  async contributeToPower(userId: string, amount: number): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backend/foundation/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (!response.ok) throw new Error('Failed to contribute');
    } catch (error) {
      console.error('Error contributing:', error);
      throw error;
    }
  }
};
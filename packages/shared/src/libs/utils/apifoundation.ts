const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Retry logic for failed requests
async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error('Max retries reached');
}

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

export interface FoundationData {
  _id?: string;
  userId: string;
  totalPower: number;
  phases: Phase[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  powerBoost?: number;
}

export const foundationApi = {
  // Get user's foundation progress
  async getProgress(userId: string): Promise<FoundationData> {
    const response = await fetchWithRetry(`${API_URL}/api/foundation/${userId}`);
    const result = await response.json() as ApiResponse<FoundationData>;
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch foundation progress');
    }
    
    return result.data;
  },

  // Start building a phase
  async startBuilding(userId: string, phaseId: string): Promise<FoundationData> {
    const response = await fetchWithRetry(`${API_URL}/api/foundation/${userId}/start-building`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phaseId }),
    });
    
    const result = await response.json() as ApiResponse<FoundationData>;
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to start building phase');
    }
    
    return result.data;
  },

  // Complete a phase
  async completePhase(userId: string, phaseId: string): Promise<{ data: FoundationData; powerBoost: number }> {
    const response = await fetchWithRetry(`${API_URL}/api/foundation/${userId}/complete-phase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phaseId }),
    });
    
    const result = await response.json() as ApiResponse<FoundationData>;
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to complete phase');
    }
    
    return { 
      data: result.data, 
      powerBoost: result.powerBoost || 0 
    };
  },

  // Reset foundation progress
  async reset(userId: string): Promise<FoundationData> {
    const response = await fetch(`${API_URL}/api/foundation/${userId}/reset`, {
      method: 'POST',
    });
    
    const result = await response.json() as ApiResponse<FoundationData>;
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to reset foundation');
    }
    
    return result.data;
  },

  // Get leaderboard
  async getLeaderboard(): Promise<Array<{
    rank: number;
    userId: string;
    totalPower: number;
    completedPhases: number;
    totalPhases: number;
  }>> {
    const response = await fetch(`${API_URL}/api/foundation/leaderboard`);
    const result = await response.json() as ApiResponse<any[]>;
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch leaderboard');
    }
    
    return result.data;
  },
};

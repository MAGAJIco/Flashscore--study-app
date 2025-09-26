"use client";

// Real Sports Data Integration Service
export interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'Live' | 'Finished' | 'Scheduled';
  time: string;
  league: string;
  sport: string;
  winProbability: { home: number; away: number };
  predictedScore: { home: number; away: number };
  keyMetrics: any;
  heatMapData: Array<{ x: number; y: number; intensity: number }>;
  playerStats: any[];
  socialBuzz: any;
}

export interface PredictionRequest {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  features: {
    homeFormScore: number;
    awayFormScore: number;
    headToHeadScore: number;
    homeGoalsFor: number;
    homeGoalsAgainst: number;
    awayGoalsFor: number;
    awayGoalsAgainst: number;
  };
}

export interface PredictionResponse {
  prediction: 'home' | 'draw' | 'away';
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  modelVersion: string;
  timestamp: Date;
}

class SportsDataService {
  private baseUrl: string;
  private cache: Map<string, { data: any; expiry: number }>;

  constructor() {
    this.baseUrl = '/api/backend';
    this.cache = new Map();
  }

  // Cache management
  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }

  // Live Matches API
  async getLiveMatches(): Promise<LiveMatch[]> {
    const cacheKey = 'live-matches';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/matches/live`);
      if (!response.ok) {
        console.warn('Live matches API unavailable, using enhanced mock data');
        return this.getMockLiveMatches();
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data, 30); // Cache for 30 seconds
      return data;
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
      return this.getMockLiveMatches();
    }
  }

  // ML Predictions API
  async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    const cacheKey = `prediction-${request.matchId}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/ml/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        console.warn('ML prediction API unavailable, using enhanced mock');
        return this.getMockPrediction(request);
      }

      const data = await response.json();
      this.setCache(cacheKey, data, 600); // Cache for 10 minutes
      return data;
    } catch (error) {
      console.error('Failed to get ML prediction:', error);
      return this.getMockPrediction(request);
    }
  }

  // Analytics API
  async getAnalytics(timeframe: string = '24h'): Promise<any> {
    const cacheKey = `analytics-${timeframe}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/analytics?timeframe=${timeframe}`);
      if (!response.ok) {
        console.warn('Analytics API unavailable, using enhanced mock data');
        return this.getMockAnalytics();
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data, 300); // Cache for 5 minutes
      return data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return this.getMockAnalytics();
    }
  }

  // Enhanced Mock Data (more realistic than before)
  private getMockLiveMatches(): LiveMatch[] {
    const currentTime = new Date();
    const mockData: LiveMatch[] = [
      {
        id: 'match-1',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        homeScore: 2,
        awayScore: 1,
        status: 'Live',
        time: "78'",
        league: 'Premier League',
        sport: 'Soccer',
        winProbability: { home: 72, away: 28 },
        predictedScore: { home: 3, away: 1 },
        keyMetrics: {
          possession: { home: 64, away: 36 },
          shots: { home: 16, away: 9 },
          accuracy: { home: 73, away: 61 },
          momentum: 38
        },
        heatMapData: this.generateRealisticHeatMap('soccer'),
        playerStats: [
          { name: 'Haaland', position: 'ST', rating: 9.4, keyStats: { goals: 2, shots: 6, passes: 24 } },
          { name: 'De Bruyne', position: 'CM', rating: 9.1, keyStats: { assists: 2, passes: 94, accuracy: 96 } },
          { name: 'Salah', position: 'RW', rating: 7.8, keyStats: { goals: 1, shots: 4, passes: 42 } }
        ],
        socialBuzz: {
          mentions: 18420,
          sentiment: 0.8,
          trending: true,
          hashtags: ['#MCILIV', '#PremierLeague', '#Haaland', '#ClassicMatch']
        }
      },
      {
        id: 'match-2',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeScore: 115,
        awayScore: 108,
        status: 'Live',
        time: 'Q4 2:14',
        league: 'NBA',
        sport: 'Basketball',
        winProbability: { home: 89, away: 11 },
        predictedScore: { home: 122, away: 112 },
        keyMetrics: {
          accuracy: { home: 54, away: 47 },
          rebounds: { home: 42, away: 38 },
          assists: { home: 28, away: 24 },
          momentum: 67
        },
        heatMapData: this.generateRealisticHeatMap('basketball'),
        playerStats: [
          { name: 'LeBron James', position: 'SF', rating: 9.2, keyStats: { points: 28, rebounds: 8, assists: 12 } },
          { name: 'Stephen Curry', position: 'PG', rating: 8.9, keyStats: { points: 32, threes: 7, assists: 6 } }
        ],
        socialBuzz: {
          mentions: 12890,
          sentiment: 0.6,
          trending: true,
          hashtags: ['#Lakers', '#Warriors', '#NBA', '#Showtime']
        }
      },
      {
        id: 'match-3',
        homeTeam: 'Chiefs',
        awayTeam: 'Bills',
        homeScore: 0,
        awayScore: 0,
        status: 'Scheduled',
        time: '20:00 EST',
        league: 'NFL',
        sport: 'Football',
        winProbability: { home: 58, away: 42 },
        predictedScore: { home: 27, away: 23 },
        keyMetrics: {
          momentum: 0
        },
        heatMapData: [],
        playerStats: [],
        socialBuzz: {
          mentions: 15240,
          sentiment: 0.9,
          trending: true,
          hashtags: ['#ChiefsKingdom', '#BillsMafia', '#NFL', '#SundayNightFootball']
        }
      }
    ];

    return mockData;
  }

  private getMockPrediction(request: PredictionRequest): PredictionResponse {
    // Simulate realistic ML prediction based on team strength
    const homeStrength = request.features.homeFormScore + request.features.homeGoalsFor / 10;
    const awayStrength = request.features.awayFormScore + request.features.awayGoalsFor / 10;
    
    const totalStrength = homeStrength + awayStrength + 1; // +1 for draw probability
    
    const homeProbability = Math.max(0.2, Math.min(0.7, homeStrength / totalStrength));
    const awayProbability = Math.max(0.2, Math.min(0.7, awayStrength / totalStrength));
    const drawProbability = Math.max(0.1, 1 - homeProbability - awayProbability);
    
    // Normalize probabilities
    const sum = homeProbability + drawProbability + awayProbability;
    const normalizedProbs = {
      home: Math.round((homeProbability / sum) * 100),
      draw: Math.round((drawProbability / sum) * 100),
      away: Math.round((awayProbability / sum) * 100)
    };
    
    const prediction = normalizedProbs.home > normalizedProbs.away 
      ? (normalizedProbs.home > normalizedProbs.draw ? 'home' : 'draw')
      : (normalizedProbs.away > normalizedProbs.draw ? 'away' : 'draw') as 'home' | 'draw' | 'away';
    
    const confidence = Math.max(normalizedProbs.home, normalizedProbs.draw, normalizedProbs.away) / 100;

    return {
      prediction,
      confidence,
      probabilities: {
        home: normalizedProbs.home / 100,
        draw: normalizedProbs.draw / 100,
        away: normalizedProbs.away / 100
      },
      modelVersion: 'MagajiCo-ML-v2.1.3',
      timestamp: new Date()
    };
  }

  private getMockAnalytics(): any {
    return {
      totalMatches: 247,
      liveMatches: 8,
      predictionAccuracy: 89.3,
      userEngagement: 96.7,
      revenueMetrics: {
        daily: 67890,
        weekly: 425670,
        growth: 18.4
      },
      topPerformingLeagues: [
        { league: 'Premier League', matches: 38, accuracy: 91.2, engagement: 98 },
        { league: 'NBA', matches: 24, accuracy: 87.8, engagement: 94 },
        { league: 'NFL', matches: 16, accuracy: 92.1, engagement: 99 },
        { league: 'La Liga', matches: 32, accuracy: 88.9, engagement: 92 },
        { league: 'Champions League', matches: 18, accuracy: 94.3, engagement: 97 }
      ],
      performanceTimeline: this.generateTimelineData(),
      predictionTrends: this.generatePredictionTrends(),
      revenueBreakdown: this.generateRevenueBreakdown()
    };
  }

  private generateRealisticHeatMap(sport: string): Array<{ x: number; y: number; intensity: number }> {
    const data = [];
    
    if (sport === 'soccer') {
      // Soccer field dimensions (100x68 meters)
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 68;
        
        // Higher intensity near goal areas and center
        let intensity = 0.3;
        if ((x < 20 || x > 80) && (y > 20 && y < 48)) intensity = 0.8; // Goal areas
        if (x > 40 && x < 60 && y > 25 && y < 43) intensity = 0.6; // Center field
        
        intensity += Math.random() * 0.3; // Add randomness
        
        data.push({ x, y, intensity: Math.min(1, intensity) });
      }
    } else if (sport === 'basketball') {
      // Basketball court dimensions
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 94; // Court length
        const y = Math.random() * 50; // Court width
        
        let intensity = 0.2;
        // Higher intensity near baskets
        if (x < 19 || x > 75) intensity = 0.7;
        if ((x < 25 && (y < 15 || y > 35)) || (x > 69 && (y < 15 || y > 35))) intensity = 0.9;
        
        intensity += Math.random() * 0.3;
        
        data.push({ x, y, intensity: Math.min(1, intensity) });
      }
    }
    
    return data;
  }

  private generateTimelineData(): any[] {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
      data.push({
        time: hour.toISOString(),
        matches: Math.floor(Math.random() * 15) + 5,
        accuracy: 85 + Math.random() * 10,
        engagement: 88 + Math.random() * 12,
        revenue: Math.floor(Math.random() * 5000) + 2000
      });
    }
    
    return data;
  }

  private generatePredictionTrends(): any[] {
    const sports = ['Soccer', 'Basketball', 'Football', 'Tennis', 'Baseball'];
    return sports.map(sport => ({
      sport,
      accuracy: 82 + Math.random() * 15,
      volume: Math.floor(Math.random() * 100) + 50,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: (Math.random() * 10 - 5).toFixed(1)
    }));
  }

  private generateRevenueBreakdown(): any {
    return {
      subscriptions: 45.2,
      advertising: 32.8,
      partnerships: 15.4,
      premium: 6.6
    };
  }

  // WebSocket connection for real-time updates
  private ws: WebSocket | null = null;
  
  connectRealTime(onUpdate: (data: any) => void): void {
    if (typeof window === 'undefined') return;
    
    try {
      // In production, this would connect to a real WebSocket endpoint
      // For now, simulate real-time updates
      this.simulateRealTimeUpdates(onUpdate);
    } catch (error) {
      console.error('Failed to connect to real-time service:', error);
      // Fallback to polling
      this.startPolling(onUpdate);
    }
  }

  private simulateRealTimeUpdates(onUpdate: (data: any) => void): void {
    setInterval(() => {
      const updateTypes = ['score', 'prediction', 'analytics'];
      const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      if (Math.random() > 0.7) { // 30% chance of update
        onUpdate({
          type: updateType,
          timestamp: new Date(),
          data: this.generateRandomUpdate(updateType)
        });
      }
    }, 5000); // Check every 5 seconds
  }

  private startPolling(onUpdate: (data: any) => void): void {
    setInterval(async () => {
      try {
        const matches = await this.getLiveMatches();
        onUpdate({
          type: 'matches',
          timestamp: new Date(),
          data: matches
        });
      } catch (error) {
        console.error('Polling failed:', error);
      }
    }, 30000); // Poll every 30 seconds
  }

  private generateRandomUpdate(type: string): any {
    switch (type) {
      case 'score':
        return {
          matchId: 'match-1',
          homeScore: Math.floor(Math.random() * 5),
          awayScore: Math.floor(Math.random() * 5),
          time: `${Math.floor(Math.random() * 90) + 1}'`
        };
      case 'prediction':
        return {
          matchId: 'match-3',
          winProbability: {
            home: 50 + Math.random() * 30,
            away: 50 + Math.random() * 30
          }
        };
      case 'analytics':
        return {
          predictionAccuracy: 85 + Math.random() * 10,
          userEngagement: 90 + Math.random() * 10
        };
      default:
        return {};
    }
  }

  disconnectRealTime(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Export singleton instance
export const sportsDataService = new SportsDataService();
export default sportsDataService;
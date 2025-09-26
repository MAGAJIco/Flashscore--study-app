
interface RealTimeData {
  matches: any[];
  markets: any;
  analytics: any;
  timestamp: number;
}

interface DataSource {
  name: string;
  url: string;
  priority: number;
  isActive: boolean;
}

class EnhancedSportsDataService {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private wsConnection: WebSocket | null = null;
  private subscribers: Map<string, Function[]> = new Map();
  private retryCount = 0;
  private maxRetries = 3;

  private dataSources: DataSource[] = [
    { name: 'primary', url: '/api/sports-proxy', priority: 1, isActive: true },
    { name: 'backup', url: '/api/fallback-sports', priority: 2, isActive: true },
    { name: 'cache', url: 'local-cache', priority: 3, isActive: true }
  ];

  constructor() {
    this.initializeWebSocket();
    this.startDataRefresh();
  }

  private initializeWebSocket() {
    try {
      // In production, this would connect to a real WebSocket endpoint
      console.log('WebSocket connection initialized (mock for development)');
      this.simulateWebSocketData();
    } catch (error) {
      console.log('WebSocket not available, using polling fallback');
    }
  }

  private simulateWebSocketData() {
    // Simulate real-time updates every 5 seconds
    setInterval(() => {
      const mockUpdate = {
        type: 'match_update',
        data: {
          matchId: '1',
          score: { home: Math.floor(Math.random() * 4), away: Math.floor(Math.random() * 4) },
          time: `${Math.floor(Math.random() * 90)}'`,
          momentum: Math.floor(Math.random() * 200) - 100
        }
      };
      this.notifySubscribers('match_updates', mockUpdate);
    }, 5000);
  }

  async getLiveMatches(): Promise<any[]> {
    const cacheKey = 'live_matches';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Try primary data source
      const response = await this.fetchWithTimeout('/api/sports-proxy/live-matches', 3000);
      if (response.ok) {
        const data = await response.json();
        this.setCache(cacheKey, data.matches, 30000); // 30s cache
        return data.matches;
      }
    } catch (error) {
      console.log('Primary source failed, using fallback data');
    }

    // Return enhanced mock data
    return this.getEnhancedMockMatches();
  }

  async getMarketData(): Promise<any> {
    const cacheKey = 'market_data';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.fetchWithTimeout('/api/sports-proxy/markets', 3000);
      if (response.ok) {
        const data = await response.json();
        this.setCache(cacheKey, data, 60000); // 1min cache
        return data;
      }
    } catch (error) {
      console.log('Market data API unavailable, using mock data');
    }

    return this.getEnhancedMockMarketData();
  }

  async getCEOAnalytics(): Promise<any> {
    try {
      const response = await this.fetchWithTimeout('/api/analytics/ceo-dashboard', 5000);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Analytics API unavailable, using mock data');
    }

    return this.getEnhancedMockAnalytics();
  }

  subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  unsubscribe(event: string, callback: Function) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifySubscribers(event: string, data: any) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '2.0'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  private startDataRefresh() {
    // Refresh critical data every 30 seconds
    setInterval(async () => {
      await this.getLiveMatches();
      await this.getMarketData();
    }, 30000);
  }

  private getEnhancedMockMatches() {
    return [
      {
        id: '1',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        score: { home: 2, away: 1 },
        time: `${Math.floor(Math.random() * 90)}'`,
        status: 'live',
        league: 'Premier League',
        probability: { 
          home: 45 + Math.random() * 10, 
          draw: 25 + Math.random() * 10, 
          away: 30 + Math.random() * 10 
        },
        xG: { home: 1.8 + Math.random() * 0.5, away: 1.2 + Math.random() * 0.5 },
        possession: { home: 58 + Math.random() * 10, away: 42 + Math.random() * 10 },
        shots: { home: 12 + Math.floor(Math.random() * 5), away: 8 + Math.floor(Math.random() * 5) },
        corners: { home: 6, away: 3 },
        cards: { home: { yellow: 2, red: 0 }, away: { yellow: 3, red: 1 } },
        momentum: Math.floor(Math.random() * 100) - 50,
        keyEvents: [
          { time: '23\'', type: 'goal', team: 'home', player: 'Saka', description: 'Right foot shot' },
          { time: '45\'', type: 'goal', team: 'away', player: 'Sterling', description: 'Left foot shot' },
          { time: '67\'', type: 'goal', team: 'home', player: 'Ødegaard', description: 'Header' }
        ]
      },
      {
        id: '2',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        score: { home: 1, away: 2 },
        time: `${Math.floor(Math.random() * 90)}'`,
        status: 'live',
        league: 'Premier League',
        probability: { 
          home: 38 + Math.random() * 10, 
          draw: 32 + Math.random() * 10, 
          away: 30 + Math.random() * 10 
        },
        xG: { home: 2.1 + Math.random() * 0.5, away: 1.9 + Math.random() * 0.5 },
        possession: { home: 62 + Math.random() * 10, away: 38 + Math.random() * 10 },
        shots: { home: 15 + Math.floor(Math.random() * 5), away: 11 + Math.floor(Math.random() * 5) },
        corners: { home: 8, away: 5 },
        cards: { home: { yellow: 1, red: 0 }, away: { yellow: 2, red: 0 } },
        momentum: Math.floor(Math.random() * 100) - 50,
        keyEvents: [
          { time: '15\'', type: 'goal', team: 'away', player: 'Salah', description: 'Clinical finish' },
          { time: '34\'', type: 'card', team: 'away', player: 'Van Dijk', description: 'Yellow card' },
          { time: '78\'', type: 'goal', team: 'home', player: 'Haaland', description: 'Powerful strike' }
        ]
      }
    ];
  }

  private getEnhancedMockMarketData() {
    return {
      '1': {
        odds: { 
          home: 2.2 + Math.random() * 0.2, 
          draw: 3.4 + Math.random() * 0.2, 
          away: 3.1 + Math.random() * 0.2 
        },
        volume: 2500000 + Math.random() * 1000000,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        sharpMoney: 65 + Math.random() * 20,
        publicMoney: 35 + Math.random() * 20,
        lineMovement: [
          { time: '10:00', odds: 2.4 },
          { time: '11:00', odds: 2.3 },
          { time: '12:00', odds: 2.2 + Math.random() * 0.1 }
        ]
      },
      '2': {
        odds: { 
          home: 2.8 + Math.random() * 0.2, 
          draw: 3.2 + Math.random() * 0.2, 
          away: 2.6 + Math.random() * 0.2 
        },
        volume: 3200000 + Math.random() * 1000000,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        sharpMoney: 72 + Math.random() * 15,
        publicMoney: 28 + Math.random() * 15,
        lineMovement: [
          { time: '10:00', odds: 2.9 },
          { time: '11:00', odds: 2.85 },
          { time: '12:00', odds: 2.8 + Math.random() * 0.1 }
        ]
      }
    };
  }

  private getEnhancedMockAnalytics() {
    return {
      totalRevenue: 12500000 + Math.random() * 1000000,
      activeUsers: 2850000 + Math.random() * 100000,
      predictionAccuracy: 76.8 + Math.random() * 2,
      marketShare: 23.5 + Math.random() * 1,
      customerSatisfaction: 4.7 + Math.random() * 0.2,
      growthRate: 28.3 + Math.random() * 5,
      riskExposure: 15.2 + Math.random() * 3,
      operationalEfficiency: 94.1 + Math.random() * 2,
      realTimeMetrics: {
        currentOnlineUsers: 45000 + Math.floor(Math.random() * 10000),
        activePredictions: 1250 + Math.floor(Math.random() * 500),
        totalBetsToday: 890000 + Math.floor(Math.random() * 100000),
        serverResponseTime: 120 + Math.random() * 50
      }
    };
  }

  // Cleanup method
  destroy() {
    if (this.wsConnection) {
      this.wsConnection.close();
    }
    this.cache.clear();
    this.subscribers.clear();
  }
}

export const enhancedSportsService = new EnhancedSportsDataService();
export default EnhancedSportsDataService;

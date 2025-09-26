
import { NextRequest, NextResponse } from 'next/server';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'Live' | 'Finished' | 'Scheduled';
  time: string;
  league: string;
  sport: 'Football' | 'Basketball' | 'Tennis' | 'Baseball' | 'Soccer';
}

interface MarketData {
  matchId: string;
  odds: { home: number; draw: number; away: number };
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

// Mock data generators for development
const generateMockMatches = (): Match[] => [
  {
    id: 1,
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'Live',
    time: "78'",
    league: 'Premier League',
    sport: 'Soccer'
  },
  {
    id: 2,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 1,
    awayScore: 1,
    status: 'Live',
    time: "65'",
    league: 'Premier League',
    sport: 'Soccer'
  }
];

const generateMockMarketData = (): Record<string, MarketData> => ({
  '1': {
    matchId: '1',
    odds: { home: 2.2, draw: 3.4, away: 3.1 },
    volume: 2500000,
    trend: 'up'
  },
  '2': {
    matchId: '2',
    odds: { home: 2.8, draw: 3.2, away: 2.6 },
    volume: 1800000,
    trend: 'stable'
  }
});

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path?.join('/') || '';
    
    // Handle different API endpoints
    switch (path) {
      case 'live-matches':
        return NextResponse.json({
          success: true,
          data: generateMockMatches()
        });
        
      case 'market-data':
        return NextResponse.json({
          success: true,
          data: generateMockMarketData()
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Endpoint not found'
        }, { status: 404 });
    }
  } catch (error) {
    console.error('Sports proxy error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

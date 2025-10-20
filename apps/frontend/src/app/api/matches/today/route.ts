
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/matches/upcoming?limit=20`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          matches: data.data || [],
          source: 'backend'
        });
      }
    } catch (backendError) {
      console.log('Backend unavailable for today matches, using demo data');
    }

    // Demo matches for today
    const demoMatches = [
      {
        id: 'today-1',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        competition: 'Premier League',
        date: new Date().toISOString(),
        status: 'scheduled',
        odds: [{ home: 2.1, draw: 3.2, away: 3.5, source: 'demo', timestamp: new Date() }]
      },
      {
        id: 'today-2',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        competition: 'La Liga',
        date: new Date().toISOString(),
        status: 'scheduled',
        odds: [{ home: 1.9, draw: 3.4, away: 4.0, source: 'demo', timestamp: new Date() }]
      },
      {
        id: 'today-3',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Dortmund',
        competition: 'Bundesliga',
        date: new Date().toISOString(),
        status: 'scheduled',
        odds: [{ home: 1.7, draw: 3.8, away: 4.5, source: 'demo', timestamp: new Date() }]
      }
    ];

    return NextResponse.json({
      success: true,
      matches: demoMatches,
      source: 'demo',
      message: 'Using demo matches. Start backend for live data.'
    });

  } catch (error) {
    console.error('Error fetching today matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch today matches', matches: [] },
      { status: 500 }
    );
  }
}

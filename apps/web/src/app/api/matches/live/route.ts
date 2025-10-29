
import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/matches/live`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching live matches:', error);
    
    // Fallback to mock data
    return NextResponse.json({
      success: true,
      data: [
        {
          id: '1',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          homeScore: 2,
          awayScore: 1,
          status: 'live',
          league: 'Premier League',
          time: '67\'',
          date: new Date().toISOString()
        }
      ],
      count: 1,
      isOffline: true
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    });
  }
}

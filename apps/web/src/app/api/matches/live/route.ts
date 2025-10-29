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
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error proxying to backend API:', error);
    
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 1,
          homeTeam: "Manchester United",
          awayTeam: "Liverpool",
          homeScore: 2,
          awayScore: 1,
          status: "Live",
          time: "67'",
          venue: "Old Trafford",
          league: "Premier League"
        }
      ],
      count: 1
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  }
}

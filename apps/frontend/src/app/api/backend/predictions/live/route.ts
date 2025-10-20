
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/predictions?limit=10`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          predictions: data.data || data.predictions || [],
          source: 'backend',
          live: true
        });
      }
    } catch (backendError) {
      console.log('Backend unavailable for live predictions, using demo data');
    }

    // Demo live predictions
    const livePredictions = [
      {
        id: 'live-1',
        matchId: 'live-match-1',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        predictedWinner: 'Arsenal',
        confidence: 78,
        odds: 2.3,
        status: 'upcoming',
        matchDate: new Date().toISOString(),
        source: 'demo',
        live: true,
        league: 'Premier League'
      },
      {
        id: 'live-2',
        matchId: 'live-match-2',
        homeTeam: 'PSG',
        awayTeam: 'Marseille',
        predictedWinner: 'PSG',
        confidence: 82,
        odds: 1.8,
        status: 'upcoming',
        matchDate: new Date().toISOString(),
        source: 'demo',
        live: true,
        league: 'Ligue 1'
      }
    ];

    return NextResponse.json({
      success: true,
      predictions: livePredictions,
      source: 'demo',
      live: true,
      message: 'Using demo live predictions. Start backend for real-time data.'
    });

  } catch (error) {
    console.error('Error fetching live predictions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live predictions', predictions: [] },
      { status: 500 }
    );
  }
}

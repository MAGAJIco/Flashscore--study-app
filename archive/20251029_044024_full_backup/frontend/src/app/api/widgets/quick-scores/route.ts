
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch live scores from backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001'}/api/matches/live`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch live scores');
    }

    const matches = await response.json();

    // Format for widget display
    const widgetData = {
      timestamp: new Date().toISOString(),
      matches: matches.slice(0, 3).map((match: any) => ({
        id: match.id,
        homeTeam: match.homeTeam?.name || 'TBD',
        awayTeam: match.awayTeam?.name || 'TBD',
        homeScore: match.homeTeam?.score || 0,
        awayScore: match.awayTeam?.score || 0,
        minute: match.minute || '0',
        status: match.status || 'scheduled'
      }))
    };

    return NextResponse.json(widgetData);
  } catch (error) {
    console.error('Widget API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget data' },
      { status: 500 }
    );
  }
}

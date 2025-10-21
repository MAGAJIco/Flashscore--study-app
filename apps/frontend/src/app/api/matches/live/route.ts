
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    
    const response = await fetch(`${BACKEND_URL}/api/matches/live`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch live matches', matches: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live matches', matches: [] },
      { status: 500 }
    );
  }
}

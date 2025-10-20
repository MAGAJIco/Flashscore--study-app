
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    
    const response = await fetch(`${BACKEND_URL}/api/matches/live`, {
      signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      // Return demo data if backend fails
      return NextResponse.json({
        success: true,
        matches: [],
        message: 'No live matches available'
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.warn('Live matches API error:', error);
    return NextResponse.json({
      success: true,
      matches: [],
      message: 'Backend unavailable, no live matches'
    });
  }
}

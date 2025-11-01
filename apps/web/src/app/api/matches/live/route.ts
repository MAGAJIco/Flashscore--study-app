
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
    
    // Return empty data instead of fallback - no static data
    return NextResponse.json({
      success: false,
      data: [],
      count: 0,
      error: 'Failed to fetch live matches from backend'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
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
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error proxying to backend API:', error);
    
    return NextResponse.json({
      success: true,
      data: [],
      count: 0
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  }
}

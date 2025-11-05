import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://0.0.0.0:3001';

const FALLBACK_PREDICTIONS = {
  predictions: [],
  message: 'Predictions service temporarily unavailable. Please try again later.',
  fallback: true,
  status: 'degraded'
};

let requestCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minute

export async function GET() {
  // Return cached data if available and fresh
  if (requestCache && Date.now() - requestCache.timestamp < CACHE_DURATION) {
    return NextResponse.json(
      { ...requestCache.data, cached: true },
      {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${BACKEND_API_URL}/api/predictions`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal,
      mode: 'cors'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Backend predictions API returned ${response.status}`);
      
      // Return cached data if available, otherwise fallback
      if (requestCache) {
        return NextResponse.json(
          { ...requestCache.data, cached: true, stale: true },
          {
            status: 200,
            headers: {
              'X-Cache': 'STALE',
              'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
            }
          }
        );
      }

      return NextResponse.json(FALLBACK_PREDICTIONS, {
        status: 200,
        headers: {
          'X-Cache': 'MISS',
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
        }
      });
    }

    const data = await response.json();
    
    // Update cache
    requestCache = {
      data,
      timestamp: Date.now()
    };

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Only log non-abort errors
    if (!errorMessage.includes('aborted')) {
      console.error('Error fetching predictions:', errorMessage);
    }

    // Return cached data if available
    if (requestCache) {
      return NextResponse.json(
        { ...requestCache.data, cached: true, stale: true },
        {
          status: 200,
          headers: {
            'X-Cache': 'STALE-ERROR',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
          }
        }
      );
    }

    // Return fallback data in case of any exception
    return NextResponse.json(FALLBACK_PREDICTIONS, {
      status: 200,
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/api/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create prediction'
    }, { status: 500 });
  }
}
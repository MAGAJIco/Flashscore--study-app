
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const CACHE_DURATION = {
  predictions: 60, // 1 minute
  matches: 30, // 30 seconds
  news: 300, // 5 minutes
  static: 3600, // 1 hour
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const type = searchParams.get('type') || 'predictions';

  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }

  const cacheKey = `edge:${type}:${endpoint}`;
  const duration = CACHE_DURATION[type as keyof typeof CACHE_DURATION] || 60;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}${endpoint}`, {
      next: { revalidate: duration },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${duration}, stale-while-revalidate=${duration * 2}`,
        'CDN-Cache-Control': `public, max-age=${duration}`,
        'Vercel-CDN-Cache-Control': `public, max-age=${duration}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}

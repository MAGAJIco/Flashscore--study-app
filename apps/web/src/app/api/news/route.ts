import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/news`, {
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
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error proxying to backend API:', error);
    
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 1,
          title: "Sports Central Empire Launch",
          preview: "Welcome to your unified sports prediction platform with AI-powered insights and real-time analytics.",
          fullContent: "Sports Central Empire brings together all your favorite sports features in one place...",
          author: "Sports Central Team",
          createdAt: new Date().toISOString(),
          tags: ["Launch", "Platform"],
          isActive: true
        }
      ],
      count: 1,
      accessLevel: 'guest'
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  }
}

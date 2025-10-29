
import { NextResponse } from 'next/server';

const CACHED_NEWS = [
  {
    id: 1,
    title: "Sports Central Empire Launch",
    preview: "Welcome to your unified sports prediction platform with AI-powered insights and real-time analytics.",
    fullContent: "Sports Central Empire brings together all your favorite sports features in one place...",
    author: "Sports Central Team",
    createdAt: new Date().toISOString(),
    tags: ["Launch", "Platform"],
    isActive: true
  },
  {
    id: 2,
    title: "AI Predictions Now Live",
    preview: "Experience next-generation sports predictions powered by advanced machine learning algorithms.",
    fullContent: "Our AI prediction system uses cutting-edge machine learning to provide accurate forecasts...",
    author: "AI Team",
    createdAt: new Date().toISOString(),
    tags: ["AI", "Predictions"],
    isActive: true
  },
  {
    id: 3,
    title: "Live Match Tracking Available",
    preview: "Follow your favorite matches in real-time with live scores, stats, and AI sentiment analysis.",
    fullContent: "Track every moment of the game with our comprehensive live match tracking system...",
    author: "Live Team",
    createdAt: new Date().toISOString(),
    tags: ["Live", "Matches"],
    isActive: true
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CACHED_NEWS,
    count: CACHED_NEWS.length,
    accessLevel: 'guest'
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
}

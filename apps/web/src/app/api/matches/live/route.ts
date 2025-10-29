
import { NextResponse } from 'next/server';

const CACHED_MATCHES = [
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
  },
  {
    id: 2,
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 1,
    awayScore: 1,
    status: "Live",
    time: "52'",
    venue: "Santiago Bernabéu",
    league: "La Liga"
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CACHED_MATCHES,
    count: CACHED_MATCHES.length
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  });
}

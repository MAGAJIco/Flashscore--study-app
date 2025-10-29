
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const family = searchParams.get('family') || 'circular';

  try {
    // Fetch live scores
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001'}/api/matches/live`);
    const matches = await response.json();

    // Format data based on complication family
    const complicationData = formatForComplication(matches, family);

    return NextResponse.json(complicationData);
  } catch (error) {
    console.error('Watch complication error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complication data' },
      { status: 500 }
    );
  }
}

function formatForComplication(matches: any[], family: string) {
  const topMatch = matches[0];

  if (!topMatch) {
    return {
      text: 'No live matches',
      shortText: '--'
    };
  }

  switch (family) {
    case 'circular':
      return {
        text: `${topMatch.homeTeam?.score || 0}-${topMatch.awayTeam?.score || 0}`,
        label: topMatch.minute || '0\''
      };
    
    case 'rectangular':
      return {
        header: topMatch.competition || 'Live',
        body: `${topMatch.homeTeam?.name || 'TBD'} ${topMatch.homeTeam?.score || 0} - ${topMatch.awayTeam?.score || 0} ${topMatch.awayTeam?.name || 'TBD'}`,
        footer: `${topMatch.minute || '0'}'`
      };
    
    case 'graphic':
      return {
        bezelText: topMatch.minute || '0\'',
        centerText: `${topMatch.homeTeam?.score || 0}-${topMatch.awayTeam?.score || 0}`,
        bottomText: topMatch.homeTeam?.name || 'Live Match'
      };
    
    default:
      return {
        text: `${topMatch.homeTeam?.score || 0}-${topMatch.awayTeam?.score || 0}`,
        shortText: topMatch.minute || '0\''
      };
  }
}

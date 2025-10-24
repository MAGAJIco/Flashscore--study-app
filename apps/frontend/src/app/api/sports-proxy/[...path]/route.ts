import { createSportsAPIService } from '../service';

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

const sportsAPI = createSportsAPIService();

const fallbackMatches: Match[] = [
  { id: 1, home: "Manchester United", away: "Liverpool", prediction: "Liverpool to win 2-1" },
  { id: 2, home: "Barcelona", away: "Real Madrid", prediction: "Draw 1-1" },
  { id: 3, home: "Bayern Munich", away: "Borussia Dortmund", prediction: "Bayern Munich to win 3-0" },
  { id: 4, home: "Arsenal", away: "Chelsea", prediction: "Arsenal to win 2-0" },
];

export async function GET(req: Request) {
  try {
    const liveMatches = await sportsAPI.fetchEnhancedLiveMatches();

    const matches: Match[] = liveMatches.map((match, index) => ({
      id: Number(match.id) || index + 1,
      home: match.homeTeam || 'Unknown',
      away: match.awayTeam || 'Unknown',
      prediction: match.prediction || `Analysis: ${match.homeTeam} vs ${match.awayTeam}`,
    }));

    return new Response(JSON.stringify(matches.length ? matches : fallbackMatches), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching enhanced live matches:', error);

    try {
      const regularMatches = await sportsAPI.fetchAllLiveMatches();

      const matches: Match[] = regularMatches.map((match, index) => ({
        id: Number(match.id) || index + 1,
        home: match.homeTeam || 'Unknown',
        away: match.awayTeam || 'Unknown',
        prediction: `Prediction for ${match.homeTeam} vs ${match.awayTeam}`,
      }));

      return new Response(JSON.stringify(matches.length ? matches : fallbackMatches), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (fallbackError) {
      console.error('Fallback fetch failed:', fallbackError);
      return new Response(JSON.stringify(fallbackMatches), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
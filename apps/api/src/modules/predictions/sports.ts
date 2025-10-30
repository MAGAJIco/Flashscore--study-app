// Using native fetch (Node 18+)

interface SportsAPIConfig {
rapidApiKey?: string;
oddsApiKey?: string;
footballDataApiKey?: string;
}

interface LiveMatch {
id: string;
sport: string;
homeTeam: string;
awayTeam: string;
gameTime: string;
status: string;
homeScore?: number;
awayScore?: number;
prediction?: string;
confidence?: number;
}

interface OddsData {
gameId: string;
bookmaker: string;
homeOdds: number;
awayOdds: number;
drawOdds?: number;
overUnder?: {
total: number;
overOdds: number;
underOdds: number;
};
}

export class SportsAPIService {
private config: SportsAPIConfig;

constructor(config: SportsAPIConfig) {
this.config = config;
}

// RapidAPI Sports Integration
async fetchNFLMatches(): Promise<LiveMatch[]> {
if (!this.config.rapidApiKey) {
throw new Error('RapidAPI key required for NFL data');
}

try {  
  const response = await fetch('https://api-american-football.p.rapidapi.com/games?league=1&season=2025', {  
    method: 'GET',  
    headers: {  
      'X-RapidAPI-Key': this.config.rapidApiKey,  
      'X-RapidAPI-Host': 'api-american-football.p.rapidapi.com'  
    }  
  });  

  if (!response.ok) {  
    throw new Error(`NFL API error: ${response.status}`);  
  }  

  const data = await response.json();  
  return this.formatNFLData(data);  
} catch (error) {  
  console.error('NFL API fetch error:', error);  
  throw error;  
}

}

async fetchNBAMatches(): Promise<LiveMatch[]> {
if (!this.config.rapidApiKey) {
throw new Error('RapidAPI key required for NBA data');
}

try {  
  const response = await fetch('https://api-basketball.p.rapidapi.com/games?league=12&season=2024-2025', {  
    method: 'GET',  
    headers: {  
      'X-RapidAPI-Key': this.config.rapidApiKey,  
      'X-RapidAPI-Host': 'api-basketball.p.rapidapi.com'  
    }  
  });  

  if (!response.ok) {  
    throw new Error(`NBA API error: ${response.status}`);  
  }  

  const data = await response.json();  
  return this.formatNBAData(data);  
} catch (error) {  
  console.error('NBA API fetch error:', error);  
  throw error;  
}

}

async fetchMLBMatches(): Promise<LiveMatch[]> {
if (!this.config.rapidApiKey) {
throw new Error('RapidAPI key required for MLB data');
}

try {  
  const response = await fetch('https://api-baseball.p.rapidapi.com/games?league=1&season=2025', {  
    method: 'GET',  
    headers: {  
      'X-RapidAPI-Key': this.config.rapidApiKey,  
      'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'  
    }  
  });  

  if (!response.ok) {  
    throw new Error(`MLB API error: ${response.status}`);  
  }  

  const data = await response.json();  
  return this.formatMLBData(data);  
} catch (error) {  
  console.error('MLB API fetch error:', error);  
  throw error;  
}

}

// The Odds API Integration
async fetchOddsData(sport: string): Promise<OddsData[]> {
if (!this.config.oddsApiKey) {
throw new Error('The Odds API key required for betting odds');
}

const sportKeys: Record<string, string> = {  
  'NFL': 'americanfootball_nfl',  
  'NBA': 'basketball_nba',  
  'MLB': 'baseball_mlb'  
};  

const sportKey = sportKeys[sport];  
if (!sportKey) {  
  throw new Error(`Unsupported sport for odds: ${sport}`);  
}  

try {  
  const response = await fetch(  
    `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${this.config.oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=decimal`,  
    { method: 'GET' }  
  );  

  if (!response.ok) {  
    throw new Error(`Odds API error: ${response.status}`);  
  }  

  const data = await response.json();  
  return this.formatOddsData(data);  
} catch (error) {  
  console.error('Odds API fetch error:', error);  
  throw error;  
}

}

// Football-Data.org Integration (Soccer)
async fetchSoccerMatches(): Promise<LiveMatch[]> {
if (!this.config.footballDataApiKey) {
throw new Error('Football-Data.org API key required for soccer data');
}

try {  
  const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches', {  
    method: 'GET',  
    headers: {  
      'X-Auth-Token': this.config.footballDataApiKey  
    }  
  });  

  if (!response.ok) {  
    throw new Error(`Soccer API error: ${response.status}`);  
  }  

  const data = await response.json();  
  return this.formatSoccerData(data);  
} catch (error) {  
  console.error('Soccer API fetch error:', error);  
  throw error;  
}

}

// Data formatting methods
private formatNFLData(apiData: any): LiveMatch[] {
if (!apiData.response) return [];

return apiData.response.map((game: any) => ({  
  id: game.game.id.toString(),  
  sport: 'NFL',  
  homeTeam: game.teams.home.name,  
  awayTeam: game.teams.away.name,  
  gameTime: game.game.date.start,  
  status: game.game.status.short,  
  homeScore: game.scores.home.total,  
  awayScore: game.scores.away.total  
}));

}

private formatNBAData(apiData: any): LiveMatch[] {
if (!apiData.response) return [];

return apiData.response.map((game: any) => ({  
  id: game.id.toString(),  
  sport: 'NBA',  
  homeTeam: game.teams.home.name,  
  awayTeam: game.teams.away.name,  
  gameTime: game.date,  
  status: game.status.short,  
  homeScore: game.scores.home.total,  
  awayScore: game.scores.away.total  
}));

}

private formatMLBData(apiData: any): LiveMatch[] {
if (!apiData.response) return [];

return apiData.response.map((game: any) => ({  
  id: game.id.toString(),  
  sport: 'MLB',  
  homeTeam: game.teams.home.name,  
  awayTeam: game.teams.away.name,  
  gameTime: game.date,  
  status: game.status.short,  
  homeScore: game.scores.home.total,  
  awayScore: game.scores.away.total  
}));

}

private formatSoccerData(apiData: any): LiveMatch[] {
if (!apiData.matches) return [];

return apiData.matches.map((match: any) => ({  
  id: match.id.toString(),  
  sport: 'Soccer',  
  homeTeam: match.homeTeam.name,  
  awayTeam: match.awayTeam.name,  
  gameTime: match.utcDate,  
  status: match.status,  
  homeScore: match.score.fullTime.home,  
  awayScore: match.score.fullTime.away  
}));

}

private formatOddsData(apiData: any): OddsData[] {
if (!Array.isArray(apiData)) return [];

return apiData.flatMap((game: any) =>   
  game.bookmakers.map((bookmaker: any) => ({  
    gameId: game.id,  
    bookmaker: bookmaker.title,  
    homeOdds: bookmaker.markets.find((m: any) => m.key === 'h2h')?.outcomes[0]?.price || 0,  
    awayOdds: bookmaker.markets.find((m: any) => m.key === 'h2h')?.outcomes[1]?.price || 0,  
    drawOdds: bookmaker.markets.find((m: any) => m.key === 'h2h')?.outcomes[2]?.price,  
    overUnder: this.extractOverUnder(bookmaker.markets)  
  }))  
);

}

private extractOverUnder(markets: any[]): { total: number; overOdds: number; underOdds: number } | undefined {
const totalsMarket = markets.find(m => m.key === 'totals');
if (!totalsMarket || !totalsMarket.outcomes) return undefined;

const overOutcome = totalsMarket.outcomes.find((o: any) => o.name === 'Over');  
const underOutcome = totalsMarket.outcomes.find((o: any) => o.name === 'Under');  

if (!overOutcome || !underOutcome) return undefined;  

return {  
  total: parseFloat(overOutcome.point || underOutcome.point || '0'),  
  overOdds: overOutcome.price,  
  underOdds: underOutcome.price  
};

}

// ESPN API Integration (Free)
async fetchESPNNFL(): Promise<LiveMatch[]> {
try {
  const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
  
  if (!response.ok) {
    throw new Error(`ESPN NFL API error: ${response.status}`);
  }
  
  const data = await response.json();
  return this.formatESPNData(data, 'NFL');
} catch (error) {
  console.error('ESPN NFL API fetch error:', error);
  throw error;
}
}

async fetchESPNNBA(): Promise<LiveMatch[]> {
try {
  const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
  
  if (!response.ok) {
    throw new Error(`ESPN NBA API error: ${response.status}`);
  }
  
  const data = await response.json();
  return this.formatESPNData(data, 'NBA');
} catch (error) {
  console.error('ESPN NBA API fetch error:', error);
  throw error;
}
}

async fetchESPNMLB(): Promise<LiveMatch[]> {
try {
  const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
  
  if (!response.ok) {
    throw new Error(`ESPN MLB API error: ${response.status}`);
  }
  
  const data = await response.json();
  return this.formatESPNData(data, 'MLB');
} catch (error) {
  console.error('ESPN MLB API fetch error:', error);
  throw error;
}
}

private formatESPNData(apiData: any, sport: string): LiveMatch[] {
if (!apiData.events) return [];

return apiData.events.map((event: any) => ({
  id: event.id,
  sport: sport,
  homeTeam: event.competitions[0]?.competitors?.find((c: any) => c.homeAway === 'home')?.team?.displayName || 'Unknown',
  awayTeam: event.competitions[0]?.competitors?.find((c: any) => c.homeAway === 'away')?.team?.displayName || 'Unknown',
  gameTime: event.date,
  status: event.status?.type?.description || 'Unknown',
  homeScore: event.competitions[0]?.competitors?.find((c: any) => c.homeAway === 'home')?.score || 0,
  awayScore: event.competitions[0]?.competitors?.find((c: any) => c.homeAway === 'away')?.score || 0
}));
}

// Updated method to include ESPN APIs as fallback
async fetchAllLiveMatches(): Promise<LiveMatch[]> {
const results = await Promise.allSettled([
// Try paid APIs first
this.fetchNFLMatches().catch(() => this.fetchESPNNFL()),
this.fetchNBAMatches().catch(() => this.fetchESPNNBA()),
this.fetchMLBMatches().catch(() => this.fetchESPNMLB()),
this.fetchSoccerMatches()
]);

const allMatches: LiveMatch[] = [];  
  
results.forEach((result, index) => {  
  if (result.status === 'fulfilled') {  
    allMatches.push(...result.value);  
  } else {  
    const sports = ['NFL', 'NBA', 'MLB', 'Soccer'];  
    console.warn(`Failed to fetch ${sports[index]} data:`, result.reason?.message);  
  }  
});  

return allMatches;

}

// FlashScore integration (web scraping approach)
async fetchFlashScoreData(): Promise<LiveMatch[]> {
try {
  // FlashScore uses dynamic content, so we'll use their mobile API endpoints
  const response = await fetch('https://www.flashscore.com/x/feed/proxy-dienst', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.flashscore.com/'
    },
    body: 'commands=[{"type":"live-score","params":{"sport":"football"}}]'
  });

  if (!response.ok) {
    throw new Error(`FlashScore API error: ${response.status}`);
  }

  const data = await response.text();
  return this.parseFlashScoreData(data);
} catch (error) {
  console.error('FlashScore fetch error:', error);
  return [];
}
}

// Statarea integration
async fetchStatAreaPredictions(): Promise<{ matchId: string; prediction: string; confidence: number }[]> {
try {
  const response = await fetch('https://www.statarea.com/predictions/today', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  if (!response.ok) {
    throw new Error(`StatArea API error: ${response.status}`);
  }

  const html = await response.text();
  return this.parseStatAreaPredictions(html);
} catch (error) {
  console.error('StatArea fetch error:', error);
  return [];
}
}

// Enhanced live score data with FlashScore and StatArea
async fetchEnhancedLiveMatches(): Promise<LiveMatch[]> {
const sources = await Promise.allSettled([
  this.fetchAllLiveMatches(),
  this.fetchFlashScoreData()
]);

const allMatches: LiveMatch[] = [];
const predictions = await this.fetchStatAreaPredictions();

sources.forEach((result) => {
  if (result.status === 'fulfilled') {
    allMatches.push(...result.value);
  }
});

// Enhance matches with predictions
return allMatches.map(match => ({
  ...match,
  prediction: predictions.find(p => 
    p.matchId === match.id || 
    (p.matchId.includes(match.homeTeam) && p.matchId.includes(match.awayTeam))
  )?.prediction || 'No prediction available'
}));
}

// Parse FlashScore data
private parseFlashScoreData(data: string): LiveMatch[] {
try {
  // FlashScore returns encoded data, basic parsing approach
  const matches: LiveMatch[] = [];
  const lines = data.split('\n');
  
  for (const line of lines) {
    if (line.includes('~') && line.includes('|')) {
      const parts = line.split('~');
      if (parts.length >= 5) {
        matches.push({
          id: parts[0] || 'unknown',
          sport: 'Soccer',
          homeTeam: parts[2] || 'Unknown',
          awayTeam: parts[3] || 'Unknown',
          gameTime: new Date().toISOString(),
          status: 'Live',
          homeScore: parseInt(parts[4]) || 0,
          awayScore: parseInt(parts[5]) || 0
        });
      }
    }
  }
  
  return matches;
} catch (error) {
  console.error('Error parsing FlashScore data:', error);
  return [];
}
}

// Parse StatArea predictions
private parseStatAreaPredictions(html: string): { matchId: string; prediction: string; confidence: number }[] {
const predictions: { matchId: string; prediction: string; confidence: number }[] = [];

try {
  // Basic HTML parsing for predictions
  const matches = html.match(/<div[^>]*class="[^"]*prediction[^"]*"[^>]*>[\s\S]*?<\/div>/g) || [];
  
  matches.forEach((match, index) => {
    const teamMatch = match.match(/([A-Za-z\s]+)\s+vs?\s+([A-Za-z\s]+)/);
    const predictionMatch = match.match(/prediction[^>]*>([^<]+)/);
    const confidenceMatch = match.match(/confidence[^>]*>(\d+)%/);
    
    if (teamMatch && predictionMatch) {
      predictions.push({
        matchId: `${teamMatch[1]}_vs_${teamMatch[2]}`,
        prediction: predictionMatch[1].trim(),
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 75
      });
    }
  });
} catch (error) {
  console.error('Error parsing StatArea predictions:', error);
}

return predictions;
}

// Health check method
async checkAPIHealth(): Promise<{ service: string; status: string; error?: string }[]> {
const checks = [
{ name: 'RapidAPI NFL', test: () => this.fetchNFLMatches() },
{ name: 'RapidAPI NBA', test: () => this.fetchNBAMatches() },
{ name: 'RapidAPI MLB', test: () => this.fetchMLBMatches() },
{ name: 'Soccer API', test: () => this.fetchSoccerMatches() },
{ name: 'ESPN NFL (Free)', test: () => this.fetchESPNNFL() },
{ name: 'ESPN NBA (Free)', test: () => this.fetchESPNNBA() },
{ name: 'ESPN MLB (Free)', test: () => this.fetchESPNMLB() },
{ name: 'FlashScore', test: () => this.fetchFlashScoreData() },
{ name: 'StatArea', test: () => this.fetchStatAreaPredictions() },
{ name: 'Odds API NFL', test: () => this.fetchOddsData('NFL') }
];

const results: { service: string; status: string; error?: string }[] = [];  
  
for (const check of checks) {  
  try {  
    await check.test();  
    results.push({ service: check.name, status: 'healthy' });  
  } catch (error: any) {  
    results.push({   
      service: check.name,   
      status: 'unhealthy',   
      error: error.message   
    });  
  }  
}  

return results;

}
}

// Factory function for creating API service with environment variables
export function createSportsAPIService(): SportsAPIService {
return new SportsAPIService({
rapidApiKey: process.env.RAPIDAPI_KEY,
oddsApiKey: process.env.ODDS_API_KEY,
footballDataApiKey: process.env.FOOTBALL_DATA_API_KEY
});
}




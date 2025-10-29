// apps/backend/src/services/scraperService.ts
import { Match } from "../models/Match";

// Dummy scraped matches (replace with real scraper logic later)
const scrapedMatches = [
  {
    homeTeam: "Team A",
    awayTeam: "Team B",
    date: new Date(),
    competition: "Premier League",
    score: "2-1",
    status: "completed" as const,
  },
  {
    homeTeam: "Team C",
    awayTeam: "Team D",
    date: new Date(),
    competition: "La Liga",
    status: "scheduled" as const,
  },
];

export const saveScrapedMatches = async () => {
  for (const match of scrapedMatches) {
    const exists = await Match.findOne({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      date: match.date,
    });

    if (!exists) {
      await Match.create(match);
      console.log(`✅ Saved match: ${match.homeTeam} vs ${match.awayTeam}`);
    } else {
      console.log(`ℹ️ Match already exists: ${match.homeTeam} vs ${match.awayTeam}`);
    }
  }
};
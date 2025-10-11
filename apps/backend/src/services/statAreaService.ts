import axios from "axios";
import * as cheerio from "cheerio";

interface StatAreaPrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  league: string;
  odds: number;
  date: string;
  status: string;
  categories: string[];
}

export class StatAreaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "https://www.statarea.com";
  }

  async fetchPredictions(url: string): Promise<StatAreaPrediction[]> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      return this.parseStatAreaHTML(response.data);
    } catch (error) {
      console.error("Error fetching StatArea predictions:", error);
      throw error;
    }
  }

  private parseStatAreaHTML(html: string): StatAreaPrediction[] {
    const $ = cheerio.load(html);
    const predictions: StatAreaPrediction[] = [];

    $(".prediction-row, .match-row, .tip-row").each(
      (i: number, el: any) => {
        const $el = $(el);

        const homeTeam = $el.find(".home-team, .team-home").text().trim();
        const awayTeam = $el.find(".away-team, .team-away").text().trim();
        const predictionText = $el.find(".tip, .prediction").text().trim();

        if (!homeTeam || !awayTeam || !predictionText) {
          return;
        }

        predictions.push({
          matchId: `${homeTeam}_vs_${awayTeam}_${Date.now()}`,
          homeTeam,
          awayTeam,
          prediction: predictionText,
          confidence: 75,
          league: "Unknown",
          odds: 0,
          date: new Date().toISOString(),
          status: "active",
          categories: [],
        });
      },
    );

    return predictions;
  }
}

export default new StatAreaService();
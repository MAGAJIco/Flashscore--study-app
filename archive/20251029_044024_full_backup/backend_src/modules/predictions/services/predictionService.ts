
import { Prediction } from "@/models";
import { mlPredictionService } from "@/services/mlPredictionService";
import { scraperService } from "@/modules/scraper/services/scraperService";

export const predictionService = {
  async getAllPredictions() {
    return await Prediction.find().sort({ createdAt: -1 }).limit(100);
  },

  async createPrediction(data: any) {
    const prediction = new Prediction(data);
    await prediction.save();
    return prediction;
  },

  async getPredictionById(id: string) {
    return await Prediction.findById(id);
  },

  async getPredictionsByUserId(userId: string) {
    return await Prediction.find({ userId }).sort({ createdAt: -1 });
  },

  async updatePrediction(id: string, data: any) {
    return await Prediction.findByIdAndUpdate(id, data, { new: true });
  },

  async deletePrediction(id: string) {
    return await Prediction.findByIdAndDelete(id);
  },

  async predictWithML(features: number[], homeTeam?: string, awayTeam?: string) {
    try {
      // Try ML service first
      const mlResult = await mlPredictionService.predictMatch({ 
        features, 
        homeTeam: homeTeam || '', 
        awayTeam: awayTeam || '' 
      });
      
      return {
        ...mlResult,
        source: 'ml'
      };
    } catch (mlError) {
      console.warn("⚠️ ML service failed, falling back to scraper:", mlError);
      
      // Fallback to scraper service if ML fails
      if (homeTeam && awayTeam) {
        try {
          const scraperResult = await scraperService.getPredictionFallback(homeTeam, awayTeam);
          console.log("✅ Using scraper fallback for prediction");
          return scraperResult;
        } catch (scraperError) {
          console.error("❌ Scraper fallback also failed:", scraperError);
          
          // Final rule-based fallback
          return {
            prediction: features[0] > features[1] ? 'home' : 'away',
            confidence: 0.5,
            probabilities: {
              home: features[0] > features[1] ? 0.55 : 0.45,
              draw: 0.25,
              away: features[0] > features[1] ? 0.20 : 0.30
            },
            model_version: 'rule-based-fallback-v1',
            source: 'rule-based'
          };
        }
      } else {
        // No team names provided, use rule-based fallback
        return {
          prediction: features[0] > features[1] ? 'home' : 'away',
          confidence: 0.5,
          probabilities: {
            home: features[0] > features[1] ? 0.55 : 0.45,
            draw: 0.25,
            away: features[0] > features[1] ? 0.20 : 0.30
          },
          model_version: 'rule-based-fallback-v1',
          source: 'rule-based'
        };
      }
    }
  }
};

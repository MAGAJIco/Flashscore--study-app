
import { Prediction } from "@/models";
import { mlPredictionService } from "@/services/mlPredictionService";

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

  async predictWithML(features: number[]) {
    return await mlPredictionService.predictMatch({ features, homeTeam: '', awayTeam: '' });
  }
};

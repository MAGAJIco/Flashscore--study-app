const Prediction = require("@shared/models/Prediction");
const Author = require("@shared/models/Author");
const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

async function fetchPredictionFromMLService(features) {
  try {
    const res = await axios.post(`${ML_SERVICE_URL}/predict`, { features });
    return res.data; // { prediction: "Win", confidence: 0.87 }
  } catch (err) {
    console.error("ML service error:", err.message);
    return { prediction: "unknown", confidence: 0 };
  }
}

class PredictionController {
  constructor() {
    this.predictions = [];
    this.authors = [];
    this.nextId = 1;
    this.nextAuthorId = 1;
    this.initializeSampleData();
  }

  // 🔥 Updated createPrediction
  async createPrediction(predictionData) {
    try {
      // Call ML service first
      const mlResult = await fetchPredictionFromMLService(
        predictionData.features || [],
      );

      const prediction = new Prediction(
        this.nextId++,
        predictionData.title,
        predictionData.content,
        predictionData.authorId,
        predictionData.sport,
        predictionData.matchDetails,
        mlResult.confidence * 100, // save ML confidence as percentage
        predictionData.status || "pending",
      );

      // Attach ML classification
      prediction.result = mlResult.prediction;

      const validation = prediction.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Verify author exists
      const author = this.authors.find((a) => a.id === prediction.authorId);
      if (!author) {
        throw new Error("Author not found");
      }

      this.predictions.push(prediction);
      return prediction.toAPI();
    } catch (error) {
      throw new Error(`Error creating prediction: ${error.message}`);
    }
  }
}

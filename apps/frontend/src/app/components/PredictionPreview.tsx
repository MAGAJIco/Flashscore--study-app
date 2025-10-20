"use client";
import React, { useState, useEffect } from "react";

// Types and interfaces
interface PredictionData {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  odds?: number; // Optional odds
  analysis?: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  probabilities?: { // Added probabilities for ML prediction
    home: number;
    draw: number;
    away: number;
  };
  modelVersion?: string; // Added model version
}

interface PredictionPreviewProps {
  prediction?: PredictionData; // Use the enhanced PredictionData type
  showFullAnalysis?: boolean;
  compact?: boolean;
}

const PredictionPreview: React.FC<PredictionPreviewProps> = ({
  prediction,
  showFullAnalysis = false,
  compact = false,
}) => {
  const [currentPrediction, setCurrentPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prediction) {
      setCurrentPrediction(prediction);
    } else {
      fetchLatestPrediction();
    }
  }, [prediction]);

  const fetchLatestPrediction = async () => {
    setLoading(true);
    try {
      // Mock data for demo - replace with actual API call
      const mockPrediction: PredictionData = {
        id: "pred_001",
        match: "Manchester United vs Liverpool",
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        prediction: "Over 2.5 Goals",
        confidence: 78,
        odds: 1.85,
        league: "Premier League",
        date: new Date().toISOString(),
        analysis: "Both teams have strong attacking records this season.",
        probabilities: { // Mock probabilities
          home: 0.45,
          draw: 0.30,
          away: 0.25,
        },
        modelVersion: "v2.1.0" // Mock model version
      };
      setCurrentPrediction(mockPrediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-3 bg-white/20 rounded mb-1"></div>
        <div className="h-3 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!currentPrediction) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400">No predictions available</p>
      </div>
    );
  }

  return (
    <div className={`glass-card hover-lift group ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl">
          🔮
        </div>
        <h2 className={`font-bold ${compact ? 'text-lg' : 'text-xl'}`}>
          Latest Prediction
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">
              {currentPrediction.homeTeam} vs {currentPrediction.awayTeam}
            </h3>
            <p className="text-sm text-gray-400">{currentPrediction.league}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Confidence</div>
            <div className="text-lg font-bold text-green-400">
              {currentPrediction.confidence}%
            </div>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">
              {currentPrediction.prediction}
            </span>
            {currentPrediction.odds !== undefined && ( // Conditionally render odds
              <span className="text-blue-400 font-bold">
                @{currentPrediction.odds}
              </span>
            )}
          </div>
        </div>

        {showFullAnalysis && currentPrediction.analysis && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Analysis</h4>
            <p className="text-gray-300 text-sm">{currentPrediction.analysis}</p>
          </div>
        )}

        {/* Display ML probabilities if available */}
        {currentPrediction.probabilities && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Probabilities</h4>
            <div className="flex justify-between text-sm">
              <span>Home Win: {currentPrediction.probabilities.home.toFixed(2)}</span>
              <span>Draw: {currentPrediction.probabilities.draw.toFixed(2)}</span>
              <span>Away Win: {currentPrediction.probabilities.away.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Display Model Version if available */}
        {currentPrediction.modelVersion && (
          <div className="mt-2 text-right text-xs text-gray-500">
            Model: {currentPrediction.modelVersion}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button className="flex-1 ios-button bg-gradient-to-r from-green-600 to-green-700 py-2 text-sm">
            View Details
          </button>
          <button className="flex-1 ios-button bg-gradient-to-r from-blue-600 to-blue-700 py-2 text-sm">
            Follow Tip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionPreview;
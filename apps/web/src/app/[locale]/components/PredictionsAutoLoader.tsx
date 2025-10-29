"use client";

import React, { useState, useEffect } from "react";

interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  league: string;
}

export default function PredictionsAutoLoader() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockPredictions: Prediction[] = [
      {
        id: "1",
        homeTeam: "Man United",
        awayTeam: "Arsenal",
        prediction: "Home Win",
        confidence: 68,
        league: "Premier League",
      },
      {
        id: "2",
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        prediction: "Draw",
        confidence: 52,
        league: "La Liga",
      },
      {
        id: "3",
        homeTeam: "Bayern Munich",
        awayTeam: "Dortmund",
        prediction: "Home Win",
        confidence: 75,
        league: "Bundesliga",
      },
    ];

    setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🤖</span>
          <h2 className="text-2xl font-bold text-white">AI Predictions</h2>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-white/20 rounded-lg"></div>
          <div className="h-20 bg-white/20 rounded-lg"></div>
          <div className="h-20 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🤖</span>
        <h2 className="text-2xl font-bold text-white">AI Predictions</h2>
        <span className="ml-auto px-3 py-1 bg-green-500 text-white text-sm rounded-full font-semibold">
          LIVE
        </span>
      </div>

      <div className="space-y-3">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="bg-white/90 rounded-lg p-4 hover:bg-white transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-600 uppercase">
                {pred.league}
              </span>
              <span className="text-xs font-semibold text-gray-600">
                {pred.confidence}% Confidence
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800">
                  {pred.homeTeam} vs {pred.awayTeam}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Prediction: <span className="font-bold text-purple-600">{pred.prediction}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                ⚡
              </div>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                style={{ width: `${pred.confidence}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform">
        View All Predictions →
      </button>
    </div>
  );
}

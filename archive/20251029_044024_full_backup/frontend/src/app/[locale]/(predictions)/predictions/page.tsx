"use client";

import { useState, useEffect } from 'react';

interface Prediction {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  prediction: string;
  confidence: number;
  tip: string;
  date: string;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  odds: {
    home: number;
    draw: number;
    away: number;
    source: string;
  };
  source: string;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/scraper/predictions`);

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      setPredictions(data.data || []);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('Failed to load predictions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPredictionBadgeColor = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case 'home':
      case '1':
        return 'bg-green-500';
      case 'away':
      case '2':
        return 'bg-blue-500';
      case 'draw':
      case 'x':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-green-600 font-bold';
    if (confidence >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl text-gray-700">Loading predictions...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <span className="text-6xl">⚠️</span>
              <h2 className="text-2xl font-bold text-red-600 mt-4">{error}</h2>
              <button
                onClick={fetchPredictions}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🤖 AI Predictions</h1>
              <p className="text-blue-100">Powered by Statarea & Stake Data</p>
            </div>
            <button
              onClick={fetchPredictions}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Predictions Grid */}
        {predictions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <span className="text-6xl">📊</span>
            <h2 className="text-2xl font-bold text-gray-700 mt-4">No predictions available</h2>
            <p className="text-gray-500 mt-2">Check back later for new predictions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((pred, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-gray-100 hover:border-blue-200"
              >
                {/* League Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {pred.competition}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(pred.date)}</span>
                </div>

                {/* Teams */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-800">{pred.homeTeam}</span>
                    <span className="text-sm text-gray-500">vs</span>
                    <span className="text-lg font-bold text-gray-800">{pred.awayTeam}</span>
                  </div>
                </div>

                {/* Prediction */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Prediction:</span>
                    <span className={`px-3 py-1 ${getPredictionBadgeColor(pred.prediction)} text-white rounded-full text-sm font-bold`}>
                      {pred.tip || pred.prediction.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className={`text-lg font-bold ${getConfidenceColor(pred.confidence)}`}>
                      {pred.confidence}%
                    </span>
                  </div>
                </div>

                {/* Odds */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">Home</div>
                    <div className="text-sm font-bold">{pred.odds.home.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">Draw</div>
                    <div className="text-sm font-bold">{pred.odds.draw.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">Away</div>
                    <div className="text-sm font-bold">{pred.odds.away.toFixed(2)}</div>
                  </div>
                </div>

                {/* Probabilities */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-20 text-xs text-gray-600">Home:</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all"
                        style={{ width: `${pred.probabilities.home * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-xs text-gray-700 font-semibold">
                      {(pred.probabilities.home * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 text-xs text-gray-600">Draw:</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full transition-all"
                        style={{ width: `${pred.probabilities.draw * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-xs text-gray-700 font-semibold">
                      {(pred.probabilities.draw * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 text-xs text-gray-600">Away:</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all"
                        style={{ width: `${pred.probabilities.away * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-xs text-gray-700 font-semibold">
                      {(pred.probabilities.away * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Source */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Source: <span className="font-semibold">{pred.source}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">About These Predictions</h3>
              <p className="text-sm text-blue-800">
                These predictions are sourced from Statarea and combined with odds data from Stake.com. 
                The confidence levels are calculated based on historical data and current form. 
                Always gamble responsibly and within your means.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
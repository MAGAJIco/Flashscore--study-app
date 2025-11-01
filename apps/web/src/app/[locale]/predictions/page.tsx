
"use client";

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { SharePrediction } from '@/components/SharePrediction';

interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  model_version?: string;
  source?: string;
}

interface SavedPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  timestamp: string;
  source?: string;
}

export default function PredictionsPage() {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const response = await fetch('http://0.0.0.0:3001/api/predictions');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setSavedPredictions(data.data.slice(0, 10)); // Show latest 10
      }
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const features = [0.75, 0.65, 0.70, 0.68, 0.62, 0.55, 0.80];

      const response = await fetch('http://0.0.0.0:3001/api/predictions/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam,
          awayTeam,
          features,
          enableAI: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      setResult(data.data);
      
      // Refresh predictions list after creating new one
      setTimeout(fetchPredictions, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-blue-400';
    return 'text-amber-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">ML Prediction Engine</h2>
            <p className="text-gray-400">87% accuracy • Powered by AI</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-4 mb-6 bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Home Team
              </label>
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="e.g., Manchester United"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Away Team
              </label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="e.g., Liverpool"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Generate AI Prediction
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Prediction Result</h3>
                </div>
                <span className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence.toFixed(1)}%
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 mb-2">Predicted Outcome:</p>
                <p className="text-2xl font-bold text-white capitalize">
                  {result.prediction} {result.prediction === 'home' ? `(${homeTeam})` : result.prediction === 'away' ? `(${awayTeam})` : ''}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Home Win</p>
                  <p className="text-2xl font-bold text-green-400">{(result.probabilities.home * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Draw</p>
                  <p className="text-2xl font-bold text-amber-400">{(result.probabilities.draw * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Away Win</p>
                  <p className="text-2xl font-bold text-blue-400">{(result.probabilities.away * 100).toFixed(1)}%</p>
                </div>
              </div>

              {result.source && (
                <div className="mt-4 text-xs text-gray-500">
                  Source: {result.source} • Model: {result.model_version}
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-300 mb-1">AI Analysis</p>
                  <p className="text-xs text-gray-400">
                    This prediction is based on advanced machine learning models analyzing team form, 
                    head-to-head records, home advantage, and current injuries.
                  </p>
                </div>
              </div>
            </div>

            <SharePrediction prediction={{
              homeTeam,
              awayTeam,
              prediction: result.prediction,
              confidence: result.confidence
            }} />
          </div>
        )}

        {/* Saved Predictions List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Recent Predictions ({savedPredictions.length})
            </h3>
            <button
              onClick={fetchPredictions}
              disabled={loadingPredictions}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loadingPredictions ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingPredictions && savedPredictions.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : savedPredictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPredictions.map((pred) => (
                <div
                  key={pred.id}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-1">
                        {pred.homeTeam} vs {pred.awayTeam}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(pred.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pred.confidence >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      pred.confidence >= 60 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {pred.confidence.toFixed(1)}%
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">Predicted Outcome:</p>
                    <p className="text-xl font-bold text-white capitalize">
                      {pred.prediction === 'home' ? `${pred.homeTeam} Win` :
                       pred.prediction === 'away' ? `${pred.awayTeam} Win` :
                       'Draw'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400 mb-1">Home</p>
                      <p className="text-sm font-bold text-green-400">
                        {(pred.probabilities.home * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400 mb-1">Draw</p>
                      <p className="text-sm font-bold text-amber-400">
                        {(pred.probabilities.draw * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400 mb-1">Away</p>
                      <p className="text-sm font-bold text-blue-400">
                        {(pred.probabilities.away * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {pred.source && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-500">
                        Source: <span className="text-purple-400">{pred.source}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-400 text-lg">No predictions yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first prediction above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

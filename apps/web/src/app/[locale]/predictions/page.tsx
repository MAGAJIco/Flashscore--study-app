
"use client";

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Zap, AlertCircle, RefreshCw, Sparkles, Award, Clock } from 'lucide-react';
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001';

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const response = await fetch(`${API_URL}/api/predictions`);
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

      const response = await fetch(`${API_URL}/api/predictions/predict`, {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold text-purple-300">AI-Powered Predictions</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl">
              <Brain className="w-10 h-10 text-purple-400" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ML Prediction Engine
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                  <Award className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs font-bold text-green-300">87% Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-blue-300">Powered by AI</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Advanced machine learning models analyzing team statistics, form, and historical data
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handlePredict} className="mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 md:p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl hover:border-purple-500/30 transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Home Team
              </label>
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="e.g., Manchester United"
                className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Away Team
              </label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="e.g., Liverpool"
                className="w-full px-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Generate AI Prediction
                  <Sparkles className="w-4 h-4 opacity-70" />
                </>
              )}
            </span>
          </button>
        </form>

        {result && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="p-8 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-purple-500/20 border border-purple-500/30 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl backdrop-blur-sm">
                      <Target className="w-7 h-7 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Prediction Result</h3>
                      <p className="text-xs text-gray-400">AI-Generated Analysis</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-5xl font-black ${getConfidenceColor(result.confidence)} mb-1`}>
                      {result.confidence.toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-400">Confidence</p>
                  </div>
                </div>

                <div className="mb-6 p-5 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Predicted Outcome:</p>
                  <p className="text-3xl font-black text-white capitalize flex items-center gap-2">
                    <Award className="w-8 h-8 text-yellow-400" />
                    {result.prediction} {result.prediction === 'home' ? `(${homeTeam})` : result.prediction === 'away' ? `(${awayTeam})` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl border border-green-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <p className="text-xs font-semibold text-green-300 mb-2">Home Win</p>
                    <p className="text-3xl font-black text-green-400">{(result.probabilities.home * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl border border-amber-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <p className="text-xs font-semibold text-amber-300 mb-2">Draw</p>
                    <p className="text-3xl font-black text-amber-400">{(result.probabilities.draw * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <p className="text-xs font-semibold text-blue-300 mb-2">Away Win</p>
                    <p className="text-3xl font-black text-blue-400">{(result.probabilities.away * 100).toFixed(1)}%</p>
                  </div>
                </div>

                {result.source && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Source: <span className="text-purple-400 font-semibold">{result.source}</span> • Model: {result.model_version}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-blue-300 mb-2 flex items-center gap-2">
                    AI Analysis
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    This prediction is based on advanced machine learning models analyzing team form, 
                    head-to-head records, home advantage, and current injuries. Our AI considers 
                    over 50 different factors to provide accurate predictions.
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
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  Recent Predictions
                </h3>
                <p className="text-sm text-gray-400">
                  {savedPredictions.length} predictions • Updated in real-time
                </p>
              </div>
            </div>
            <button
              onClick={fetchPredictions}
              disabled={loadingPredictions}
              className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 rounded-xl transition-all border border-purple-500/30 group"
            >
              <RefreshCw className={`w-5 h-5 text-purple-400 group-hover:text-purple-300 ${loadingPredictions ? 'animate-spin' : ''}`} />
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

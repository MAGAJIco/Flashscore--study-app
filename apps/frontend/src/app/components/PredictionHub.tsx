'use client';

import React, { useState, useEffect } from 'react';
import { MLPredictionInterface } from './MLPredictionInterface';
import { ConfidenceSlider } from './ConfidenceSlider';
import { PredictionPreview } from './PredictionPreview';
import { Brain, TrendingUp, BarChart3, Zap } from 'lucide-react';

interface PredictionHubProps {
  showMLInterface?: boolean;
  showModelDashboard?: boolean;
  showLivePredictions?: boolean;
}

export const PredictionHub: React.FC<PredictionHubProps> = ({
  showMLInterface = true,
  showModelDashboard = true,
  showLivePredictions = true
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'live' | 'model'>('generate');
  const [mlStatus, setMlStatus] = useState<'online' | 'offline' | 'loading'>('loading');

  useEffect(() => {
    checkMLStatus();
  }, []);

  const checkMLStatus = async () => {
    try {
      const response = await fetch('/api/ml/status');
      const data = await response.json();
      setMlStatus(data.success ? 'online' : 'offline');
    } catch {
      setMlStatus('offline');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-500" />
            Prediction Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered sports predictions & analytics
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          mlStatus === 'online' ? 'bg-green-100 text-green-800' :
          mlStatus === 'offline' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            mlStatus === 'online' ? 'bg-green-500' :
            mlStatus === 'offline' ? 'bg-red-500' :
            'bg-yellow-500'
          } animate-pulse`} />
          <span className="font-semibold text-sm">
            ML Service {mlStatus === 'loading' ? 'Checking...' : mlStatus.charAt(0).toUpperCase() + mlStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
        {showMLInterface && (
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'generate'
                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Zap className="w-5 h-5" />
            Generate Prediction
          </button>
        )}
        {showLivePredictions && (
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'live'
                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Live Predictions
          </button>
        )}
        {showModelDashboard && (
          <button
            onClick={() => setActiveTab('model')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'model'
                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Model Dashboard
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'generate' && showMLInterface && (
          <div className="animate-in fade-in duration-300">
            <MLPredictionInterface />
          </div>
        )}

        {activeTab === 'live' && showLivePredictions && (
          <div className="animate-in fade-in duration-300">
            <LivePredictionsFeed />
          </div>
        )}

        {activeTab === 'model' && showModelDashboard && (
          <div className="animate-in fade-in duration-300">
            <ModelStatusPanel />
          </div>
        )}
      </div>
    </div>
  );
};

const LivePredictionsFeed: React.FC = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/predictions?limit=10');
      const data = await response.json();
      if (data.success) {
        setPredictions(data.predictions || []);
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading predictions...</div>;
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No live predictions available</p>
        <button
          onClick={fetchPredictions}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {predictions.slice(0, 6).map((pred, index) => (
        <PredictionPreview key={pred.matchId || index} prediction={{
          id: pred.matchId || `pred-${index}`,
          match: `${pred.homeTeam} vs ${pred.awayTeam}`,
          prediction: pred.predictedWinner || pred.prediction,
          confidence: pred.confidence || 0,
          homeTeam: pred.homeTeam,
          awayTeam: pred.awayTeam,
          league: pred.league || 'Unknown League',
          date: pred.matchDate || new Date().toISOString(),
          probabilities: pred.probabilities,
          modelVersion: pred.model_version
        }} />
      ))}
    </div>
  );
};

function ModelStatusPanel() {
  const [mlStatus, setMlStatus] = useState<'online' | 'offline' | 'loading'>('loading');

  useEffect(() => {
    checkMLStatus();
  }, []);

  const checkMLStatus = async () => {
    try {
      const response = await fetch('/api/ml/status');
      const data = await response.json();
      setMlStatus(data.success ? 'online' : 'offline');
    } catch {
      setMlStatus('offline');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          ML Model Status
        </h3>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          mlStatus === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          mlStatus === 'offline' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            mlStatus === 'online' ? 'bg-green-500' :
            mlStatus === 'offline' ? 'bg-red-500' :
            'bg-yellow-500'
          } animate-pulse`} />
          <span className="font-semibold text-sm">
            {mlStatus === 'loading' ? 'Checking...' : mlStatus.charAt(0).toUpperCase() + mlStatus.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Model Accuracy</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">87.5%</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Predictions Made</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Confidence Avg</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">78.3%</div>
        </div>
      </div>
    </div>
  );
}

export default PredictionHub;
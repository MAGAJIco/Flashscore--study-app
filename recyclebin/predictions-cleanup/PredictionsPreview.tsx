
"use client";

import React, { useState } from "react";

interface Prediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  sport: string;
  odds: string;
  aiScore: number;
  status: 'pending' | 'won' | 'lost';
  timestamp: Date;
}

const PredictionsPreview: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "preview">("list");
  const [predictions] = useState<Prediction[]>([
    {
      id: '1',
      match: "Lakers vs Warriors",
      prediction: "Lakers Win",
      confidence: 87,
      sport: "NBA",
      odds: "1.8",
      aiScore: 0.94,
      status: 'pending',
      timestamp: new Date()
    },
    {
      id: '2',
      match: "Team E vs Team F",
      prediction: "Team F Win",
      confidence: 90,
      sport: "Football",
      odds: "2.1",
      aiScore: 0.91,
      status: 'won',
      timestamp: new Date()
    },
    {
      id: '3',
      match: "Team G vs Team H",
      prediction: "Over 2.5 Goals",
      confidence: 75,
      sport: "Football",
      odds: "1.9",
      aiScore: 0.82,
      status: 'lost',
      timestamp: new Date()
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-green-400 bg-green-500/20';
      case 'lost': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return '✅';
      case 'lost': return '❌';
      default: return '⏳';
    }
  };

  if (viewMode === "preview") {
    return (
      <div className="glass-card p-6 hover-lift">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl">
              🔮
            </div>
            <h2 className="text-2xl font-bold text-white">Predictions Overview</h2>
          </div>
          <button
            onClick={() => setViewMode("list")}
            className="ios-button bg-gradient-to-r from-blue-600 to-blue-700"
          >
            📋 List View
          </button>
        </div>

        <div className="grid gap-4">
          {predictions.slice(0, 3).map(pred => (
            <div
              key={pred.id}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{pred.match}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(pred.status)}`}>
                  {getStatusIcon(pred.status)} {pred.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-400 font-medium">{pred.prediction}</span>
                <span className="text-blue-400 font-bold">Odds: {pred.odds}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-white/20 rounded-full h-2 max-w-[100px]">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300">{pred.confidence}% confidence</span>
                </div>
                <span className="text-xs text-purple-400">AI: {pred.aiScore}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="ios-button bg-gradient-to-r from-emerald-600 to-teal-700">
            🔍 View All Predictions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 hover-lift">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl">
            📊
          </div>
          <h2 className="text-2xl font-bold text-white">Recent Predictions</h2>
        </div>
        <button
          onClick={() => setViewMode("preview")}
          className="ios-button bg-gradient-to-r from-purple-600 to-purple-700"
        >
          🔮 Preview Mode
        </button>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
          <div className="text-green-400 text-2xl font-bold">
            {predictions.filter(p => p.status === 'won').length}
          </div>
          <div className="text-green-300 text-sm">Won</div>
        </div>
        <div className="text-center p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <div className="text-yellow-400 text-2xl font-bold">
            {predictions.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-yellow-300 text-sm">Pending</div>
        </div>
        <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
          <div className="text-red-400 text-2xl font-bold">
            {predictions.filter(p => p.status === 'lost').length}
          </div>
          <div className="text-red-300 text-sm">Lost</div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-3">
        {predictions.map(pred => (
          <div
            key={pred.id}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-blue-400 font-medium">{pred.sport}</span>
                <h4 className="text-white font-semibold">{pred.match}</h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(pred.status)}`}>
                {getStatusIcon(pred.status)} {pred.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-emerald-400">{pred.prediction}</span>
                <span className="text-gray-400 text-sm">{pred.confidence}% confidence</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-sm">Odds: {pred.odds}</span>
                <span className="text-purple-400 text-xs">AI: {pred.aiScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionsPreview;

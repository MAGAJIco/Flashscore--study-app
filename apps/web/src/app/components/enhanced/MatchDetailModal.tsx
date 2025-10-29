
"use client";

import React from 'react';

interface Match {
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

interface MatchDetailModalProps {
  match: Match;
  onClose: () => void;
}

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto transform transition-all animate-scale-in">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl">
                {match.icon}
              </div>
              <div>
                <span className="inline-flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE
                </span>
                <h2 className="text-2xl font-bold">{match.title}</h2>
                <p className="text-white/80 text-sm mt-1">{match.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-indigo-600">{match.score}</div>
              <div className="text-gray-600 mt-2">{match.time}</div>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>{match.viewers}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Match Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Possession</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: '55%' }}></div>
                </div>
                <span className="font-semibold">55%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shots on Target</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: '70%' }}></div>
                </div>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pass Accuracy</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
                </div>
                <span className="font-semibold">85%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Watch Live 📺
            </button>
            <button className="flex-1 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-colors">
              Share 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";
import React, { useState, useEffect } from 'react';

interface MatchProbability {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeProbability: number;
  drawProbability: number;
  awayProbability: number;
  minute: number;
  score: { home: number; away: number };
  trend: 'rising' | 'falling' | 'stable';
  lastUpdate: Date;
}

export function LiveMatchProbabilityTracker() {
  const [liveMatches, setLiveMatches] = useState<MatchProbability[]>([
    {
      matchId: '1',
      homeTeam: 'Manchester United',
      awayTeam: 'Arsenal',
      homeProbability: 45,
      drawProbability: 28,
      awayProbability: 27,
      minute: 34,
      score: { home: 1, away: 0 },
      trend: 'rising',
      lastUpdate: new Date()
    }
  ]);

  const renderProbabilityBar = (home: number, draw: number, away: number) => (
    <div className="flex h-10 rounded-lg overflow-hidden mb-2">
      <div
        className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold transition-all"
        style={{ width: `${home}%` }}
      >
        {home > 15 && `${home.toFixed(1)}%`}
      </div>
      {draw > 0 && (
        <div
          className="flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-semibold transition-all"
          style={{ width: `${draw}%` }}
        >
          {draw > 15 && `${draw.toFixed(1)}%`}
        </div>
      )}
      <div
        className="flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold transition-all"
        style={{ width: `${away}%` }}
      >
        {away > 15 && `${away.toFixed(1)}%`}
      </div>
    </div>
  );

  return (
    <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-white text-2xl font-bold">📊 Live Probability Tracker</h3>
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
          LIVE
        </div>
      </div>

      <div className="space-y-4">
        {liveMatches.map(match => (
          <div
            key={match.matchId}
            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-white text-lg font-semibold mb-1">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div className="text-gray-400 text-sm">
                  {match.minute}' | {match.score.home} - {match.score.away}
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-lg text-sm border ${
                match.trend === 'rising' ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                match.trend === 'falling' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                'bg-gray-500/20 border-gray-500/40 text-gray-400'
              }`}>
                {match.trend === 'rising' ? '↗' : match.trend === 'falling' ? '↘' : '→'} {match.trend}
              </div>
            </div>

            {renderProbabilityBar(match.homeProbability, match.drawProbability, match.awayProbability)}

            <div className="flex justify-between text-sm text-gray-300">
              <span>{match.homeTeam}</span>
              {match.drawProbability > 0 && <span>Draw</span>}
              <span>{match.awayTeam}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

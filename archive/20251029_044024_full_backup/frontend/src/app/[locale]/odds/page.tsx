
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface OddsBookmaker {
  bookmaker: string;
  home: number;
  draw: number;
  away: number;
  color: string;
}

interface Match {
  league: string;
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
  date: string;
  time: string;
  odds: OddsBookmaker[];
  trending?: 'up' | 'down' | 'stable';
  liveOdds?: boolean;
}

export default function OddsPage() {
  const [matches, setMatches] = useState<Match[]>([
    {
      league: "Bundesliga",
      homeTeam: { name: "SGE", logo: "🦅" },
      awayTeam: { name: "FCB", logo: "🔴" },
      date: "4 Oct 2025",
      time: "17:30",
      trending: 'up',
      liveOdds: true,
      odds: [
        { bookmaker: "Betking", home: 6.40, draw: 5.90, away: 1.44, color: "red" },
        { bookmaker: "1XBET", home: 6.35, draw: 5.65, away: 1.39, color: "blue" }
      ]
    },
    {
      league: "Major League Soccer",
      homeTeam: { name: "VAN", logo: "⚪" },
      awayTeam: { name: "SJE", logo: "🔵" },
      date: "5 Oct 2025",
      time: "23:00",
      trending: 'down',
      liveOdds: true,
      odds: [
        { bookmaker: "Betking", home: 1.62, draw: 4.45, away: 4.90, color: "red" },
        { bookmaker: "1XBET", home: 1.60, draw: 4.52, away: 4.82, color: "blue" }
      ]
    }
  ]);

  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [activeOddsType, setActiveOddsType] = useState<'h2h' | 'over_under' | 'both_teams'>('h2h');

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* GOAL Header with trademark orange accent */}
      <header className="bg-black border-b-4 border-[#ff6b4a] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#ff6b4a] rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-wider">
              GOAL<span className="text-[#ff6b4a]">.</span>
            </h1>
          </div>
          <button className="space-y-1.5">
            <div className="w-8 h-0.5 bg-white"></div>
            <div className="w-8 h-0.5 bg-white"></div>
            <div className="w-8 h-0.5 bg-white"></div>
          </button>
        </div>

        {/* Interactive Odds Type Selector */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            {[
              { id: 'h2h', label: 'Match Result', icon: '⚽' },
              { id: 'over_under', label: 'Over/Under', icon: '📊' },
              { id: 'both_teams', label: 'Both Teams Score', icon: '🎯' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveOddsType(type.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  activeOddsType === type.id
                    ? 'bg-[#ff6b4a] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Live Odds Indicator */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-white animate-pulse" />
          <span className="text-white font-semibold text-sm">Live Odds Updates</span>
        </div>
      </div>

      {/* Matches Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {matches.map((match, idx) => (
          <div key={idx} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-400 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#ff6b4a] rounded"></span>
                {match.league}
              </h2>
              {match.trending && (
                <div className="flex items-center gap-1">
                  {getTrendIcon(match.trending)}
                  <span className="text-xs text-gray-400">Market Moving</span>
                </div>
              )}
            </div>

            <div 
              className={`bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedMatch === idx ? 'border-[#ff6b4a] shadow-xl shadow-[#ff6b4a]/20' : 'border-transparent hover:border-gray-700'
              }`}
              onClick={() => setSelectedMatch(selectedMatch === idx ? null : idx)}
            >
              {/* Match Header with Visual Graphics */}
              <div className="relative p-6 bg-gradient-to-r from-transparent via-[#ff6b4a]/10 to-transparent">
                <div className="flex justify-around items-center">
                  {/* Home Team */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg transform hover:scale-110 transition-transform">
                      {match.homeTeam.logo}
                    </div>
                    <div className="text-xl font-black text-white">{match.homeTeam.name}</div>
                  </div>

                  {/* VS Section with Graphics */}
                  <div className="flex-1 text-center relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <div className="w-32 h-32 border-4 border-[#ff6b4a] rounded-full animate-pulse"></div>
                    </div>
                    <div className="relative">
                      <div className="text-sm text-gray-400 mb-1">{match.date}</div>
                      <div className="text-4xl font-black text-[#ff6b4a] mb-1">{match.time}</div>
                      <div className="text-xs text-gray-500">KICK OFF</div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg transform hover:scale-110 transition-transform">
                      {match.awayTeam.logo}
                    </div>
                    <div className="text-xl font-black text-white">{match.awayTeam.name}</div>
                  </div>
                </div>
              </div>

              {/* Interactive Odds Grid */}
              <div className="px-6 pb-6">
                {/* Column Headers with GOAL Branding */}
                <div className="grid grid-cols-4 gap-3 py-4 border-b-2 border-[#ff6b4a]/30">
                  <div className="text-center">
                    <span className="text-xs text-gray-500 font-bold">BOOKMAKER</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-[#ff6b4a] font-bold">HOME</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-[#ff6b4a] font-bold">DRAW</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-[#ff6b4a] font-bold">AWAY</span>
                  </div>
                </div>

                {/* Interactive Odds Rows */}
                {match.odds.map((odd, oddIdx) => (
                  <div key={oddIdx} className="grid grid-cols-4 gap-3 py-4 border-b border-gray-800 last:border-b-0 hover:bg-white/5 transition-colors rounded-lg">
                    <div className="flex items-center justify-center">
                      <div className={`px-4 py-2 ${odd.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white font-bold rounded-lg text-sm shadow-lg`}>
                        {odd.bookmaker}
                      </div>
                    </div>
                    <button className="group relative text-center">
                      <div className="text-2xl font-black text-white group-hover:text-[#ff6b4a] transition-colors">
                        {odd.home.toFixed(2)}
                      </div>
                      <div className="absolute inset-0 bg-[#ff6b4a] opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
                    </button>
                    <button className="group relative text-center">
                      <div className="text-2xl font-black text-white group-hover:text-[#ff6b4a] transition-colors">
                        {odd.draw.toFixed(2)}
                      </div>
                      <div className="absolute inset-0 bg-[#ff6b4a] opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
                    </button>
                    <button className="group relative text-center">
                      <div className="text-2xl font-black text-white group-hover:text-[#ff6b4a] transition-colors">
                        {odd.away.toFixed(2)}
                      </div>
                      <div className="absolute inset-0 bg-[#ff6b4a] opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
                    </button>
                  </div>
                ))}

                {/* Best Odds Indicator */}
                <div className="mt-4 p-3 bg-gradient-to-r from-[#ff6b4a]/20 to-transparent rounded-lg border-l-4 border-[#ff6b4a]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ff6b4a]" />
                    <span className="text-sm font-semibold text-white">
                      Best Odds: {Math.max(...match.odds.map(o => Math.max(o.home, o.draw, o.away))).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button with GOAL Branding */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#ff6b4a] to-[#ff4a2a] rounded-full text-white text-3xl shadow-2xl hover:shadow-[#ff6b4a]/50 hover:scale-110 transition-all flex items-center justify-center">
        +
      </button>

      {/* GOAL Footer Graphics */}
      <div className="h-2 bg-gradient-to-r from-[#ff6b4a] via-[#ff8a6a] to-[#ff6b4a]"></div>
    </div>
  );
}

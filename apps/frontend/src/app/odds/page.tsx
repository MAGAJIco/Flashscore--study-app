'use client';

import { useState } from 'react';

export default function OddsPage() {
  const [matches, setMatches] = useState([
    {
      league: "Bundesliga",
      homeTeam: { name: "SGE", logo: "🦅" },
      awayTeam: { name: "FCB", logo: "🔴" },
      date: "4 Oct 2025",
      time: "17:30",
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
      odds: [
        { bookmaker: "Betking", home: 1.62, draw: 4.45, away: 4.90, color: "red" },
        { bookmaker: "1XBET", home: 1.60, draw: 4.52, away: 4.82, color: "blue" }
      ]
    }
  ]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-black p-4 border-b-4 border-[#ff6b4a]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white tracking-widest">GOAL</h1>
          <button className="space-y-1.5">
            <div className="w-8 h-0.5 bg-white"></div>
            <div className="w-8 h-0.5 bg-white"></div>
            <div className="w-8 h-0.5 bg-white"></div>
          </button>
        </div>
      </header>

      {/* Matches Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {matches.map((match, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-center text-lg text-gray-400 mb-4">{match.league}</h2>

            <div className="bg-[#2a2a2a] rounded-xl p-6">
              {/* Match Header */}
              <div className="flex justify-around items-center mb-6">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-2">
                    {match.homeTeam.logo}
                  </div>
                  <div className="text-lg font-bold">{match.homeTeam.name}</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="text-sm text-gray-400 mb-1">{match.date}</div>
                  <div className="text-3xl font-bold">{match.time}</div>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-2">
                    {match.awayTeam.logo}
                  </div>
                  <div className="text-lg font-bold">{match.awayTeam.name}</div>
                </div>
              </div>

              {/* Odds Section */}
              <div className="mt-6">
                <div className="flex justify-around py-3 border-b border-gray-700 mb-3">
                  <span className="flex-1 text-center text-sm text-gray-400">Home</span>
                  <span className="flex-1 text-center text-sm text-gray-400">Draw</span>
                  <span className="flex-1 text-center text-sm text-gray-400">Away</span>
                </div>

                {match.odds.map((odd, oddIdx) => (
                  <div key={oddIdx} className="flex items-center py-3 border-b border-gray-700 last:border-b-0">
                    <div className={`w-24 py-2 px-4 ${odd.color === 'red' ? 'bg-red-600' : 'bg-blue-600'} text-white font-bold rounded-md text-center text-sm mr-3`}>
                      {odd.bookmaker}
                    </div>
                    <button className="flex-1 text-center text-lg font-semibold py-2 rounded-md hover:bg-gray-700 transition">
                      {odd.home}
                    </button>
                    <button className="flex-1 text-center text-lg font-semibold py-2 rounded-md hover:bg-gray-700 transition">
                      {odd.draw}
                    </button>
                    <button className="flex-1 text-center text-lg font-semibold py-2 rounded-md hover:bg-gray-700 transition">
                      {odd.away}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-[#ff6b4a] rounded-full text-white text-3xl shadow-lg hover:bg-[#ff5030] hover:scale-105 transition">
        +
      </button>
    </div>
  );
}
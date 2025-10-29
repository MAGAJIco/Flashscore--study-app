
"use client";

import React, { useRef } from 'react';

const LIVE_MATCHES = [
  {
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    watching: '73K',
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: "Q3 5:32",
    score: '89-92',
    watching: '125K',
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'ATP Finals - Semi-final clash',
    time: 'Set 2',
    score: '6-4, 3-3',
    watching: '45K',
  },
  {
    icon: '🏈',
    title: 'Chiefs vs Eagles',
    description: 'NFL - Super Bowl rematch',
    time: "Q2 7:15",
    score: '14-10',
    watching: '210K',
  },
];

export function LiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 340,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          ⚡ Live Matches
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {LIVE_MATCHES.map((match, index) => (
          <div 
            key={index}
            className="min-w-[320px] bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-5 border-2 border-red-500/30 hover:border-red-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-3xl shadow-lg">
                {match.icon}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg" style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}>
                🔴 LIVE
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{match.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{match.description}</p>
            <div className="flex items-center gap-4 text-sm text-white">
              <span className="flex items-center gap-1">⏱️ {match.time}</span>
              <span className="flex items-center gap-1">📊 {match.score}</span>
              <span className="flex items-center gap-1">👥 {match.watching}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

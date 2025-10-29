
"use client";

import React, { useRef } from 'react';

const LIVE_MATCHES = [
  {
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    watching: '73K watching',
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: "Q3 5:32",
    score: '89-92',
    watching: '125K watching',
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'ATP Finals - Semi-final clash',
    time: 'Set 2',
    score: '6-4, 3-3',
    watching: '45K watching',
  },
  {
    icon: '🏈',
    title: 'Chiefs vs Eagles',
    description: 'NFL - Super Bowl rematch',
    time: "Q2 7:15",
    score: '14-10',
    watching: '210K watching',
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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          ⚡ Live Matches
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-xl"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-xl"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {LIVE_MATCHES.map((match, index) => (
          <div 
            key={index}
            className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-red-500 relative"
          >
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse-badge">
              🔴 LIVE
            </span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 shadow-md">
              {match.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {match.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {match.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
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

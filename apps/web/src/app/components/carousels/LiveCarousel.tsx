
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
    venue: 'Old Trafford',
    competition: 'Premier League'
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: "Q3 5:32",
    score: '89-92',
    watching: '125K watching',
    venue: 'Chase Center',
    competition: 'NBA'
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'ATP Finals - Semi-final clash',
    time: 'Set 2',
    score: '6-4, 3-3',
    watching: '45K watching',
    venue: 'Pala Alpitour',
    competition: 'ATP Finals'
  },
  {
    icon: '🏈',
    title: 'Chiefs vs Eagles',
    description: 'NFL - Super Bowl rematch',
    time: "Q2 7:15",
    score: '14-10',
    watching: '210K watching',
    venue: 'Arrowhead Stadium',
    competition: 'NFL'
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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 animate-fadeIn">
          ⚡ Live Matches
          <span className="text-sm font-normal text-gray-300">({LIVE_MATCHES.length})</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-red-500/50 active:scale-95 active:bg-red-600 text-xl font-bold"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-red-500/50 active:scale-95 active:bg-red-600 text-xl font-bold"
            aria-label="Scroll right"
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
            className="min-w-[320px] max-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-transparent hover:border-red-500 relative group overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient border effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: '2px' }}>
              <div className="absolute inset-[2px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl"></div>
            </div>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* LIVE Badge with enhanced pulse */}
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-badge shadow-lg">
              🔴 LIVE
            </span>

            {/* Icon with white background and hover effect */}
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 shadow-md transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              {match.icon}
            </div>

            {/* Title with hover color change */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
              {match.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {match.description}
            </p>

            {/* Metadata - Enhanced */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 hover:scale-110 transition-transform">⏱️ {match.time}</span>
                <span className="flex items-center gap-1 font-bold text-gray-900 hover:scale-110 transition-transform">📊 {match.score}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 hover:scale-110 transition-transform">📍 {match.venue}</span>
                <span className="flex items-center gap-1 hover:scale-110 transition-transform">👥 {match.watching}</span>
              </div>
            </div>

            {/* Competition badge */}
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-md">
              {match.competition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

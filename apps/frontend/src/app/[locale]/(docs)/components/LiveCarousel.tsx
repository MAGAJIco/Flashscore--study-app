
"use client";

import React, { useRef } from 'react';

interface Match {
  id: number;
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

const matches: Match[] = [
  {
    id: 1,
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    viewers: '73K'
  },
  {
    id: 2,
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: 'Q3 5:23',
    score: '98-95',
    viewers: '120K'
  },
  {
    id: 3,
    icon: '🏈',
    title: 'Patriots vs Chiefs',
    description: 'NFL - Championship game intensity',
    time: 'Q2 8:14',
    score: '14-21',
    viewers: '250K'
  },
  {
    id: 4,
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'Wimbledon Final - Epic rally battle',
    time: 'Set 2',
    score: '6-4, 3-4',
    viewers: '89K'
  },
  {
    id: 5,
    icon: '🏏',
    title: 'India vs Australia',
    description: 'Test Cricket - Day 4 decisive moments',
    time: '45.2 overs',
    score: '234/5',
    viewers: '156K'
  }
];

export function LiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 340,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-purple-600 flex items-center gap-3">
          ⚡ Live Matches
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-all hover:scale-110"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-all hover:scale-110"
          >
            →
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {matches.map((match) => (
          <div
            key={match.id}
            className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500 relative"
          >
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              🔴 LIVE
            </span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
              {match.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{match.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{match.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>⏱️ {match.time}</span>
              <span>📊 {match.score}</span>
              <span>👥 {match.viewers} watching</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

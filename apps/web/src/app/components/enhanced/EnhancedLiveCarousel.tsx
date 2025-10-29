"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { MatchDetailModal } from './MatchDetailModal';

interface LiveMatch {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

const liveMatches: LiveMatch[] = [
  {
    id: '1',
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    viewers: '73K watching'
  },
  {
    id: '2',
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: 'Q3 5:23',
    score: '98-95',
    viewers: '120K watching'
  },
  {
    id: '3',
    icon: '🏈',
    title: 'Patriots vs Chiefs',
    description: 'NFL - Championship game intensity',
    time: 'Q2 8:14',
    score: '14-21',
    viewers: '250K watching'
  },
  {
    id: '4',
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'Wimbledon Final - Epic rally battle',
    time: 'Set 2',
    score: '6-4, 3-4',
    viewers: '89K watching'
  },
  {
    id: '5',
    icon: '🏏',
    title: 'India vs Australia',
    description: 'Test Cricket - Day 4 decisive moments',
    time: '45.2 overs',
    score: '234/5',
    viewers: '156K watching'
  },
];

export function EnhancedLiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);
  // const { data: liveMatches, error, isLoading } = useApi<LiveMatch[]>('/api/live-matches');


  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  // if (isLoading) return <p>Loading matches...</p>;
  // if (error) return <p>Error loading matches: {error.message}</p>;

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
            ⚡ Live Matches
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              ←
            </button>
            <button 
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              →
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {liveMatches.map((match) => (
            <div 
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="enhanced-live-card min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-red-500 relative overflow-hidden group"
            >
              <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100"></div>

              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE
              </span>

              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 transform transition-all group-hover:rotate-12 group-hover:scale-110">
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
                <span className="flex items-center gap-1">👥 {match.viewers}</span>
              </div>

              <button className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-indigo-700 transform translate-y-2 group-hover:translate-y-0">
                Share 📤
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedMatch && (
        <MatchDetailModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </>
  );
}
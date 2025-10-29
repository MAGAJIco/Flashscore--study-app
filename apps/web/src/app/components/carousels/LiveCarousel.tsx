
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { liveDataApi, LiveMatch } from '@/lib/api/liveData';

export function LiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await liveDataApi.fetchLiveMatches();
      setMatches(data.length > 0 ? data : getFallbackMatches());
    } catch (error) {
      console.error('Error:', error);
      setMatches(getFallbackMatches());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackMatches = (): LiveMatch[] => [
    {
      id: '1',
      icon: '⚽',
      title: 'Man United vs Arsenal',
      description: 'Premier League - Thrilling match at Old Trafford',
      time: "67'",
      score: '2-1',
      watching: '73K',
      homeTeam: 'Man United',
      awayTeam: 'Arsenal',
      status: 'live',
      league: 'Premier League'
    },
    {
      id: '2',
      icon: '🏀',
      title: 'Lakers vs Warriors',
      description: 'NBA - Western Conference showdown',
      time: "Q3 5:32",
      score: '89-92',
      watching: '125K',
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      status: 'live',
      league: 'NBA'
    }
  ];

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 340,
        behavior: 'smooth',
      });
    }
  };

  const handleMatchClick = (match: LiveMatch) => {
    setSelectedMatch(match);
    // Navigate to match details or open modal
    console.log('Match clicked:', match);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4 w-48"></div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[320px] h-48 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 animate-fadeIn">
            ⚡ Live Matches
            <span className="text-sm font-normal text-gray-300">({matches.length})</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Scroll right"
            >
              →
            </button>
            <button
              onClick={fetchMatches}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Refresh"
              title="Refresh matches"
            >
              🔄
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {matches.map((match, index) => (
            <div 
              key={match.id}
              onClick={() => handleMatchClick(match)}
              className="min-w-[320px] bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-5 border-2 border-red-500/30 hover:border-red-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 cursor-pointer relative overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {match.icon}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg animate-pulse">
                  🔴 LIVE
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                {match.title}
              </h3>
              <p className="text-sm text-gray-300 mb-4">{match.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-white">
                <span className="flex items-center gap-1 hover:scale-110 transition-transform">⏱️ {match.time}</span>
                <span className="flex items-center gap-1 font-bold text-yellow-300 hover:scale-110 transition-transform">📊 {match.score}</span>
                <span className="flex items-center gap-1 hover:scale-110 transition-transform">👥 {match.watching}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/20 text-xs text-gray-400">
                Click for live updates
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMatch && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedMatch(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full border-2 border-red-500 shadow-2xl transform animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white">{selectedMatch.title}</h3>
              <button 
                onClick={() => setSelectedMatch(null)}
                className="text-white hover:text-red-500 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-yellow-300 mb-2">{selectedMatch.score}</div>
              <div className="text-xl text-gray-400">{selectedMatch.time}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-2">Home</div>
                <div className="text-lg">{selectedMatch.homeTeam}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold mb-2">Away</div>
                <div className="text-lg">{selectedMatch.awayTeam}</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-red-500 font-bold animate-pulse">🔴 LIVE - {selectedMatch.watching} watching</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

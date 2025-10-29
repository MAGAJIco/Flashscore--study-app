
"use client";

import React, { useRef } from 'react';

const NEWS_ITEMS = [
  {
    icon: '⚽',
    badge: 'BREAKING',
    title: 'Mbappe Signs Historic Deal',
    description: 'Real Madrid announces record-breaking transfer for French superstar',
    time: '2 hours ago',
    comments: '1.2K',
  },
  {
    icon: '🏀',
    badge: 'NEWS',
    title: 'LeBron Reaches 40K Points',
    description: 'King James makes history with unprecedented milestone achievement',
    time: '5 hours ago',
    comments: '892',
  },
  {
    icon: '🎾',
    badge: 'NEWS',
    title: 'Serena Williams Returns',
    description: 'Tennis legend announces comeback after retirement',
    time: '1 day ago',
    comments: '2.3K',
  },
  {
    icon: '🏈',
    badge: 'BREAKING',
    title: 'NFL Playoff Picture Shakes Up',
    description: 'Unexpected results change conference standings dramatically',
    time: '3 hours ago',
    comments: '567',
  },
];

export function NewsCarousel() {
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
          📰 Latest News
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
        {NEWS_ITEMS.map((news, index) => (
          <div 
            key={index}
            className="min-w-[320px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-5 border-2 border-blue-500/30 hover:border-blue-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 cursor-pointer relative"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-3xl shadow-lg">
                {news.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                news.badge === 'BREAKING' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`} style={news.badge === 'BREAKING' ? {
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              } : {}}>
                {news.badge === 'BREAKING' ? '🔥 BREAKING' : '📰 NEWS'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{news.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{news.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">🕐 {news.time}</span>
              <span className="flex items-center gap-1">💬 {news.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

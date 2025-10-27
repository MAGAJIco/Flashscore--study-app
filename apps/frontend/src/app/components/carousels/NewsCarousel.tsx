
"use client";

import React, { useRef } from 'react';

const newsItems = [
  {
    icon: '⚽',
    title: 'Mbappe Signs Historic Deal',
    description: 'Real Madrid announces record-breaking transfer for French superstar',
    time: '2 hours ago',
    comments: '1.2K comments',
    badge: 'BREAKING'
  },
  {
    icon: '🏀',
    title: 'LeBron Reaches 40K Points',
    description: 'King James makes history with unprecedented milestone achievement',
    time: '5 hours ago',
    comments: '892 comments',
    badge: 'NEWS'
  },
  {
    icon: '🎾',
    title: 'Serena Returns to Court',
    description: 'Tennis legend announces comeback tournament in Miami next month',
    time: '8 hours ago',
    comments: '645 comments',
    badge: 'NEWS'
  },
  {
    icon: '⚾',
    title: 'Yankees Win World Series',
    description: 'First championship in 15 years with dramatic Game 7 victory',
    time: '1 day ago',
    comments: '2.1K comments',
    badge: 'NEWS'
  },
  {
    icon: '🏁',
    title: 'Hamilton Breaks Records',
    description: 'Formula 1 legend secures 8th world championship in Abu Dhabi',
    time: '2 days ago',
    comments: '1.5K comments',
    badge: 'NEWS'
  },
];

export function NewsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
          📰 Latest News
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            ←
          </button>
          <button 
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
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
        {newsItems.map((news, index) => (
          <div 
            key={index}
            className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative"
          >
            <span className={`absolute top-4 right-4 ${news.badge === 'BREAKING' ? 'bg-blue-500' : 'bg-blue-400'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
              {news.badge === 'BREAKING' ? '🔥' : '📰'} {news.badge}
            </span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
              {news.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {news.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {news.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">🕐 {news.time}</span>
              <span className="flex items-center gap-1">💬 {news.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


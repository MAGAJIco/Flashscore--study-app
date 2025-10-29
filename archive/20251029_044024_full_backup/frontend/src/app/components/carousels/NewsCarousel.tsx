"use client";

import React, { useRef, useEffect } from 'react';
import { CarouselCard } from '../cards/CarouselCard';
import { ScrollButton } from '@/components/ui/ScrollButton';
import { NEWS_ITEMS } from '@/lib/constant/mockData';

export function NewsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  // Auto-scroll every 5 seconds with offset timing
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        
        // If at the end, scroll back to start
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📰 Latest News
        </h2>
        <div className="flex gap-2">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
          <ScrollButton direction="right" onClick={() => scroll(1)} />
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
            className="min-w-[300px] bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{news.icon}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                news.badge === 'BREAKING' 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-blue-500 text-white'
              }`}>
                {news.badge === 'BREAKING' ? '🔥 BREAKING' : '📰 NEWS'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{news.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{news.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <span className="flex items-center gap-1">🕐 {news.time}</span>
              <span className="flex items-center gap-1">💬 {news.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
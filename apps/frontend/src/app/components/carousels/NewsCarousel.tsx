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
        <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
          📰 Latest News
        </h2>
        <div className="flex gap-2">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
          <ScrollButton direction="right" onClick={() => scroll(1)} />
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NEWS_ITEMS.map((news, index) => (
          <CarouselCard
            key={index}
            icon={news.icon}
            title={news.title}
            description={news.description}
            badge={{ 
              text: news.badge === 'BREAKING' ? '🔥 BREAKING' : '📰 NEWS', 
              color: news.badge === 'BREAKING' ? 'red' : 'blue' 
            }}
            metadata={[
              { icon: '🕐', text: news.time },
              { icon: '💬', text: news.comments }
            ]}
          />
        ))}
      </div>
    </div>
  );
}
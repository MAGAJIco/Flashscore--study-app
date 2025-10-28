
"use client";

import React, { useRef } from 'react';
import { CarouselCard } from '../cards/CarouselCard';
import { ScrollButton } from '@/components/ui/ScrollButton';
import { LIVE_MATCHES } from '@/lib/constant/mockData';

export function LiveCarousel() {
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
          ⚡ Live Matches
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
        {LIVE_MATCHES.map((match, index) => (
          <CarouselCard
            key={index}
            icon={match.icon}
            title={match.title}
            description={match.description}
            badge={{ text: `🔴 ${match.time}`, color: 'red' }}
            metadata={[
              { icon: '⚽', text: match.score },
              { icon: '👁️', text: match.viewers }
            ]}
          />
        ))}
      </div>
    </div>
  );
}

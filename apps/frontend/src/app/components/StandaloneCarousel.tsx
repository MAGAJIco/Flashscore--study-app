
'use client';

import React, { useRef } from 'react';

interface CarouselCard {
  badge?: string;
  badgeColor?: string;
  icon: string;
  title: string;
  description: string;
  meta?: Array<{ icon: string; text: string }>;
}

interface StandaloneCarouselProps {
  title: string;
  icon: string;
  cards: CarouselCard[];
}

export function StandaloneCarousel({ title, icon, cards }: StandaloneCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-violet-600 flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
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

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-violet-600 relative"
          >
            {/* Badge */}
            {card.badge && (
              <div
                className={`absolute top-4 right-4 ${card.badgeColor || 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold`}
              >
                {card.badge}
              </div>
            )}

            {/* Icon */}
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{card.description}</p>

            {/* Meta */}
            {card.meta && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {card.meta.map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

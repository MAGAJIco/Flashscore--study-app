
"use client";

import React from 'react';
import { DocsCarouselCard } from './DocsCarouselCard';

interface CarouselCardMeta {
  icon: string;
  text: string;
}

interface CarouselCard {
  badge: string;
  badgeType: 'live' | 'news';
  icon: string;
  title: string;
  description: string;
  meta: CarouselCardMeta[];
}

interface DocsCarouselProps {
  title: string;
  icon: string;
  cards: CarouselCard[];
  carouselId: string;
}

export function DocsCarousel({ title, icon, cards, carouselId }: DocsCarouselProps) {
  const scrollCarousel = (direction: number) => {
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      const scrollAmount = 340;
      carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-violet-600 flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollCarousel(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            ←
          </button>
          <button
            onClick={() => scrollCarousel(1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            →
          </button>
        </div>
      </div>
      <div
        id={carouselId}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, idx) => (
          <DocsCarouselCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}

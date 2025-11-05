
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

interface MobileCarouselProps {
  items: CarouselItem[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

export function MobileCarousel({ items, autoScroll = false, autoScrollInterval = 5000 }: MobileCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (!autoScroll || isDragging) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const newIndex = (currentIndex + 1) % items.length;
        const itemWidth = carouselRef.current.scrollWidth / items.length;
        
        carouselRef.current.scrollTo({
          left: newIndex * itemWidth,
          behavior: 'smooth'
        });
        
        setCurrentIndex(newIndex);
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, currentIndex, isDragging, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        className="mobile-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {items.map((item) => (
          <div key={item.id} className="mobile-carousel-item">
            {item.content}
          </div>
        ))}
      </div>
      
      {/* Scroll Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 bg-blue-600' 
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

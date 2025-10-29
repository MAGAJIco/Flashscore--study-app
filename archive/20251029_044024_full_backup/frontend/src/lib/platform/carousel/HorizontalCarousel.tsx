
'use client';

import React from 'react';

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function HorizontalCarousel({ 
  children, 
  className = '' 
}: HorizontalCarouselProps) {
  return (
    <div className={`overflow-x-auto scrollbar-hide ${className}`}>
      <div className="flex gap-4 pb-4">
        {children}
      </div>
    </div>
  );
}

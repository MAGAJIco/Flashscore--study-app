//apps/frontend/src/hooks/useCarousel.ts

("use client");

import { useRef, RefObject } from "react";

export function useCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 340,
        behavior: "smooth",
      });
    }
  };

  return { carouselRef, scroll };
}


"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AdaptiveImageLoaderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

const AdaptiveImageLoader: React.FC<AdaptiveImageLoaderProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  priority = false,
  className = ''
}) => {
  const [quality, setQuality] = useState(75);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect connection speed and adjust quality
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          setQuality(30);
          break;
        case '3g':
          setQuality(50);
          break;
        case '4g':
          setQuality(75);
          break;
        default:
          setQuality(85);
      }
    }
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-lg"></div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        onLoadingComplete={() => setLoading(false)}
        className="rounded-lg object-cover"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export { AdaptiveImageLoader };

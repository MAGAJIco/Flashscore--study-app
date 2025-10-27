
"use client";

import React from 'react';

interface CarouselCardMeta {
  icon: string;
  text: string;
}

interface DocsCarouselCardProps {
  badge: string;
  badgeType: 'live' | 'news';
  icon: string;
  title: string;
  description: string;
  meta: CarouselCardMeta[];
}

export function DocsCarouselCard({
  badge,
  badgeType,
  icon,
  title,
  description,
  meta,
}: DocsCarouselCardProps) {
  const badgeColor = badgeType === 'live' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-violet-600 relative">
      <div className={`absolute top-4 right-4 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full ${badgeType === 'live' ? 'animate-pulse' : ''}`}>
        {badge}
      </div>
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {meta.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

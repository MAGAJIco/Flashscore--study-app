"use client";

import React from "react";

interface CarouselCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: {
    text: string;
    color: "red" | "blue";
  };
  metadata: Array<{
    icon: string;
    text: string;
  }>;
  onClick?: () => void;
}

export function CarouselCard({
  icon,
  title,
  description,
  badge,
  metadata,
  onClick,
}: CarouselCardProps) {
  const badgeColors = {
    red: "bg-red-500 animate-pulse",
    blue: "bg-blue-500",
  };

  return (
    <div
      onClick={onClick}
      className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative"
    >
      {badge && (
        <span
          className={`absolute top-4 right-4 ${badgeColors[badge.color]} text-white px-3 py-1 rounded-full text-xs font-semibold`}
        >
          {badge.text}
        </span>
      )}
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
        {metadata.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            {item.icon} {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}


"use client";

import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  items: string[];
  onClick?: () => void;
}

export function FeatureCard({ icon, title, description, items, onClick }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer"
    >
      <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
        <span className="text-3xl">{icon}</span>
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li 
            key={i}
            className="text-sm text-gray-700 py-2 border-b border-gray-300 last:border-0 transition-all hover:pl-2 hover:text-indigo-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

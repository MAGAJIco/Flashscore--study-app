
'use client';

import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient?: string;
  children?: React.ReactNode;
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient = 'from-gray-50 to-gray-100',
  children,
}: FeatureCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-transparent hover:border-violet-600`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
      {children}
    </div>
  );
}

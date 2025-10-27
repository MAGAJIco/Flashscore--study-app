
"use client";

import React from 'react';

const features = [
  {
    name: 'Portal',
    icon: '🏠',
    description: 'Main dashboard & navigation hub',
    items: ['Landing with feature cards', 'Portal-specific layout']
  },
  {
    name: 'Predictions',
    icon: '🤖',
    description: 'AI Predictions & ML Features',
    items: ['ML interface', 'AI coach assistant', 'Prediction analytics']
  },
  {
    name: 'Live Tracking',
    icon: '⚡',
    description: 'Real-time sports updates',
    items: ['Live match tracker', 'Live scores', 'Live odds updates']
  },
  {
    name: 'Social',
    icon: '👥',
    description: 'Community & engagement',
    items: ['Social feed', 'Friend challenges', 'Live match chat', 'Forum']
  },
  {
    name: 'Kids Mode',
    icon: '🎮',
    description: 'Safe environment for children',
    items: ['Kids dashboard', 'Educational quizzes', 'Learning paths']
  },
  {
    name: 'Rewards',
    icon: '🏆',
    description: 'Achievements & gamification',
    items: ['Achievement system', 'Global rankings', 'Pi Coin management']
  }
];

export function FeatureGrid() {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">📱 Frontend Apps Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500"
          >
            <h3 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
              <span className="text-2xl">{feature.icon}</span>
              {feature.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.items.map((item, j) => (
                <li 
                  key={j}
                  className="text-sm text-gray-700 border-b border-gray-300 pb-2 last:border-0 hover:pl-2 transition-all"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

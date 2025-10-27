
"use client";

import React from 'react';

const features = [
  {
    name: 'Portal',
    icon: '🏠',
    route: '/',
    description: 'Main dashboard & navigation hub',
    status: '✅',
    items: ['Landing with feature cards', 'Portal-specific layout', 'Quick navigation to all apps']
  },
  {
    name: 'Predictions',
    icon: '🤖',
    route: '/ai-predictions',
    description: 'AI Predictions & ML Features',
    status: '✅',
    items: ['ML prediction interface', 'AI coach assistant', 'Prediction analytics', 'Performance tracking']
  },
  {
    name: 'Live Tracking',
    icon: '⚡',
    route: '/live/matches',
    description: 'Real-time sports updates',
    status: '✅',
    items: ['Live match tracker', 'Live scores display', 'Live odds updates', 'Real-time notifications']
  },
  {
    name: 'Social',
    icon: '👥',
    route: '/social/feed',
    description: 'Community & engagement',
    status: '✅',
    items: ['Social feed & streams', 'Community forums', 'Expert follow system', 'User profiles']
  },
  {
    name: 'Kids Mode',
    icon: '🎮',
    route: '/kids',
    description: 'Safe environment for children',
    status: '✅',
    items: ['COPPA-compliant dashboard', 'Educational quizzes', 'Learning paths', 'Parental controls']
  },
  {
    name: 'Rewards',
    icon: '🏆',
    route: '/rewards/achievements',
    description: 'Achievements & gamification',
    status: '✅',
    items: ['Achievement system', 'Global leaderboards', 'Pi Coin wallet', 'Reward tracking']
  },
  {
    name: 'Analytics',
    icon: '📊',
    route: '/analytics',
    description: 'Performance & insights',
    status: '✅',
    items: ['Prediction performance', 'User statistics', 'Trend analysis', 'Advanced metrics']
  },
  {
    name: 'Chat',
    icon: '💬',
    route: '/social/chat',
    description: 'Live match discussions',
    status: '✅',
    items: ['Live match chat rooms', 'Real-time messaging', 'Community discussions', 'Emoji reactions']
  },
  {
    name: 'Challenges',
    icon: '🎯',
    route: '/social/challenges',
    description: 'Friend competitions',
    status: '✅',
    items: ['Friend challenges', 'Head-to-head predictions', 'Challenge leaderboards', 'Reward system']
  }
];

export function FeatureGrid() {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
        📱 All 9 Feature Apps
        <span className="text-sm font-normal text-gray-500">(Interactive App Launcher)</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:-translate-y-2 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-purple-600 flex items-center gap-2">
                <span className="text-3xl group-hover:scale-125 transition-transform">{feature.icon}</span>
                {feature.name}
              </h3>
              <span className="text-lg">{feature.status}</span>
            </div>
            <div className="mb-3">
              <code className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono">
                {feature.route}
              </code>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">{feature.description}</p>
            <div className="bg-white rounded-lg p-3 shadow-inner">
              <p className="text-xs font-semibold text-gray-500 mb-2">Key Features:</p>
              <ul className="space-y-1.5">
                {feature.items.map((item, j) => (
                  <li 
                    key={j}
                    className="text-xs text-gray-700 flex items-start gap-2 hover:text-purple-600 transition-colors"
                  >
                    <span className="text-purple-500 mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
        <h3 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
          🎨 Feature-Based Architecture Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-sm">
            <span className="font-semibold text-purple-600">✅ Organized:</span>
            <p className="text-gray-600">Clear separation of features with dedicated route groups</p>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-purple-600">⚡ Performance:</span>
            <p className="text-gray-600">Route-based code splitting for faster load times</p>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-purple-600">🔧 Maintainable:</span>
            <p className="text-gray-600">Easy to find and update feature-specific code</p>
          </div>
        </div>
      </div>
    </section>
  );
}

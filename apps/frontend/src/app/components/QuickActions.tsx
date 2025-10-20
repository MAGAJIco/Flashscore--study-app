
'use client';

import React from 'react';
import Link from 'next/link';

const QuickActions: React.FC = () => {
  const actions = [
    { title: 'View Predictions', href: '/predictions', icon: '🔮' },
    { title: 'Sports Quiz', href: '/quiz', icon: '❓' },
    { title: 'Live Matches', href: '/matches', icon: '⚽' },
    { title: 'News', href: '/news', icon: '📰' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-sm font-medium">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

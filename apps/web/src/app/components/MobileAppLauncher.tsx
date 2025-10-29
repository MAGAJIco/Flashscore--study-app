
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AppIcon {
  id: string;
  name: string;
  icon: string;
  href: string;
  color: string;
}

export const MobileAppLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const apps: AppIcon[] = [
    { id: 'home', name: 'Home', icon: '🏠', href: '/', color: 'from-blue-500 to-blue-600' },
    { id: 'predictions', name: 'Predictions', icon: '🎯', href: '/predictions', color: 'from-purple-500 to-purple-600' },
    { id: 'live', name: 'Live Matches', icon: '⚽', href: '/live', color: 'from-green-500 to-green-600' },
    { id: 'news', name: 'News', icon: '📰', href: '/news', color: 'from-orange-500 to-orange-600' },
    { id: 'rewards', name: 'Rewards', icon: '🏆', href: '/rewards', color: 'from-yellow-500 to-yellow-600' },
    { id: 'social', name: 'Social', icon: '👥', href: '/social', color: 'from-pink-500 to-pink-600' },
    { id: 'wallet', name: 'Wallet', icon: '🪙', href: '/wallet', color: 'from-amber-500 to-amber-600' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/settings', color: 'from-gray-500 to-gray-600' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-50"
        aria-label="Open app launcher"
      >
        📱
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in">
      <div className="h-full overflow-y-auto p-6 pb-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Apps</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close launcher"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl shadow-lg flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform`}>
                {app.icon}
              </div>
              <span className="text-xs text-white/90 text-center font-medium">
                {app.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">Swipe down to close</p>
        </div>
      </div>
    </div>
  );
};

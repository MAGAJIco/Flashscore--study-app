
"use client";

import React from 'react';
import Link from 'next/link';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const apps = [
  { id: 'portal', name: 'Portal', icon: '🏠', href: '/' },
  { id: 'predictions', name: 'Predictions', icon: '🤖', href: '/predictions' },
  { id: 'live', name: 'Live', icon: '⚡', href: '/live' },
  { id: 'social', name: 'Social', icon: '👥', href: '/social/feed' },
  { id: 'kids', name: 'Kids Mode', icon: '🎮', href: '/kids' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', href: '/rewards/achievements' },
  { id: 'analytics', name: 'Analytics', icon: '📊', href: '/analytics' },
  { id: 'chat', name: 'Chat', icon: '💬', href: '/social/chat' },
  { id: 'empire', name: 'Empire', icon: '👑', href: '/empire' }
];

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />
      <div className="fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 max-h-[480px] overflow-y-auto z-50 animate-slideDown">
        <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b">
          Sports Central Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              onClick={onClose}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl mb-2 text-white">
                {app.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{app.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

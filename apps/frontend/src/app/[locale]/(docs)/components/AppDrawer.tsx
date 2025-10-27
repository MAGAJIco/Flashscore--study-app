
"use client";

import React from 'react';
import Link from 'next/link';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const apps = [
  { id: 'portal', name: 'Portal', icon: '🏠', href: '/', description: 'Main dashboard & navigation' },
  { id: 'predictions', name: 'Predictions', icon: '🤖', href: '/ai-predictions', description: 'AI-powered predictions' },
  { id: 'live', name: 'Live', icon: '⚡', href: '/live/matches', description: 'Live match tracking' },
  { id: 'social', name: 'Social', icon: '👥', href: '/social/feed', description: 'Social feed & community' },
  { id: 'kids', name: 'Kids Mode', icon: '🎮', href: '/kids', description: 'Safe kids environment' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', href: '/rewards/achievements', description: 'Achievements & coins' },
  { id: 'analytics', name: 'Analytics', icon: '📊', href: '/analytics', description: 'Performance analytics' },
  { id: 'chat', name: 'Chat', icon: '💬', href: '/social/chat', description: 'Live match chat' },
  { id: 'challenges', name: 'Challenges', icon: '🎯', href: '/social/challenges', description: 'Friend challenges' }
];

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />
      <div className="fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-6 w-[480px] max-h-[600px] overflow-y-auto z-50 animate-slideDown">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Sports Central Apps</h2>
            <p className="text-sm text-gray-500 mt-1">Access all 9 feature apps</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              onClick={onClose}
              className="group flex flex-col items-center p-4 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all hover:shadow-md"
              title={app.description}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-2 text-white shadow-lg group-hover:scale-110 transition-transform">
                {app.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{app.name}</span>
              <span className="text-[10px] text-gray-500 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{app.description}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Click on any app to navigate instantly
          </p>
        </div>
      </div>
    </>
  );
}

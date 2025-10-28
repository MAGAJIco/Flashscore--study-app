"use client";

import React from 'react';
import Link from 'next/link';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const apps = [
  { id: 'portal', name: 'Portal', icon: '🏠', href: '/en', description: 'Main dashboard' },
  { id: 'predictions', name: 'Predictions', icon: '🤖', href: '/en/ai-predictions', description: 'AI predictions' },
  { id: 'live', name: 'Live', icon: '⚡', href: '/en/live', description: 'Live tracking' },
  { id: 'social', name: 'Social', icon: '👥', href: '/en/feed', description: 'Social hub' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', href: '/en/achievements', description: 'Achievements' },
  { id: 'docs', name: 'Docs', icon: '📚', href: '/en/docs', description: 'Documentation' },
  { id: 'kids', name: 'Kids Mode', icon: '🎮', href: '/en/kids', description: 'Safe environment' },
  { id: 'analytics', name: 'Analytics', icon: '📊', href: '/en/analytics', description: 'Performance analytics' },
  { id: 'chat', name: 'Chat', icon: '💬', href: '/en/chat', description: 'Live chat' }
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
            <p className="text-sm text-gray-500 mt-1">Feature-Based Architecture</p>
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
            🏗️ Feature-Based Routes | 45 Active Components
          </p>
        </div>
      </div>
    </>
  );
}

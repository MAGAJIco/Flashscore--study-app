
"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const apps = [
    { id: 'portal', name: 'Portal', icon: '🏠', href: `/${locale}`, description: 'Main dashboard' },
    { id: 'predictions', name: 'Predictions', icon: '🤖', href: `/${locale}/ai-predictions`, description: 'AI predictions' },
    { id: 'live', name: 'Live', icon: '⚡', href: `/${locale}/matches`, description: 'Live tracking' },
    { id: 'social', name: 'Social', icon: '👥', href: `/${locale}/feed`, description: 'Social hub' },
    { id: 'kids', name: 'Kids Mode', icon: '🎮', href: `/${locale}/kids`, description: 'Safe environment' },
    { id: 'rewards', name: 'Rewards', icon: '🏆', href: `/${locale}/achievements`, description: 'Achievements' },
    { id: 'analytics', name: 'Analytics', icon: '📊', href: `/${locale}/analytics`, description: 'Performance analytics' },
    { id: 'chat', name: 'Chat', icon: '💬', href: `/${locale}/chat`, description: 'Live chat' },
    { id: 'challenges', name: 'Challenges', icon: '🎯', href: `/${locale}/challenges`, description: 'Daily challenges' }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />
      <div className="fixed top-20 right-5 bg-white rounded-2xl shadow-2xl p-6 w-[420px] z-50 animate-slideDown">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800">Sports Central Apps</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              onClick={onClose}
              className="group flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-all"
              title={app.description}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-md group-hover:scale-110 transition-transform">
                {app.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">{app.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

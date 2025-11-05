
"use client";

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const apps = [
  { icon: 'E', name: 'Empire', route: '' },
  { icon: 'P', name: 'Predictions', route: '/predictions' },
  { icon: 'L', name: 'Live', route: '/live' },
  { icon: 'S', name: 'Social', route: '/social/feed' },
  { icon: 'K', name: 'Kids Mode', route: '/kids' },
  { icon: 'R', name: 'Rewards', route: '/achievements' },
  { icon: 'A', name: 'Analytics', route: '/analytics' },
  { icon: 'C', name: 'Chat', route: '/chats' },
  { icon: 'Ch', name: 'Challenges', route: '/challenges' },
];

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const locale = useLocale();
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-20 right-5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5 w-96 max-h-[480px] overflow-y-auto z-50 transition-all border border-gray-200 dark:border-gray-700 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
          Magajico Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app, index) => (
            <Link
              key={index}
              href={`/${locale}${app.route}`}
              onClick={onClose}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-base font-semibold mb-2 text-gray-700 dark:text-gray-200 shadow-sm group-hover:scale-105 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-transform">
                {app.icon}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                {app.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

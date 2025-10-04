
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface AppMenuItem {
  name: string;
  icon: string;
  href: string;
  description: string;
  color: string;
}

const appMenuItems: AppMenuItem[] = [
  { name: 'Home', icon: '🏠', href: '/', description: 'Main Dashboard', color: 'bg-blue-500' },
  { name: 'News', icon: '📰', href: '/news', description: 'Latest Sports News', color: 'bg-green-500' },
  { name: 'Predictions', icon: '📊', href: '/predictions', description: 'AI Predictions', color: 'bg-purple-500' },
  { name: 'Authors', icon: '✍️', href: '/author', description: 'Content Authors', color: 'bg-orange-500' },
  { name: 'Partnerships', icon: '🤝', href: '/partnerships', description: 'Partner Portal', color: 'bg-teal-500' },
  { name: 'Management', icon: '🛠️', href: '/management/users', description: 'Admin Panel', color: 'bg-red-500' },
  { name: 'Analytics', icon: '📈', href: '/management/analytics', description: 'Data Analytics', color: 'bg-indigo-500' },
  { name: 'Privacy', icon: '🔒', href: '/privacy', description: 'Privacy Policy', color: 'bg-gray-500' },
  { name: 'Terms', icon: '📜', href: '/terms', description: 'Terms of Service', color: 'bg-yellow-500' },
];

export default function GoogleStyleMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-700/50 transition-all duration-200 group"
        aria-label="Apps menu"
      >
        <svg 
          className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8-10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8-10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm2 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 mt-2 w-[400px] bg-[#1f2937] rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden" style={{ zIndex: 9999 }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Sports Central Apps</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Grid of Apps */}
              <div className="grid grid-cols-3 gap-3">
                {appMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-white text-xs font-medium text-center">{item.name}</span>
                    <span className="text-gray-400 text-[10px] text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

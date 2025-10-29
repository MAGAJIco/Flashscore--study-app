"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '../enhanced/SearchBar';
import { HelpCenter } from '../modals/HelpCenter';
import { SettingsPanel } from '../modals/SettingsPanel';
import { UserProfileDropdown } from '../dropdowns/UserProfileDropdown';
import { AppDrawer } from './AppDrawer';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  href: string;
  category: 'sports' | 'social' | 'tools' | 'rewards' | 'kids';
  color: string;
  description: string;
  badge?: string;
}

const apps: AppItem[] = [
  { id: 'predictions', name: 'AI Predictions', icon: '🤖', href: '/predictions', category: 'sports', color: 'from-purple-500 to-indigo-600', description: '87% accurate ML predictions', badge: 'AI' },
  { id: 'live', name: 'Live Matches', icon: '⚡', href: '/matches', category: 'sports', color: 'from-emerald-500 to-teal-600', description: 'Real-time tracking', badge: 'LIVE' },
  { id: 'news', name: 'Sports News', icon: '📰', href: '/news', category: 'sports', color: 'from-blue-500 to-cyan-600', description: 'Breaking news worldwide', badge: 'NEW' },
  { id: 'analytics', name: 'Analytics', icon: '📊', href: '/analytics', category: 'tools', color: 'from-violet-500 to-purple-600', description: 'Deep insights', badge: '' },
  { id: 'social', name: 'Social Hub', icon: '👥', href: '/social/feed', category: 'social', color: 'from-pink-500 to-rose-600', description: 'Connect with fans' },
  { id: 'kids', name: 'Kids Mode', icon: '🎮', href: '/kids-mode', category: 'kids', color: 'from-orange-500 to-amber-600', description: 'Safe learning' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', href: '/rewards/achievements', category: 'rewards', color: 'from-yellow-500 to-orange-600', description: 'Earn Pi Coins' },
  { id: 'empire', name: 'Empire', icon: '👑', href: '/empire', category: 'tools', color: 'from-red-500 to-pink-600', description: 'Build your legacy' },
  { id: 'unified', name: 'Dashboard', icon: '🎯', href: '/unified', category: 'tools', color: 'from-indigo-500 to-blue-600', description: 'Unified view' },
  { id: 'portal', name: 'Portal', icon: '🌐', href: '/portal', category: 'tools', color: 'from-cyan-500 to-teal-600', description: 'Quick access' },
];


export function GoogleNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all duration-200"
              >
                <div className="flex flex-col gap-1">
                  <span className="w-5 h-0.5 bg-white rounded"></span>
                  <span className="w-5 h-0.5 bg-white rounded"></span>
                  <span className="w-5 h-0.5 bg-white rounded"></span>
                </div>
              </button>
              <Link href="/en" className="text-xl font-bold text-white flex items-center gap-2">
                👑 Empire Central
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <SearchBar />

              <button 
                onClick={() => setIsHelpOpen(true)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-all relative group"
              >
                ❓
                <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Help
                </span>
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-all relative group"
              >
                ⚙️
                <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Settings
                </span>
              </button>

              <button
                onClick={() => setAppDrawerOpen(!appDrawerOpen)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-all relative group"
              >
                ⋮⋮⋮
                <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Apps
                </span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all hover:scale-110 active:scale-95"
                >
                  SC
                </button>
                {isProfileOpen && <UserProfileDropdown onClose={() => setIsProfileOpen(false)} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AppDrawer isOpen={appDrawerOpen} onClose={() => setAppDrawerOpen(false)} />
      <HelpCenter isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
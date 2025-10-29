
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MicroApp {
  id: string;
  name: string;
  icon: string;
  href: string;
  category: 'sports' | 'social' | 'tools' | 'rewards' | 'kids';
  color: string;
  description: string;
  badge?: string;
}

const MICRO_APPS: MicroApp[] = [
  {
    id: 'predictions',
    name: 'AI Predictions',
    icon: '🤖',
    href: '/en/ai-predictions',
    category: 'sports',
    color: 'from-purple-500 to-indigo-600',
    description: '87% accurate ML predictions',
    badge: 'AI'
  },
  {
    id: 'live',
    name: 'Live Matches',
    icon: '⚡',
    href: '/en/matches',
    category: 'sports',
    color: 'from-emerald-500 to-teal-600',
    description: 'Real-time match tracking',
    badge: 'LIVE'
  },
  {
    id: 'news',
    name: 'Sports News',
    icon: '📰',
    href: '/en/news',
    category: 'sports',
    color: 'from-blue-500 to-cyan-600',
    description: 'Breaking news worldwide'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    href: '/en/analytics',
    category: 'tools',
    color: 'from-violet-500 to-purple-600',
    description: 'Deep performance insights'
  },
  {
    id: 'social',
    name: 'Social Hub',
    icon: '👥',
    href: '/en/feed',
    category: 'social',
    color: 'from-pink-500 to-rose-600',
    description: 'Connect with fans'
  },
  {
    id: 'kids',
    name: 'Kids Mode',
    icon: '🎮',
    href: '/en/kids',
    category: 'kids',
    color: 'from-orange-500 to-amber-600',
    description: 'Safe learning environment'
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: '🏆',
    href: '/en/achievements',
    category: 'rewards',
    color: 'from-yellow-500 to-orange-600',
    description: 'Earn Pi Coins & badges'
  },
  {
    id: 'empire',
    name: 'Empire',
    icon: '👑',
    href: '/en',
    category: 'tools',
    color: 'from-red-500 to-pink-600',
    description: 'Build your sports empire'
  },
  {
    id: 'portal',
    name: 'Portal',
    icon: '🌐',
    href: '/en',
    category: 'tools',
    color: 'from-cyan-500 to-teal-600',
    description: 'Quick access hub'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Apps', icon: '🌟' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'tools', label: 'Tools', icon: '🛠️' },
  { id: 'rewards', label: 'Rewards', icon: '🏆' },
  { id: 'kids', label: 'Kids', icon: '🎮' }
];

export function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open launcher
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, mounted]);

  const filteredApps = MICRO_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <>
      {/* Floating Launch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-20 md:bottom-4 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Open app launcher"
      >
        <svg className="w-6 h-6 text-white transition-transform group-hover:rotate-90" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
        </svg>
      </button>

      {/* Launcher Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Launcher Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto border border-white/20">
              {/* Header */}
              <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">🚀</span>
                    Sports Central
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search apps... (⌘K)"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-white text-gray-900 font-semibold'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                {filteredApps.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredApps.map(app => (
                      <Link
                        key={app.id}
                        href={app.href}
                        onClick={() => setIsOpen(false)}
                        className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-2xl"
                      >
                        {app.badge && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            {app.badge}
                          </div>
                        )}
                        <div className={`w-16 h-16 bg-gradient-to-r ${app.color} rounded-2xl flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                          {app.icon}
                        </div>
                        <h3 className="text-white font-bold text-center mb-1">{app.name}</h3>
                        <p className="text-gray-300 text-xs text-center line-clamp-2">{app.description}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-400 text-lg">No apps found</p>
                    <p className="text-gray-500 text-sm mt-2">Try a different search or category</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white/5 border-t border-white/20 p-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{filteredApps.length} of {MICRO_APPS.length} apps</span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘K</kbd>
                    <span>to open</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

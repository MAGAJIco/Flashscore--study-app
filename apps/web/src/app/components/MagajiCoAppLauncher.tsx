
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface MicroApp {
  id: string;
  name: string;
  icon: string;
  href: string;
  category: 'sports' | 'social' | 'tools' | 'rewards' | 'kids' | 'navigation';
  color: string;
  description: string;
  badge?: string;
  isPrimary?: boolean;
}

const apps: MicroApp[] = [
  // Primary Navigation (from mobile bottom nav)
  {
    id: 'home',
    name: 'Home',
    icon: 'H',
    href: '/en',
    category: 'navigation',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Your sports hub dashboard',
    isPrimary: true
  },
  {
    id: 'predictions',
    name: 'Predictions',
    icon: 'P',
    href: '/en/predictions',
    category: 'navigation',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: '87% accurate ML predictions',
    badge: 'AI',
    isPrimary: true
  },
  {
    id: 'live',
    name: 'Live Matches',
    icon: 'L',
    href: '/en/matches',
    category: 'navigation',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Real-time match tracking',
    badge: 'LIVE',
    isPrimary: true
  },
  {
    id: 'social',
    name: 'Social Hub',
    icon: 'S',
    href: '/en/social/feed',
    category: 'navigation',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Connect with fans worldwide',
    isPrimary: true
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: 'R',
    href: '/en/achievements',
    category: 'navigation',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Earn Pi Coins & badges',
    isPrimary: true
  },
  // Additional Apps
  {
    id: 'news',
    name: 'Sports News',
    icon: 'N',
    href: '/en/news',
    category: 'sports',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Breaking news worldwide'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: 'A',
    href: '/en/analytics',
    category: 'tools',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Deep performance insights'
  },
  {
    id: 'kids',
    name: 'Kids Mode',
    icon: 'K',
    href: '/en/kids',
    category: 'kids',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Safe learning environment'
  },
  {
    id: 'chat',
    name: 'AI Chat',
    icon: 'C',
    href: '/en/chat',
    category: 'tools',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Chat with AI assistant'
  },
  {
    id: 'challenges',
    name: 'Challenges',
    icon: 'Ch',
    href: '/en/challenges',
    category: 'rewards',
    color: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
    description: 'Complete daily challenges'
  }
];

const categories = [
  { id: 'all', label: 'All Apps', icon: '*' },
  { id: 'navigation', label: 'Quick Nav', icon: '→' },
  { id: 'sports', label: 'Sports', icon: 'S' },
  { id: 'social', label: 'Social', icon: 'So' },
  { id: 'tools', label: 'Tools', icon: 'T' },
  { id: 'rewards', label: 'Rewards', icon: 'R' },
  { id: 'kids', label: 'Kids', icon: 'K' }
];

export function MagajiCoAppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted]);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const primaryApps = useMemo(() => apps.filter(app => app.isPrimary), []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Launch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-20 md:bottom-4 z-50 w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105 flex items-center justify-center group"
        aria-label="Open MagajiCo launcher"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200 transition-transform group-hover:rotate-90" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
        </svg>
      </button>

      {/* Quick Access Bottom Nav (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl pb-safe">
        <div className="flex justify-around items-center px-2 py-2">
          {primaryApps.map(app => (
            <Link
              key={app.id}
              href={app.href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all active:scale-95 relative"
            >
              {app.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {app.badge}
                </div>
              )}
              <div className={`w-8 h-8 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center text-xl shadow-md`}>
                {app.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-700">{app.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Launcher Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto border border-gray-200 dark:border-gray-700">

              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-800 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    MagajiCo Sports Central
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-white transition-colors"
                    aria-label="Close launcher"
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
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">→</span>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                  <>
                    {/* Primary Apps Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'navigation') && (
                      <div className="mb-6">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                          <span>🧭</span>
                          Quick Navigation
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                          {primaryApps.filter(app => 
                            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.description.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map(app => (
                            <Link
                              key={app.id}
                              href={app.href}
                              onClick={() => setIsOpen(false)}
                              className="group relative bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl"
                            >
                              {app.badge && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                  {app.badge}
                                </div>
                              )}
                              <div className={`w-12 h-12 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                                {app.icon}
                              </div>
                              <h3 className="text-white font-bold text-center text-sm mb-1">{app.name}</h3>
                              <p className="text-gray-300 text-xs text-center line-clamp-1">{app.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Apps Section */}
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <span>🌟</span>
                      {selectedCategory === 'all' ? 'More Apps' : 'Apps'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredApps.filter(app => !app.isPrimary || selectedCategory !== 'all').map(app => (
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
                  </>
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
                  <span>{filteredApps.length} of {apps.length} apps</span>
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

      <style jsx global>{`
        .pb-safe {
          padding-bottom: max(8px, env(safe-area-inset-bottom));
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

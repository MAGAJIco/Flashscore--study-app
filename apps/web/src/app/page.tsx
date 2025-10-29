"use client";

import React, { useState, useRef } from 'react';
import { EnhancedLiveCarousel } from './components/enhanced/EnhancedLiveCarousel';
import { GoogleNavBar } from './components/layout/GoogleNavBar';
import { AppLauncher } from './components/AppLauncher';
import Link from 'next/link';

interface AppItem {
  icon: string;
  name: string;
  route: string;
}

interface CarouselItem {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  meta: Array<{ icon: string; text: string }>;
}

const APP_DRAWER_ITEMS: AppItem[] = [
  { icon: '👑', name: 'Empire', route: '/en' },
  { icon: '🤖', name: 'Predictions', route: '/en/predictions' },
  { icon: '⚡', name: 'Live', route: '/en/matches' },
  { icon: '👥', name: 'Social', route: '/en/feed' },
  { icon: '🎮', name: 'Kids Mode', route: '/en/kids' },
  { icon: '🏆', name: 'Rewards', route: '/en/achievements' },
  { icon: '📊', name: 'Analytics', route: '/en/analytics' },
  { icon: '💬', name: 'Chat', route: '/en/social/chat' },
  { icon: '🎯', name: 'Challenges', route: '/en/challenges' },
];

const NEWS_ITEMS: CarouselItem[] = [
  {
    icon: '⚽',
    title: 'Mbappe Signs Historic Deal',
    description: 'Real Madrid announces record-breaking transfer for French superstar',
    badge: 'BREAKING',
    badgeColor: 'bg-blue-600',
    meta: [
      { icon: '🕐', text: '2 hours ago' },
      { icon: '💬', text: '1.2K comments' }
    ]
  },
  {
    icon: '🏀',
    title: 'LeBron Reaches 40K Points',
    description: 'King James makes history with unprecedented milestone achievement',
    badge: 'NEWS',
    badgeColor: 'bg-blue-500',
    meta: [
      { icon: '🕐', text: '5 hours ago' },
      { icon: '💬', text: '892 comments' }
    ]
  },
  {
    icon: '🎾',
    title: 'Serena Returns to Court',
    description: 'Tennis legend announces comeback tournament in Miami next month',
    badge: 'NEWS',
    badgeColor: 'bg-blue-500',
    meta: [
      { icon: '🕐', text: '8 hours ago' },
      { icon: '💬', text: '645 comments' }
    ]
  },
];

export default function HomePage() {
  const newsCarouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <GoogleNavBar />
      <AppLauncher />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            🧩 S❤️ Sports Central
          </h1>
          <p className="text-xl text-white/80">
            ✅ Feature-Based Architecture Platform
          </p>
        </div>

        {/* Live Matches Carousel - Enhanced */}
        <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <EnhancedLiveCarousel />
        </div>

        {/* Latest News Carousel */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 text-3xl font-bold">
              <span>📰</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Latest News
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(newsCarouselRef, -1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-all hover:scale-110"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(newsCarouselRef, 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-all hover:scale-110"
              >
                →
              </button>
            </div>
          </div>
          <div 
            ref={newsCarouselRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          >
            {NEWS_ITEMS.map((news, index) => (
              <div
                key={index}
                className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {news.badge && (
                  <span className={`absolute top-4 right-4 ${news.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {news.badge}
                  </span>
                )}
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
                  {news.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {news.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  {news.meta.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      {item.icon} {item.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Apps Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>💥</span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Feature Apps
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APP_DRAWER_ITEMS.map((app, index) => (
              <Link key={index} href={app.route}>
                <div
                  className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer overflow-hidden"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-2">
                    {app.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Feature-based architecture module
                  </p>

                  {index === 0 ? (
                    <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
                      <div className="flex gap-3 pb-2">
                        {['Dashboard', 'Settings', 'Analytics', 'Reports', 'Users'].map((item, i) => (
                          <div
                            key={i}
                            className="min-w-[140px] bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:border-indigo-400 transition-all flex-shrink-0"
                          >
                            <div className="text-2xl mb-1">
                              {i === 0 ? '📊' : i === 1 ? '⚙️' : i === 2 ? '📈' : i === 3 ? '📋' : '👥'}
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{item}</div>
                            <div className="text-xs text-gray-500 mt-1">View {item}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-700 py-2 border-b border-gray-300 transition-all hover:pl-2 hover:text-indigo-600">
                        View {app.name} Dashboard
                      </li>
                      <li className="text-sm text-gray-700 py-2 border-b border-gray-300 transition-all hover:pl-2 hover:text-indigo-600">
                        Manage Settings
                      </li>
                      <li className="text-sm text-gray-700 py-2 transition-all hover:pl-2 hover:text-indigo-600">
                        View Analytics
                      </li>
                    </ul>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white py-8 mt-12 opacity-90 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm">
            © 2025 Sports Central - Feature-Based Architecture Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
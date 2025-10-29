"use client";

import React, { useState, useRef } from 'react';
import { EnhancedLiveCarousel } from './components/enhanced/EnhancedLiveCarousel';
import { GoogleNavBar } from './components/layout/GoogleNavBar';
import { AppLauncher } from './components/AppLauncher';

interface AppItem {
  icon: string;
  name: string;
  route?: string;
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
  { icon: '👑', name: 'Empire', route: '/' },
  { icon: '🤖', name: 'Predictions', route: '/predictions' },
  { icon: '⚡', name: 'Live', route: '/live' },
  { icon: '👥', name: 'Social', route: '/social' },
  { icon: '🎮', name: 'Kids Mode', route: '/kids' },
  { icon: '🏆', name: 'Rewards', route: '/rewards' },
  { icon: '📊', name: 'Analytics', route: '/analytics' },
  { icon: '💬', name: 'Chat', route: '/chat' },
  { icon: '🎯', name: 'Challenges', route: '/challenges' },
];

const LIVE_MATCHES: CarouselItem[] = [
  {
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    badge: '🔴 LIVE',
    badgeColor: 'bg-red-500',
    meta: [
      { icon: '⏱️', text: "67'" },
      { icon: '📊', text: '2-1' },
      { icon: '👥', text: '73K watching' }
    ]
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    badge: '🔴 LIVE',
    badgeColor: 'bg-red-500',
    meta: [
      { icon: '⏱️', text: 'Q3 5:23' },
      { icon: '📊', text: '98-95' },
      { icon: '👥', text: '120K watching' }
    ]
  },
  {
    icon: '🏈',
    title: 'Patriots vs Chiefs',
    description: 'NFL - Championship game intensity',
    badge: '🔴 LIVE',
    badgeColor: 'bg-red-500',
    meta: [
      { icon: '⏱️', text: 'Q2 8:14' },
      { icon: '📊', text: '14-21' },
      { icon: '👥', text: '250K watching' }
    ]
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'Wimbledon Final - Epic rally battle',
    badge: '🔴 LIVE',
    badgeColor: 'bg-red-500',
    meta: [
      { icon: '⏱️', text: 'Set 2' },
      { icon: '📊', text: '6-4, 3-4' },
      { icon: '👥', text: '89K watching' }
    ]
  },
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
        <header className="text-center text-white mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">
            🏗️ Sports Central
          </h1>
          <p className="text-xl opacity-95">
            Feature-Based Architecture Documentation
          </p>
        </header>

        {/* Live Matches Carousel - Enhanced */}
        <div className="mb-8">
          <EnhancedLiveCarousel />
        </div>

        {/* Latest News Carousel */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl">
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
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>📱</span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Feature Apps
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APP_DRAWER_ITEMS.map((app, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg">
                  {app.icon}
                </div>
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Feature-based architecture module
                </p>
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
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white py-8 mt-12 opacity-90">
          <p className="text-sm">
            © 2024 Sports Central - Feature-Based Architecture Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
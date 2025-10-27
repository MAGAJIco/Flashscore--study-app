"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FeatureApp {
  id: string;
  icon: string;
  name: string;
}

interface CarouselCard {
  badge: string;
  badgeType: 'live' | 'news';
  icon: string;
  title: string;
  description: string;
  meta: Array<{ icon: string; text: string }>;
}

export default function InteractiveDocsComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featureApps: FeatureApp[] = [
    { id: 'portal', icon: '🏠', name: 'Portal' },
    { id: 'predictions', icon: '🤖', name: 'Predictions' },
    { id: 'live', icon: '⚡', name: 'Live' },
    { id: 'social', icon: '👥', name: 'Social' },
    { id: 'kids', icon: '🎮', name: 'Kids Mode' },
    { id: 'rewards', icon: '🏆', name: 'Rewards' },
    { id: 'analytics', icon: '📊', name: 'Analytics' },
    { id: 'chat', icon: '💬', name: 'Chat' },
    { id: 'challenges', icon: '🎯', name: 'Challenges' },
  ];

  const liveMatches: CarouselCard[] = [
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '⚽',
      title: 'Man United vs Arsenal',
      description: 'Premier League - Thrilling match at Old Trafford',
      meta: [
        { icon: '⏱️', text: "67'" },
        { icon: '📊', text: '2-1' },
        { icon: '👥', text: '73K watching' },
      ],
    },
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '🏀',
      title: 'Lakers vs Warriors',
      description: 'NBA - Western Conference showdown',
      meta: [
        { icon: '⏱️', text: 'Q3 5:23' },
        { icon: '📊', text: '98-95' },
        { icon: '👥', text: '120K watching' },
      ],
    },
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '🏈',
      title: 'Patriots vs Chiefs',
      description: 'NFL - Championship game intensity',
      meta: [
        { icon: '⏱️', text: 'Q2 8:14' },
        { icon: '📊', text: '14-21' },
        { icon: '👥', text: '250K watching' },
      ],
    },
  ];

  const newsCards: CarouselCard[] = [
    {
      badge: '🔥 BREAKING',
      badgeType: 'news',
      icon: '⚽',
      title: 'Mbappe Signs Historic Deal',
      description: 'Real Madrid announces record-breaking transfer for French superstar',
      meta: [
        { icon: '🕐', text: '2 hours ago' },
        { icon: '💬', text: '1.2K comments' },
      ],
    },
    {
      badge: '📰 NEWS',
      badgeType: 'news',
      icon: '🏀',
      title: 'LeBron Reaches 40K Points',
      description: 'King James makes history with unprecedented milestone achievement',
      meta: [
        { icon: '🕐', text: '5 hours ago' },
        { icon: '💬', text: '892 comments' },
      ],
    },
  ];

  const scrollCarousel = (type: 'live' | 'news', direction: number) => {
    const carouselId = type === 'live' ? 'liveCarousel' : 'newsCarousel';
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      const scrollAmount = 340;
      carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
      {/* Google-Style Navigation */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="w-5 h-0.5 bg-white rounded-sm"></span>
                  <span className="w-5 h-0.5 bg-white rounded-sm"></span>
                  <span className="w-5 h-0.5 bg-white rounded-sm"></span>
                </div>
              </button>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🏗️</span>
                <span className="text-xl font-bold text-white">Sports Central</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                🔍
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                ❓
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                ⚙️
              </button>
              <button
                onClick={() => setAppDrawerOpen(!appDrawerOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="4" cy="4" r="2"/>
                  <circle cx="12" cy="4" r="2"/>
                  <circle cx="20" cy="4" r="2"/>
                  <circle cx="4" cy="12" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="20" cy="12" r="2"/>
                  <circle cx="4" cy="20" r="2"/>
                  <circle cx="12" cy="20" r="2"/>
                  <circle cx="20" cy="20" r="2"/>
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                SC
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* App Drawer Overlay */}
      {appDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setAppDrawerOpen(false)}
        />
      )}

      {/* App Drawer */}
      <div
        className={`fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 max-h-96 overflow-y-auto z-50 transition-all duration-300 ${
          appDrawerOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-200">
          Sports Central Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {featureApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-2 text-white">
                {app.icon}
              </div>
              <div className="text-sm text-center font-medium text-gray-700">{app.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">🏗️ Sports Central</h1>
          <p className="text-xl opacity-95">Feature-Based Architecture Documentation</p>
        </header>

        {/* Live Matches Carousel */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-violet-600 flex items-center gap-2">
              ⚡ Live Matches
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('live', -1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel('live', 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
              >
                →
              </button>
            </div>
          </div>
          <div
            id="liveCarousel"
            className="flex gap-5 overflow-x-auto scroll-smooth pb-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {liveMatches.map((card, idx) => (
              <div
                key={idx}
                className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-violet-600"
              >
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {card.badge}
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {card.meta.map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News Carousel */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-violet-600 flex items-center gap-2">
              📰 Latest News
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('news', -1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel('news', 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
              >
                →
              </button>
            </div>
          </div>
          <div
            id="newsCarousel"
            className="flex gap-5 overflow-x-auto scroll-smooth pb-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newsCards.map((card, idx) => (
              <div
                key={idx}
                className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-violet-600"
              >
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {card.badge}
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {card.meta.map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-violet-600 mb-4">📋 Overview</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Sports Central is organized into feature-based apps within a monorepo structure.
            Each feature app is independent but shares common infrastructure, enabling better
            organization, easier maintenance, and improved performance.
          </p>
        </div>

        {/* Architecture Details */}
        <section className="mb-16 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">🏗️ Complete Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Frontend Structure</h3>
              <pre className="text-green-300 text-xs overflow-x-auto">{`apps/frontend/src/app/[locale]/
├── (portal)/           # Main dashboard
├── (predictions)/      # AI Predictions
├── (live)/            # Live tracking
├── (social)/          # Social features
├── (kids)/            # Kids mode
├── (rewards)/         # Achievements
└── components/        # Shared components`}</pre>
            </div>
            <div className="bg-black/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Backend Modules</h3>
              <pre className="text-blue-300 text-xs overflow-x-auto">{`apps/backend/src/modules/
├── predictions/       # ML predictions
├── matches/          # Live matches
├── social/           # Social features
├── rewards/          # Gamification
└── kids/             # Kids safety`}</pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-white/60 py-8 border-t border-white/20">
          <p className="font-bold">Sports Central v2.0.0</p>
          <p className="text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="text-xs mt-4">All documentation consolidated into InteractiveDocsComponent</p>
        </footer>
      </div>
    </div>
  );
}
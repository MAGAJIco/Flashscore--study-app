
"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface AppItem {
  icon: string;
  name: string;
  route: string;
}

interface CarouselCard {
  badge: string;
  badgeType: 'live' | 'news';
  icon: string;
  title: string;
  description: string;
  meta: Array<{ icon: string; text: string }>;
}

export default function EmpireDocsPage() {
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const liveCarouselRef = useRef<HTMLDivElement>(null);
  const newsCarouselRef = useRef<HTMLDivElement>(null);

  const apps: AppItem[] = [
    { icon: '🏠', name: 'Portal', route: '/en' },
    { icon: '🤖', name: 'Predictions', route: '/en/predictions' },
    { icon: '⚡', name: 'Live', route: '/en/matches' },
    { icon: '👥', name: 'Social', route: '/en/social/feed' },
    { icon: '🎮', name: 'Kids Mode', route: '/en/kids' },
    { icon: '🏆', name: 'Rewards', route: '/en/rewards/achievements' },
    { icon: '📊', name: 'Analytics', route: '/en/analytics' },
    { icon: '💬', name: 'Chat', route: '/en/social/chat' },
    { icon: '🎯', name: 'Challenges', route: '/en/social/challenges' },
  ];

  const liveMatches: CarouselCard[] = [
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '🎾',
      title: 'Djokovic vs Alcaraz',
      description: 'Wimbledon Final - Epic rally battle',
      meta: [
        { icon: '⏱️', text: 'Set 2' },
        { icon: '📊', text: '6-4, 3-4' },
        { icon: '👥', text: '89K watching' }
      ]
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
        { icon: '👥', text: '250K watching' }
      ]
    },
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '⚽',
      title: 'Man United vs Arsenal',
      description: 'Premier League - Old Trafford thriller',
      meta: [
        { icon: '⏱️', text: "67'" },
        { icon: '📊', text: '2-1' },
        { icon: '👥', text: '73K watching' }
      ]
    },
  ];

  const newsCards: CarouselCard[] = [
    {
      badge: 'BREAKING',
      badgeType: 'news',
      icon: '⚽',
      title: 'Mbappe Signs Historic Deal',
      description: 'Real Madrid announces record-breaking transfer',
      meta: [
        { icon: '⏱️', text: '2 hours ago' },
        { icon: '💬', text: '1.2K comments' }
      ]
    },
    {
      badge: 'NEWS',
      badgeType: 'news',
      icon: '🏀',
      title: 'LeBron Reaches 40K Points',
      description: 'King James makes history with milestone',
      meta: [
        { icon: '⏱️', text: '5 hours ago' },
        { icon: '💬', text: '892 comments' }
      ]
    },
  ];

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  const featureApps = [
    {
      icon: '👑',
      title: 'Empire',
      description: 'Command center & navigation hub',
      items: ['Foundation system', 'AI CEO assistant', 'Growth tracking']
    },
    {
      icon: '🤖',
      title: 'Predictions',
      description: 'AI-powered forecasting',
      items: ['ML predictions', 'Confidence scores', 'Historical accuracy']
    },
    {
      icon: '⚡',
      title: 'Live Tracking',
      description: 'Real-time updates',
      items: ['Live matches', 'Live scores', 'Live odds']
    },
    {
      icon: '👥',
      title: 'Social',
      description: 'Community features',
      items: ['Social feed', 'Challenges', 'Chat', 'Forum']
    },
    {
      icon: '🎮',
      title: 'Kids Mode',
      description: 'Safe for children',
      items: ['Parental controls', 'Educational quizzes', 'Safe content']
    },
    {
      icon: '🏆',
      title: 'Rewards',
      description: 'Gamification system',
      items: ['Achievements', 'Leaderboards', 'Pi Coins']
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Google-style Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🏗️</div>
            <div>
              <div className="text-xl font-bold text-indigo-600">Sports Central</div>
              <div className="text-xs text-gray-500">Empire Documentation</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
              🔍
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
              ❓
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
              ⚙️
            </button>
            <button
              onClick={() => setAppDrawerOpen(!appDrawerOpen)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="4" cy="4" r="2" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="20" cy="4" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
                <circle cx="4" cy="20" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="20" cy="20" r="2" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              SC
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
        className={`fixed top-16 right-4 bg-white rounded-2xl shadow-2xl p-6 w-96 z-50 transition-all duration-300 ${
          appDrawerOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-3 border-b">
          Sports Central Apps
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app) => (
            <Link
              key={app.name}
              href={app.route}
              onClick={() => setAppDrawerOpen(false)}
              className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-2">
                {app.icon}
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">
                {app.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center text-white mb-10">
          <h1 className="text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            🏗️ Sports Central
          </h1>
          <p className="text-xl opacity-95">Feature-Based Architecture Documentation</p>
        </div>

        {/* Live Matches Carousel */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              ⚡ Live Matches
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(liveCarouselRef, -1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(liveCarouselRef, 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={liveCarouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {liveMatches.map((match, i) => (
              <div
                key={i}
                className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 relative hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                  {match.badge}
                </span>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-3">
                  {match.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{match.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{match.description}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {match.meta.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      {item.icon} {item.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News Carousel */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              📰 Latest News
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(newsCarouselRef, -1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(newsCarouselRef, 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={newsCarouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {newsCards.map((news, i) => (
              <div
                key={i}
                className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 relative hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {news.badge}
                </span>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-3">
                  {news.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{news.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{news.description}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
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
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">🎯 Feature Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureApps.map((app) => (
              <div
                key={app.title}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-indigo-400"
              >
                <h3 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2">
                  <span className="text-2xl">{app.icon}</span>
                  {app.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                <ul className="space-y-1">
                  {app.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 py-1 border-b border-gray-200 last:border-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">📖 Architecture Overview</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Sports Central is built with a <strong>feature-based architecture</strong> where each app is independent 
            but shares common infrastructure. This modular approach enables better organization, easier maintenance, 
            and flexible deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-gray-900 mb-1">Modular Design</h3>
              <p className="text-sm text-gray-600">Independent features that can be developed separately</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold text-gray-900 mb-1">Reusable Components</h3>
              <p className="text-sm text-gray-600">Shared components across all apps</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-gray-900 mb-1">Performance First</h3>
              <p className="text-sm text-gray-600">Optimized for speed and user experience</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

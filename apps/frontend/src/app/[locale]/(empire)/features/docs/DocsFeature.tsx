
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface CarouselItem {
  icon: string;
  title: string;
  description: string;
  meta: {
    time?: string;
    score?: string;
    watching?: string;
    status?: string;
    comments?: string;
  };
  badge?: {
    text: string;
    type: 'live' | 'news';
  };
}

export function DocsFeature() {
  const t = useTranslations('common');
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);

  const liveMatches: CarouselItem[] = [
    {
      icon: '⚽',
      title: 'Man United vs Arsenal',
      description: 'Premier League - Thrilling match at Old Trafford',
      meta: { time: "67'", score: '2-1', watching: '73K watching' },
      badge: { text: '🔴 LIVE', type: 'live' }
    },
    {
      icon: '🏀',
      title: 'Lakers vs Warriors',
      description: 'NBA - Western Conference showdown',
      meta: { time: 'Q3 5:23', score: '98-95', watching: '120K watching' },
      badge: { text: '🔴 LIVE', type: 'live' }
    },
    {
      icon: '🏈',
      title: 'Patriots vs Chiefs',
      description: 'NFL - Championship game intensity',
      meta: { time: 'Q2 8:14', score: '14-21', watching: '250K watching' },
      badge: { text: '🔴 LIVE', type: 'live' }
    }
  ];

  const latestNews: CarouselItem[] = [
    {
      icon: '⚽',
      title: 'Mbappe Signs Historic Deal',
      description: 'Real Madrid announces record-breaking transfer for French superstar',
      meta: { time: '2 hours ago', comments: '1.2K comments' },
      badge: { text: '🔥 BREAKING', type: 'news' }
    },
    {
      icon: '🏀',
      title: 'LeBron Reaches 40K Points',
      description: 'King James makes history with unprecedented milestone achievement',
      meta: { time: '5 hours ago', comments: '892 comments' },
      badge: { text: '📰 NEWS', type: 'news' }
    }
  ];

  const scrollCarousel = (type: string, direction: number) => {
    const carouselId = type === 'live' ? 'liveCarousel' : 'newsCarousel';
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      carousel.scrollBy({
        left: direction * 340,
        behavior: 'smooth'
      });
    }
  };

  const featureApps = [
    { icon: '🏠', title: 'Portal', description: 'Command center & navigation hub' },
    { icon: '🤖', title: 'Predictions', description: 'AI Predictions & ML Features' },
    { icon: '⚡', title: 'Live', description: 'Real-time sports updates' },
    { icon: '👥', title: 'Social', description: 'Community & engagement' },
    { icon: '🎮', title: 'Kids Mode', description: 'Safe environment for children' },
    { icon: '🏆', title: 'Rewards', description: 'Achievements & gamification' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="text-center py-12 animate-fadeInDown">
        <h1 className="text-5xl font-bold mb-4 text-shadow-lg">🏗️ {t('empire')}</h1>
        <p className="text-xl opacity-95">Feature-Based Architecture Documentation</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Live Matches Carousel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
              <span>⚡</span> Live Matches
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel('live', -1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel('live', 1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                →
              </button>
            </div>
          </div>
          <div
            id="liveCarousel"
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {liveMatches.map((match, idx) => (
              <div
                key={idx}
                className="min-w-[320px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 hover:transform hover:-translate-y-2 transition-all cursor-pointer border-2 border-transparent hover:border-yellow-400"
              >
                {match.badge && (
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                    {match.badge.text}
                  </span>
                )}
                <div className="text-4xl mb-3">{match.icon}</div>
                <h3 className="text-xl font-bold mb-2">{match.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{match.description}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  {match.meta.time && <span>⏱️ {match.meta.time}</span>}
                  {match.meta.score && <span>📊 {match.meta.score}</span>}
                  {match.meta.watching && <span>👥 {match.meta.watching}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News Carousel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
              <span>📰</span> Latest News
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel('news', -1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel('news', 1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                →
              </button>
            </div>
          </div>
          <div
            id="newsCarousel"
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {latestNews.map((news, idx) => (
              <div
                key={idx}
                className="min-w-[320px] bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-5 hover:transform hover:-translate-y-2 transition-all cursor-pointer border-2 border-transparent hover:border-cyan-400"
              >
                {news.badge && (
                  <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                    {news.badge.text}
                  </span>
                )}
                <div className="text-4xl mb-3">{news.icon}</div>
                <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{news.description}</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  {news.meta.time && <span>🕐 {news.meta.time}</span>}
                  {news.meta.comments && <span>💬 {news.meta.comments}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">📋 Overview</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Sports Central is organized into feature-based apps within a monorepo structure. 
            Each feature app is independent but shares common infrastructure, enabling better 
            organization, easier maintenance, and improved performance.
          </p>
        </div>

        {/* Frontend Apps Structure */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6">📱 Frontend Apps Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureApps.map((app, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all cursor-pointer border-2 border-transparent hover:border-yellow-400"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <span className="text-3xl">{app.icon}</span>
                  {app.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{app.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-green-400 mb-6">🚀 Key Benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Better Organization', 'Easier Maintenance', 'Improved Performance', 
              'Team Scalability', 'Independent Testing', 'Flexible Deployment'].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-900 to-teal-900 rounded-lg p-4 text-center font-semibold hover:scale-105 transition-transform"
              >
                ✅ {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

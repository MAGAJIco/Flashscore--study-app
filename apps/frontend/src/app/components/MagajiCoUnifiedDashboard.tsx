
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppCard {
  id: string;
  name: string;
  icon: string;
  href: string;
  description: string;
  color: string;
  badge?: string;
  stats?: {
    label: string;
    value: string;
  };
}

interface LiveMatch {
  id: string;
  sport: string;
  home: string;
  away: string;
  score: string;
  time: string;
  viewers: string;
  league: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  time: string;
  comments: string;
  icon: string;
}

const appCards: AppCard[] = [
  {
    id: 'predictions',
    name: 'AI Predictions',
    icon: '🤖',
    href: '/predictions',
    description: 'ML-powered sports forecasts with 87% accuracy',
    color: 'from-purple-500 to-indigo-600',
    badge: 'AI',
    stats: { label: 'Accuracy', value: '87%' }
  },
  {
    id: 'live',
    name: 'Live Matches',
    icon: '⚡',
    href: '/matches',
    description: 'Real-time match tracking and live scores',
    color: 'from-emerald-500 to-teal-600',
    badge: 'LIVE',
    stats: { label: 'Active', value: '127' }
  },
  {
    id: 'news',
    name: 'Sports News',
    icon: '📰',
    href: '/news',
    description: 'Latest breaking news from around the world',
    color: 'from-blue-500 to-cyan-600',
    badge: 'NEW',
    stats: { label: 'Today', value: '24' }
  },
  {
    id: 'social',
    name: 'Social Hub',
    icon: '👥',
    href: '/social/feed',
    description: 'Connect with sports fans worldwide',
    color: 'from-pink-500 to-rose-600',
    stats: { label: 'Online', value: '2.3K' }
  },
  {
    id: 'kids',
    name: 'Kids Mode',
    icon: '🎮',
    href: '/kids-mode',
    description: 'Safe sports learning for children',
    color: 'from-orange-500 to-amber-600',
    stats: { label: 'Quizzes', value: '150+' }
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: '🏆',
    href: '/rewards/achievements',
    description: 'Earn achievements and Pi Coins',
    color: 'from-yellow-500 to-orange-600',
    stats: { label: 'Coins', value: 'π3,420' }
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    href: '/analytics',
    description: 'Deep insights and performance tracking',
    color: 'from-violet-500 to-purple-600',
    stats: { label: 'Reports', value: '12' }
  },
  {
    id: 'empire',
    name: 'Empire',
    icon: '👑',
    href: '/empire',
    description: 'Build your sports empire',
    color: 'from-red-500 to-pink-600',
    stats: { label: 'Rank', value: '#42' }
  }
];

const liveMatches: LiveMatch[] = [
  {
    id: '1',
    sport: '⚽',
    home: 'Man United',
    away: 'Arsenal',
    score: '2-1',
    time: "67'",
    viewers: '73K',
    league: 'Premier League'
  },
  {
    id: '2',
    sport: '🏀',
    home: 'Lakers',
    away: 'Warriors',
    score: '98-95',
    time: 'Q3 5:23',
    viewers: '120K',
    league: 'NBA'
  },
  {
    id: '3',
    sport: '🎾',
    home: 'Djokovic',
    away: 'Alcaraz',
    score: '6-4, 3-4',
    time: 'Set 2',
    viewers: '89K',
    league: 'Wimbledon'
  }
];

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Mbappe Signs Historic Deal',
    description: 'Real Madrid announces record-breaking transfer',
    category: 'Transfer',
    time: '2h ago',
    comments: '1.2K',
    icon: '⚽'
  },
  {
    id: '2',
    title: 'LeBron Reaches 40K Points',
    description: 'King James makes history with unprecedented milestone',
    category: 'NBA',
    time: '5h ago',
    comments: '892',
    icon: '🏀'
  },
  {
    id: '3',
    title: 'Serena Returns to Court',
    description: 'Tennis legend announces comeback tournament',
    category: 'Tennis',
    time: '8h ago',
    comments: '645',
    icon: '🎾'
  }
];

export function MagajiCoUnifiedDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'overview' | 'apps' | 'live' | 'news'>('overview');
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-32 bg-white/10 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ⚡ Sports Central
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Live Data Active</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <span className="text-cyan-400 text-sm">🪙</span>
                <span className="text-white font-semibold">π3,420</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">
                MC
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: '🏠 Overview', icon: '🏠' },
              { id: 'apps', label: '📱 Apps', icon: '📱' },
              { id: 'live', label: '⚡ Live', icon: '⚡' },
              { id: 'news', label: '📰 News', icon: '📰' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSection(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedSection === tab.id
                    ? 'bg-white text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Overview Section */}
        {selectedSection === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Predictions', value: '1,247', change: '+12%', icon: '🔮' },
                { label: 'Accuracy Rate', value: '78.5%', change: '+3.2%', icon: '🎯' },
                { label: 'Pi Coins', value: 'π3,420', change: '+420', icon: '🪙' },
                { label: 'Live Matches', value: '127', change: 'Now', icon: '⚡' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                  <div className="text-xs text-green-400 mt-1">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Featured Apps Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {appCards.slice(0, 8).map(app => (
                  <Link
                    key={app.id}
                    href={app.href}
                    className="group relative bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {app.badge && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        {app.badge}
                      </div>
                    )}
                    <div className={`w-14 h-14 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      {app.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{app.name}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{app.description}</p>
                    {app.stats && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{app.stats.label}</span>
                        <span className="text-cyan-400 font-bold">{app.stats.value}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Apps Section */}
        {selectedSection === 'apps' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">📱 All Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appCards.map(app => (
                <Link
                  key={app.id}
                  href={app.href}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg flex-shrink-0`}>
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-xl">{app.name}</h3>
                        {app.badge && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{app.description}</p>
                      {app.stats && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">{app.stats.label}:</span>
                          <span className="text-cyan-400 font-bold">{app.stats.value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Live Matches Section */}
        {selectedSection === 'live' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">⚡ Live Matches</h2>
              <div className="flex items-center gap-2 bg-red-500 rounded-full px-4 py-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-white font-bold text-sm">127 LIVE</span>
              </div>
            </div>
            <div className="space-y-4">
              {liveMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{match.sport}</div>
                      <div>
                        <div className="text-xs text-gray-400">{match.league}</div>
                        <div className="text-sm text-cyan-400 font-medium">{match.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/20 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-400 text-xs font-bold">LIVE</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-bold text-lg">{match.home}</div>
                      <div className="text-white font-bold text-lg mt-1">{match.away}</div>
                    </div>
                    <div className="text-center mx-6">
                      <div className="text-3xl font-bold text-cyan-400">{match.score}</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-gray-400 text-sm">👥 {match.viewers}</div>
                      <div className="text-gray-400 text-sm mt-1">watching</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Section */}
        {selectedSection === 'news' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">📰 Latest News</h2>
            <div className="space-y-4">
              {newsItems.map(news => (
                <div
                  key={news.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {news.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {news.category}
                        </span>
                        <span className="text-gray-400 text-xs">{news.time}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">{news.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{news.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>💬 {news.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

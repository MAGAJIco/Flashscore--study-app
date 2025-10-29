
"use client";
import React, { useState, useEffect } from "react";
import { LiveCarousel } from '../components/carousels/LiveCarousel';
import { NewsCarousel } from '../components/carousels/NewsCarousel';
import { GoogleNavBar } from '../components/layout/GoogleNavBar';
import { IOSStyleFeatures } from '../components/IOSStyleFeatures';
import FoundationFeature from "./(empire)/features/foundation/FoundationFeature";
import LeaderboardFeature from "./(empire)/features/leaderboard/LeaderboardFeature";
import AchievementsFeature from "./(empire)/features/achievements/AchievementsFeature";
import { useEmpireVisibility } from '../hooks';
import Link from 'next/link';

type TabType = 'foundation' | 'leaderboard' | 'achievements' | 'analytics' | 'community';

const navigationApps = [
  { id: 'portal', name: 'Portal', icon: '🏠', route: '/en/MagajiCoFoundation' },
  { id: 'empire', name: 'Empire', icon: '👑', route: '/en' },
  { id: 'predictions', name: 'Predictions', icon: '🤖', route: '/en/ai-predictions' },
  { id: 'live', name: 'Live', icon: '⚡', route: '/en/matches' },
  { id: 'social', name: 'Social', icon: '👥', route: '/en/feed' },
  { id: 'authors', name: 'Authors', icon: '✍️', route: '/en/author' },
  { id: 'news', name: 'News', icon: '📰', route: '/en/news' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', route: '/en/achievements' },
  { id: 'analytics', name: 'Analytics', icon: '📊', route: '/en/analytics' },
];

const featureApps = [
  {
    id: 'portal',
    name: 'Portal',
    icon: '🏠',
    description: 'Central hub & navigation',
    routes: ['dashboard/', 'welcome/', 'quick-access/'],
  },
  {
    id: 'predictions',
    name: 'Predictions',
    icon: '🤖',
    description: 'AI-powered forecasting',
    routes: ['matches/', 'confidence/', 'history/'],
  },
  {
    id: 'live',
    name: 'Live',
    icon: '⚡',
    description: 'Real-time match tracking',
    routes: ['scorecard/', 'commentary/', 'highlights/'],
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    description: 'Community & engagement',
    routes: ['feed/', 'challenges/', 'chat/', 'forum/'],
  },
  {
    id: 'kids',
    name: 'Kids Mode',
    icon: '🎮',
    description: 'Safe environment for children',
    routes: ['dashboard/', 'quizzes/', 'learning/'],
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: '🏆',
    description: 'Achievements & gamification',
    routes: ['achievements/', 'leaderboard/', 'coins/'],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'Performance insights',
    routes: ['stats/', 'trends/', 'reports/'],
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: '💬',
    description: 'Live discussions',
    routes: ['rooms/', 'messages/', 'notifications/'],
  },
  {
    id: 'challenges',
    name: 'Challenges',
    icon: '🎯',
    description: 'Competitive tasks',
    routes: ['daily/', 'tournaments/', 'prizes/'],
  },
];

const benefits = [
  'Better Organization',
  'Easier Maintenance',
  'Improved Performance',
  'Team Scalability',
  'Independent Testing',
  'Flexible Deployment',
];

const implementationStatus = [
  {
    title: 'Frontend Route Groups',
    status: 'complete',
    description: 'All feature route groups created with proper layouts and navigation updated',
  },
  {
    title: 'Backend Modules',
    status: 'complete',
    description: 'Module structure created and routes reorganized with feature grouping',
  },
  {
    title: 'Service Layer',
    status: 'progress',
    description: 'Currently refactoring service layers for each module',
  },
  {
    title: 'Testing & Deployment',
    status: 'pending',
    description: 'Feature-specific testing and deployment pipeline setup',
  },
];

const nextSteps = [
  'Move remaining components into feature directories',
  'Create service layers for each module',
  'Add module-specific middleware',
  'Implement feature-specific testing',
];

export default function HomePage() {
  const { isVisible } = useEmpireVisibility();
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('magajico-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('magajico-user-id', id);
      }
      return id;
    }
    return 'guest';
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('foundation');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('current_user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAchievementUnlocked = (achievement: any) => {
    showNotification(`🏆 Achievement Unlocked: ${achievement.title}`, 'success');
  };

  const tabs = [
    { id: 'foundation' as TabType, label: 'Foundation', icon: '🏗️' },
    { id: 'leaderboard' as TabType, label: 'Leaderboard', icon: '🏆' },
    { id: 'achievements' as TabType, label: 'Achievements', icon: '⭐' },
    { id: 'analytics' as TabType, label: 'Analytics', icon: '📊' },
    { id: 'community' as TabType, label: 'Community', icon: '👥' },
  ];

  return (
    <IOSStyleFeatures>
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <GoogleNavBar />

        {notification && (
          <div className="fixed top-20 right-4 z-50 glass-card px-6 py-4 rounded-2xl shadow-2xl animate-slideInRight ios-haptic-light">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <p className="text-white dark:text-gray-100">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-white hover:text-gray-200 ios-haptic-light"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-6">
          <header className="text-center text-white mb-10 animate-fadeInDown">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">
              🏗️ Sports Central Empire
            </h1>
            <p className="text-xl md:text-2xl opacity-95">
              Feature-Based Architecture & Command Center
            </p>
            <Link href="/en/docs" className="mt-4 inline-block">
              <button className="bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                📖 View Architecture Documentation
              </button>
            </Link>
          </header>

          <div className="mb-8 ios-card rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 flex items-center gap-3">
              📖 Overview
            </h2>
            <p className="text-gray-100 dark:text-gray-300 leading-relaxed">
              Sports Central is a production-ready monorepo sports prediction and community platform built with Next.js (Frontend), 
              Fastify (Backend), and FastAPI (ML Service). It features AI-powered predictions, live scores, interactive experiences, 
              and community rewards with iOS-style interactions and dark theme support.
            </p>
          </div>

          <div className="mb-8">
            <LiveCarousel />
          </div>

          <div className="mb-8">
            <NewsCarousel />
          </div>

          <div className="mb-8 ios-card rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 flex items-center gap-3">
              🎯 Feature Apps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureApps.map((app, index) => (
                <div
                  key={app.id}
                  className="ios-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-cyan-400 cursor-pointer ios-haptic-light"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <h3 className="text-2xl font-bold text-cyan-400 dark:text-cyan-300 mb-3 flex items-center gap-2">
                    <span className="text-3xl">{app.icon}</span>
                    {app.name}
                  </h3>
                  <p className="text-gray-200 dark:text-gray-400 mb-4">{app.description}</p>
                  <ul className="space-y-2">
                    {app.routes.map((route, idx) => (
                      <li
                        key={idx}
                        className="text-gray-300 dark:text-gray-500 text-sm py-2 border-b border-gray-700 dark:border-gray-600 last:border-0 hover:text-cyan-400 hover:pl-2 transition-all"
                      >
                        {route}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 ios-card rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-6">
              🚀 Key Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="ios-card p-5 rounded-xl font-semibold text-gray-100 dark:text-gray-300 transition-transform duration-300 hover:scale-105 hover:shadow-lg ios-haptic-light"
                >
                  ✅ {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ios-haptic-medium ${
                  activeTab === tab.id
                    ? 'ios-card bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'ios-card text-gray-200 dark:text-gray-400 hover:scale-105 hover:shadow-md'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className={activeTab === 'foundation' ? 'lg:col-span-2' : 'lg:col-span-3'}>
              {activeTab === 'foundation' && (
                <FoundationFeature 
                  userId={userId} 
                  onNotification={showNotification}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsFeature 
                  currentUser={currentUser}
                  onAchievementUnlocked={handleAchievementUnlocked}
                />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardFeature />
              )}

              {activeTab === 'analytics' && (
                <div className="ios-card rounded-2xl p-8">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
                    📊 Analytics Dashboard
                  </h2>
                  <p className="text-gray-200 dark:text-gray-400 mb-4">Advanced analytics coming soon...</p>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="ios-card rounded-2xl p-8">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-6">
                    👥 Community Features
                  </h2>
                  <p className="text-gray-200 dark:text-gray-400 mb-4">Community features coming soon...</p>
                </div>
              )}
            </div>

            {activeTab === 'foundation' && (
              <div className="lg:col-span-1">
                <LeaderboardFeature />
              </div>
            )}
          </div>

          <footer className="ios-card rounded-2xl p-8 mt-10 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">About Sports Central</h3>
                <p className="text-gray-300 text-sm">
                  AI-powered sports prediction and community platform with real-time analytics.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/en" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</Link></li>
                  <li><Link href="/en/ai-predictions" className="text-gray-300 hover:text-cyan-400 transition-colors">Predictions</Link></li>
                  <li><Link href="/en/matches" className="text-gray-300 hover:text-cyan-400 transition-colors">Live Matches</Link></li>
                  <li><Link href="/en/news" className="text-gray-300 hover:text-cyan-400 transition-colors">News</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/en/privacy" className="text-gray-300 hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/en/terms" className="text-gray-300 hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/en/partnerships" className="text-gray-300 hover:text-cyan-400 transition-colors">Partnerships</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/en/feed" className="text-gray-300 hover:text-cyan-400 transition-colors">Community</Link></li>
                  <li><Link href="/en/author" className="text-gray-300 hover:text-cyan-400 transition-colors">Authors</Link></li>
                  <li><a href="mailto:support@sportscentral.com" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-300 text-sm">
                  © 2025 Sports Central. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs">
                  Sports Central Architecture v2.0.0 | Last Updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </footer>
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

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fadeInDown {
            animation: fadeInDown 0.8s ease;
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease backwards;
          }

          .animate-slideInRight {
            animation: slideInRight 0.3s ease;
          }

          .ios-card {
            background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .ios-haptic-light {
            cursor: pointer;
          }
          .ios-haptic-medium {
            cursor: pointer;
          }

          .glass-card {
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.15);
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </IOSStyleFeatures>
  );
}

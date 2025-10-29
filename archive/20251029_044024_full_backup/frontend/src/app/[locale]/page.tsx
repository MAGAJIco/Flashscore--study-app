"use client";

import React, { useState, useEffect } from "react";
import { LiveCarousel } from '../components/carousels/LiveCarousel';
import { NewsCarousel } from '../components/carousels/NewsCarousel';
import { GoogleNavBar } from '../components/layout/GoogleNavBar';
import { IOSStyleFeatures } from '../components/IOSStyleFeatures';
import Link from 'next/link';

const featureApps = [
  {
    id: 'portal',
    name: 'Portal',
    icon: '🏠',
    description: 'Central hub & navigation',
    route: '/en',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'predictions',
    name: 'Predictions',
    icon: '🤖',
    description: 'AI-powered forecasting',
    route: '/en/ai-predictions',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'live',
    name: 'Live',
    icon: '⚡',
    description: 'Real-time match tracking',
    route: '/en/matches',
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    description: 'Community & engagement',
    route: '/en/feed',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'kids',
    name: 'Kids Mode',
    icon: '🎮',
    description: 'Safe environment for children',
    route: '/en/kids',
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: '🏆',
    description: 'Achievements & gamification',
    route: '/en/achievements',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'Performance insights',
    route: '/en/analytics',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: '💬',
    description: 'Live discussions',
    route: '/en/social/chat',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'challenges',
    name: 'Challenges',
    icon: '🎯',
    description: 'Competitive tasks',
    route: '/en/challenges',
    color: 'from-indigo-500 to-blue-600'
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <IOSStyleFeatures>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <GoogleNavBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Header */}
          <header className="text-center mb-12 animate-fadeIn">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                ⚽
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Sports Central
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Feature-Based Architecture Documentation
                </p>
              </div>
            </div>
          </header>

          {/* Live Matches Carousel */}
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <LiveCarousel />
          </div>

          {/* Latest News Carousel */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <NewsCarousel />
          </div>

          {/* Feature Apps Grid - Exact match to screenshot */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="text-4xl">🎯</span>
                  Feature Apps
                </h2>
                <Link href="/en/docs">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                    📖 View Docs
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureApps.map((app, index) => (
                  <Link key={app.id} href={app.route}>
                    <div
                      className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-600 cursor-pointer overflow-hidden"
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {app.icon}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {app.name}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {app.description}
                        </p>

                        {/* Feature indicator */}
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${app.color} w-3/4 group-hover:w-full transition-all duration-500`} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture Overview */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">🏗️</span>
                Architecture Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-xl">
                      🎨
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frontend</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Next.js 14 App Router with feature-based route groups
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> 9 Feature Apps
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> iOS-Style Interactions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Dark Mode Support
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-xl">
                      ⚡
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Backend</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Fastify REST API with modular architecture
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Module-based Structure
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> MongoDB Integration
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> JWT Authentication
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">ML Service</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    FastAPI with scikit-learn for predictions
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> AI Predictions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Real-time Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Model Training
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-xl">
                      🗄️
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Database</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    MongoDB Atlas for data persistence
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Cloud-hosted
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Auto-scaling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Backup & Recovery
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI-powered sports prediction and community platform with real-time analytics.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/en/ai-predictions" className="text-blue-500 hover:text-blue-600">Predictions</Link></li>
                  <li><Link href="/en/matches" className="text-blue-500 hover:text-blue-600">Live Matches</Link></li>
                  <li><Link href="/en/news" className="text-blue-500 hover:text-blue-600">News</Link></li>
                  <li><Link href="/en/docs" className="text-blue-500 hover:text-blue-600">Documentation</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/en/feed" className="text-blue-500 hover:text-blue-600">Community</Link></li>
                  <li><Link href="/en/author" className="text-blue-500 hover:text-blue-600">Authors</Link></li>
                  <li><a href="mailto:support@sportscentral.com" className="text-blue-500 hover:text-blue-600">Contact</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  © 2025 Sports Central. All rights reserved.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  v2.0.0 | Built with Next.js & Fastify
                </p>
              </div>
            </div>
          </footer>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }

          .animate-slideUp {
            animation: slideUp 0.8s ease forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </IOSStyleFeatures>
  );
}
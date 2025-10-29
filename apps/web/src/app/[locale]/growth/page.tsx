
"use client";

import React from 'react';
import { GoogleNavBar } from '@/app/components/layout/GoogleNavBar';
import { IOSStyleFeatures } from '@/app/components/IOSStyleFeatures';
import Link from 'next/link';

export default function GrowthPage() {
  return (
    <IOSStyleFeatures>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <GoogleNavBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/en" className="hover:text-blue-600 dark:hover:text-blue-400">Empire</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold">Growth</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="text-5xl">📈</span>
              Empire Growth Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Track your prediction performance and grow your empire through sports intelligence
            </p>
          </header>

          {/* Growth Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* AI Coach Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Coach</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Personalized learning</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Get AI-powered insights on your prediction patterns, weaknesses, and personalized improvement paths.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">Pattern Analysis</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">Learning Paths</span>
              </div>
            </div>

            {/* Blockchain Verification Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Blockchain Verified</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Immutable records</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                All predictions cryptographically signed and stored on-chain for transparent, tamper-proof tracking.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold">Immutable</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">Verified</span>
              </div>
            </div>

            {/* Live Probability Tracker */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Tracker</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time probabilities</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Track match probabilities evolving in real-time with trend analysis and visual insights.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold">Live Data</span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">Trends</span>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">More Coming</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Advanced analytics</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Win rates, streaks, achievements, leaderboards, and comprehensive performance tracking.
              </p>
              <Link 
                href="/en" 
                className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
              >
                Return to Empire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </IOSStyleFeatures>
  );
}



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

          {/* Coming Soon Notice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-12 text-center border border-blue-200 dark:border-blue-700 mb-8">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Full Growth Dashboard Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              We're building a comprehensive growth tracking system with win rates, streaks, achievements, and leaderboards. Check back soon!
            </p>
            <Link 
              href="/en" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Return to Empire
            </Link>
          </div>
        </div>
      </div>
    </IOSStyleFeatures>
  );
}


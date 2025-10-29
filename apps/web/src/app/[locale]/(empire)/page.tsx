"use client";

import React, { useState, useEffect } from "react";
import { LiveCarousel } from '@/app/components/carousels/LiveCarousel';
import { NewsCarousel } from '@/app/components/carousels/NewsCarousel';
import { GoogleNavBar } from '@/app/components/layout/GoogleNavBar';
import { IOSStyleFeatures } from '@/app/components/IOSStyleFeatures';
import FoundationFeature from "./features/foundation/FoundationFeature";
import LeaderboardFeature from "./features/leaderboard/LeaderboardFeature";
import AchievementsFeature from "./features/achievements/AchievementsFeature";
import Link from 'next/link';
import { ImplementationTimeline } from '@/app/components/sections/ImplementationTimeline';
import { BenefitsGrid } from '@/app/components/sections/BenefitsGrid';
import { AppRoutesGrid } from '@/app/components/sections/AppRoutesGrid';

type TabType = 'foundation' | 'leaderboard' | 'achievements';

export default function EmpirePage() {
  const [activeTab, setActiveTab] = useState<TabType>('foundation');
  const [userId, setUserId] = useState<string>('guest');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('magajico-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('magajico-user-id', id);
      }
      setUserId(id);
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <IOSStyleFeatures>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <GoogleNavBar />

        {notification && (
          <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Empire Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                👑
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-white">
                  Empire Central
                </h1>
                <p className="text-lg text-gray-300">
                  Build Your Sports Prediction Empire
                </p>
              </div>
            </div>
          </header>

          {/* Live Matches Carousel */}
          <div className="mb-6">
            <LiveCarousel />
          </div>

          {/* Latest News Carousel */}
          <div className="mb-8">
            <NewsCarousel />
          </div>

          {/* Empire Tabs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex gap-4 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('foundation')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'foundation'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🏗️ Foundation
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🎯 Achievements
              </button>
            </div>

            <div className="mt-6">
              {activeTab === 'foundation' && <FoundationFeature userId={userId} onNotification={showNotification} />}
              {activeTab === 'leaderboard' && <LeaderboardFeature />}
              {activeTab === 'achievements' && <AchievementsFeature userId={userId} onNotification={showNotification} />}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/ai-predictions">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-xl font-bold text-white mb-2">AI Predictions</h3>
                <p className="text-gray-300 text-sm">Get ML-powered match predictions</p>
              </div>
            </Link>
            <Link href="/matches">
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 hover:border-red-500 transition-all cursor-pointer">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Live Matches</h3>
                <p className="text-gray-300 text-sm">Track real-time match updates</p>
              </div>
            </Link>
            <Link href="/feed">
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-xl font-bold text-white mb-2">Social Feed</h3>
                <p className="text-gray-300 text-sm">Connect with the community</p>
              </div>
            </Link>
          </div>

          {/* iOS-Style Features */}
          <div className="mb-12">
            <IOSStyleFeatures />
          </div>

          {/* Implementation Timeline */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <ImplementationTimeline />
          </div>

          {/* Key Benefits Grid */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <BenefitsGrid />
          </div>

          {/* App Routes Grid */}
          <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <AppRoutesGrid />
          </div>
        </div>
      </div>
    </IOSStyleFeatures>
  );
}
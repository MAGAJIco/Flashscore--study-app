"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        <section className="text-center space-y-6 mb-12 text-white">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            🏗️ Sports Central
          </h1>
          <p className="text-xl md:text-2xl opacity-95">
            Your Ultimate Sports Prediction & Analytics Platform
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                🏠
              </div>
              <h3 className="text-xl font-bold text-gray-800">Portal Dashboard</h3>
            </div>
            <p className="text-gray-600">Access all your sports data and predictions in one place</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-2xl">
                🤖
              </div>
              <h3 className="text-xl font-bold text-gray-800">ML Predictions</h3>
            </div>
            <p className="text-gray-600">AI-powered predictions for upcoming matches</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-800">Live Matches</h3>
            </div>
            <p className="text-gray-600">Real-time scores and match tracking</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-800">Analytics</h3>
            </div>
            <p className="text-gray-600">Deep dive into sports statistics and trends</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center text-2xl">
                👥
              </div>
              <h3 className="text-xl font-bold text-gray-800">Social Hub</h3>
            </div>
            <p className="text-gray-600">Connect with other sports enthusiasts</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-2xl">
                📰
              </div>
              <h3 className="text-xl font-bold text-gray-800">News Feed</h3>
            </div>
            <p className="text-gray-600">Latest sports news and updates</p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🔴 Live Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-600 font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  LIVE
                </span>
                <span className="text-gray-600 text-sm">67'</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">⚽ Man United</span>
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">⚽ Arsenal</span>
                  <span className="text-2xl font-bold">1</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Premier League</p>
            </div>

            <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-600 font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  LIVE
                </span>
                <span className="text-gray-600 text-sm">Q3 5:23</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">🏀 Lakers</span>
                  <span className="text-2xl font-bold">98</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">🏀 Warriors</span>
                  <span className="text-2xl font-bold">95</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">NBA</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-white pb-8">
          <p className="text-lg opacity-90">
            Powered by Machine Learning • Real-time Data • Community Driven
          </p>
        </div>
      </div>
    </div>
  );
}

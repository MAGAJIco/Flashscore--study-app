"use client";

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import HorizontalCarousel from './components/HorizontalCarousel';
import ComprehensiveSportsHub from "@/app/components/ComprehensiveSportsHub";
import AuthorsSidebar from "@/app/components/AuthorsSidebar";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import NavBar from "@/app/components/NavBar";
import Link from "next/link";
import ChessboardCompetitiveAnalysis from "./components/ChessboardCompetitiveAnalysis";

export default function HomePage() {
  const [liveStats, setLiveStats] = useState({
    activeUsers: 2341,
    predictions24h: 8547,
    accuracyRate: 78.5,
    topStreak: 12
  });

  const [currentFeature, setCurrentFeature] = useState(0);

  const featuredPreviews = [
    {
      title: "AI-Powered Predictions",
      description: "Get 87% accurate predictions with our advanced ML models",
      icon: "🤖",
      link: "/empire/ai-ceo",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Live Match Tracking",
      description: "Real-time updates and analytics for every game",
      icon: "⚡",
      link: "/predictions",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Achievement System",
      description: "Earn badges and climb the leaderboard",
      icon: "🏆",
      link: "/features",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Kids Safe Mode",
      description: "COPPA-compliant safe environment for young users",
      icon: "🛡️",
      link: "/privacy",
      color: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % featuredPreviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <NavBar />
      <AuthorsSidebar />

      <div className="ml-80 mt-16">
        {/* Hero Section with Live Stats */}
        <section className="relative overflow-hidden py-12 px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30"></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🏆 SPORTS CENTRAL
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                AI-Powered Sports Intelligence • Live • Accurate • Profitable
              </p>

              {/* Live Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">{liveStats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2 animate-pulse"></div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600">{liveStats.predictions24h.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Predictions (24h)</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-green-600">{liveStats.accuracyRate}%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-orange-600">{liveStats.topStreak}</div>
                  <div className="text-sm text-gray-600">Top Streak Today</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Feature Preview Carousel */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ✨ Explore Our Features
            </h2>

            <div className="relative h-64 mb-8">
              {featuredPreviews.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === currentFeature
                      ? 'opacity-100 translate-x-0'
                      : index < currentFeature
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <Link href={feature.link}>
                    <div className="bg-white rounded-3xl p-8 h-full flex items-center justify-between cursor-pointer transform hover:scale-105 transition-transform shadow-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="text-6xl mb-4">{feature.icon}</div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-lg text-gray-600">{feature.description}</p>
                        <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition shadow-sm">
                          Try Now →
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-3">
              {featuredPreviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`h-3 rounded-full transition-all touch-manipulation ${
                    index === currentFeature ? 'w-12 bg-blue-600' : 'w-3 bg-gray-300'
                  }`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    minWidth: index === currentFeature ? '48px' : '24px',
                    minHeight: '24px'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/predictions" className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-blue-600 active:border-blue-700 transition-all transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation shadow-sm" style={{ WebkitTapHighlightColor: 'transparent', minHeight: '120px' }}>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Make Predictions</h3>
                <p className="text-gray-600 text-sm">Start predicting and earn rewards</p>
              </Link>

              <Link href="/features" className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-indigo-600 active:border-indigo-700 transition-all transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation shadow-sm" style={{ WebkitTapHighlightColor: 'transparent', minHeight: '120px' }}>
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Explore Features</h3>
                <p className="text-gray-600 text-sm">Discover all available tools</p>
              </Link>

              <Link href="/empire" className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-orange-600 active:border-orange-700 transition-all transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation shadow-sm" style={{ WebkitTapHighlightColor: 'transparent', minHeight: '120px' }}>
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Join Empire</h3>
                <p className="text-gray-600 text-sm">Build the future together</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-12 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              🌟 Join 1000+ Winning Predictors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">87%</div>
                <div className="text-gray-600">Average Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">Predictions Made</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-gray-600">Live Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <HorizontalCarousel />

          {/* Chess Analysis Section */}
          <div className="mb-8">
            <ChessboardCompetitiveAnalysis />
          </div>

          <TopPredictions />
        </div>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Winning? 🚀
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of users making accurate predictions with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all touch-manipulation shadow-lg" style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}>
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 font-bold text-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation shadow-sm" style={{ WebkitTapHighlightColor: 'transparent', minHeight: '56px' }}>
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import MagajiCoManager from "./components/MagajiCoManager";
import PredictionPreview from "./components/PredictionPreview";
import PreviewManager from "./components/PreviewManager";
import SmartPersonalization from "./components/SmartPersonalization";
import PredictionLeague from "./components/PredictionLeague";
import SocialHub from "./components/SocialHub";
import MobileAdvancedFeatures from "./components/MobileAdvancedFeatures";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import OptimizedDashboard from "./components/OptimizedDashboard";
import PerformanceOptimizer from "./components/PerformanceOptimizer";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [isLoaded, setIsLoaded] = useState(false);
  const [useOptimizedView, setUseOptimizedView] = useState(false);

  useEffect(() => {
    // Smooth loading animation
    setTimeout(() => setIsLoaded(true), 100);

    // Test backend health endpoint
    fetch("/api/backend/health")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setBackendStatus("✅ Connected"))
      .catch(() => setBackendStatus("❌ Disconnected"));
  }, []);

  // Debug effect to track toggle state
  useEffect(() => {
    console.log('Dashboard view changed to:', useOptimizedView ? 'Optimized' : 'Standard');
  }, [useOptimizedView]);

  return (
    <div
      className={`min-h-screen text-white font-sans transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Enhanced Background with Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header */}
        <header className="text-center mb-12 animate-slide-in-elegant">
          <div className="inline-block p-6 rounded-3xl glass-card mb-6 relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              ⚽ MagajiCo
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-medium">
              Smart Football Predictions Platform
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full"></div>

            {/* Dashboard View Toggle - Fixed */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  console.log('Toggle clicked, current state:', useOptimizedView);
                  setUseOptimizedView(!useOptimizedView);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                  useOptimizedView 
                    ? 'bg-green-500/30 text-green-300 border-2 border-green-500/50 shadow-green-500/20' 
                    : 'bg-blue-500/30 text-blue-300 border-2 border-blue-500/50 shadow-blue-500/20'
                }`}
                title={`Switch to ${useOptimizedView ? 'Standard' : 'Optimized'} view`}
              >
                {useOptimizedView ? '⚡ Optimized Mode' : '📊 Standard Mode'}
              </button>
            </div>
          </div>
        </header>

        {/* Conditional Dashboard Rendering - Fixed */}
        {useOptimizedView ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                ⚡ Optimized Dashboard Active
              </div>
            </div>
            <OptimizedDashboard />
            <PerformanceOptimizer />
          </div>
        ) : (
          /* Standard Dashboard Grid */
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                📊 Standard Dashboard Active
              </div>
            </div>
          {/* Key Metrics Row - Above the fold content */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {/* System Status Card - Optimized */}
            <div className="glass-card p-6 hover-lift group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                  🖥️
                </div>
                <h2 className="text-xl font-bold">System Health</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300 text-sm">Backend</span>
                  <span
                    className={`font-semibold text-sm ${backendStatus.includes("✅") ? "text-green-400" : "text-red-400"}`}
                  >
                    {backendStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300 text-sm">Frontend</span>
                  <span className="text-green-400 font-semibold text-sm">✅ Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300 text-sm">AI Engine</span>
                  <span className="text-blue-400 font-semibold text-sm">🤖 Learning</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-6 hover-lift group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl">
                  📊
                </div>
                <h2 className="text-xl font-bold">Today's Stats</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Predictions</span>
                  <span className="text-green-400 font-bold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Accuracy</span>
                  <span className="text-blue-400 font-bold">78.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Active Users</span>
                  <span className="text-purple-400 font-bold">2.3K</span>
                </div>
              </div>
            </div>

            {/* Quick Actions - Streamlined */}
            <div className="glass-card p-6 hover-lift group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl">
                  ⚡
                </div>
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <button className="w-full ios-button bg-gradient-to-r from-blue-600 to-blue-700 py-2 text-sm">
                  🔮 View Predictions
                </button>
                <button className="w-full ios-button bg-gradient-to-r from-green-600 to-green-700 py-2 text-sm">
                  💰 Pi Wallet
                </button>
                <button className="w-full ios-button bg-gradient-to-r from-purple-600 to-purple-700 py-2 text-sm">
                  🏆 Leaderboard
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Lazy loaded */}
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <PredictionPreview />
            </div>
            <div className="space-y-6">
              <PreviewManager />

              {/* Enhanced Features Card */}
              <div className="glass-card p-6 hover-lift group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">
                    ✨
                  </div>
                  <h2 className="text-xl font-bold">Platform Features</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-blue-400 text-lg">🤖</span>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">AI Predictions</div>
                      <div className="text-gray-400 text-xs">Machine learning powered</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-green-400 text-lg">💰</span>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">Pi Coin Rewards</div>
                      <div className="text-gray-400 text-xs">Earn while you predict</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-purple-400 text-lg">🧠</span>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">Sports Quizzes</div>
                      <div className="text-gray-400 text-xs">Test your knowledge</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features - Lazy loaded section */}
          <div className="space-y-6">
            <SmartPersonalization />
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
              <PredictionLeague />
              <SocialHub />
            </div>
            <AdvancedAnalytics />
            <MobileAdvancedFeatures />
          </div>
        </div>
        )}  {/* End conditional rendering */}

        {/* Enhanced Footer */}
        <footer className="text-center mt-16 opacity-80">
          <div className="inline-block p-4 rounded-2xl glass-card">
            <p className="text-lg font-medium">
              🏆 Powered by MagajiCo Technology | Next.js + Fastify
            </p>
          </div>
        </footer>

        <MagajiCoManager />
      </div>
    </div>
  );
}
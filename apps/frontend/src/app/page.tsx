// apps/frontend/src/app/page.tsx
"use client";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import HorizontalCarousel from "./components/HorizontalCarousel";
import PWAInstaller from "./components/PWAInstaller";
import Navbar from "./components/NavBar";
import IOSInterface from "./components/iOSInterface";
import AppDrawer from "./components/AppDrawer";
import EchoSystem from "./components/EchoSystem";

const AdvancedAnalytics = dynamic(() => import('./components/AdvancedAnalytics'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Loading analytics...</div>
});

const LiveMatchProbabilityTracker = dynamic(() => import('./components/LiveMatchProbabilityTracker'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Loading live tracker...</div>
});

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'predictions'>('overview');

  const dashboardStats = [
    { label: 'Active Users', value: '2,341', change: '+12.5%', icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Predictions Today', value: '847', change: '+8.3%', icon: '🎯', color: 'from-purple-500 to-purple-600' },
    { label: 'Accuracy Rate', value: '78.5%', change: '+2.1%', icon: '📈', color: 'from-green-500 to-green-600' },
    { label: 'Pi Coins Earned', value: '3,420', change: '+420', icon: '💰', color: 'from-yellow-500 to-yellow-600' },
  ];

  const quickActions = [
    { label: 'View Predictions', icon: '🔮', href: '/predictions', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { label: 'Check Leaderboard', icon: '🏆', href: '/leaderboard', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { label: 'Latest News', icon: '📰', href: '/news', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { label: 'Your Wallet', icon: '💎', href: '/wallet', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  ];

  const recentActivity = [
    { time: '2 min ago', action: 'New prediction made', detail: 'Lakers vs Warriors - 78% confidence', type: 'prediction' },
    { time: '15 min ago', action: 'Pi coins earned', detail: '+25 π from correct prediction', type: 'reward' },
    { time: '1 hour ago', action: 'Quiz completed', detail: 'NBA Statistics Quiz - 90% score', type: 'quiz' },
    { time: '3 hours ago', action: 'Rank updated', detail: 'Moved to #127 in Premier League', type: 'rank' },
  ];

  return (
    <IOSInterface showStatusBar={true} enableHapticFeedback={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <AppDrawer />
        <Navbar />

        <div className="pt-16">
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-white/10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative max-w-7xl mx-auto px-4 py-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-blue-200 text-sm font-medium">Live Dashboard</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Sports Central
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  AI-powered predictions, live scores, and community rewards
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-wrap gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'predictions', label: 'Predictions', icon: '🎯' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Stats Grid */}
          <div className="max-w-7xl mx-auto px-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" 
                       style={{ background: `linear-gradient(to right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{stat.icon}</span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        stat.change.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-7xl mx-auto px-4 pb-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className={`${action.color} rounded-xl p-6 text-white font-semibold text-center hover:scale-105 transition-transform duration-300 shadow-lg group`}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                    <div className="text-sm">{action.label}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'overview' && (
            <div className="max-w-7xl mx-auto px-4 pb-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>🕒</span> Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          activity.type === 'prediction' ? 'bg-blue-500/20' :
                          activity.type === 'reward' ? 'bg-green-500/20' :
                          activity.type === 'quiz' ? 'bg-purple-500/20' : 'bg-orange-500/20'
                        }`}>
                          {activity.type === 'prediction' ? '🎯' :
                           activity.type === 'reward' ? '💰' :
                           activity.type === 'quiz' ? '🧠' : '🏆'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm truncate">{activity.detail}</p>
                        </div>
                        <span className="text-gray-500 text-xs whitespace-nowrap">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>🎯</span> Insights
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 text-xl">📈</span>
                        <span className="text-green-400 font-semibold">Streak Alert</span>
                      </div>
                      <p className="text-green-300 text-sm">You're on a 7-day prediction streak!</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 text-xl">🎯</span>
                        <span className="text-blue-400 font-semibold">Top Performance</span>
                      </div>
                      <p className="text-blue-300 text-sm">Your NBA predictions are 85% accurate</p>
                    </div>
                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-400 text-xl">🏆</span>
                        <span className="text-purple-400 font-semibold">Rising Star</span>
                      </div>
                      <p className="text-purple-300 text-sm">Climbed 23 positions this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <section className="max-w-7xl mx-auto px-4 pb-6">
              <AdvancedAnalytics />
            </section>
          )}

          {activeTab === 'predictions' && (
            <section className="max-w-7xl mx-auto px-4 pb-6">
              <LiveMatchProbabilityTracker />
            </section>
          )}

          {/* Carousel Section */}
          <section className="max-w-7xl mx-auto px-4 pb-6">
            <HorizontalCarousel />
          </section>

          <PWAInstaller />
          <EchoSystem position="top-right" maxNotifications={5} autoHideDuration={5000} />
        </div>
      </div>
    </IOSInterface>
  );
}
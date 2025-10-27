
"use client";

import React, { useState } from 'react';
import { OptimizedDashboard } from '@/app/components/OptimizedDashboard';
import { MagajiCoAppLauncher } from '@/app/components/MagajiCoAppLauncher';
import { MagajiCoCommandCenter } from '@/app/components/MagajiCoCommandCenter';
import Link from 'next/link';
import { Menu, X, Home, Book, Zap, Code } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FeatureApp {
  id: string;
  name: string;
  icon: string;
  route: string;
  description: string;
  color: string;
  status: 'live' | 'beta' | 'planned';
}

const featureApps: FeatureApp[] = [
  { id: 'portal', name: 'Portal', icon: '🏠', route: '/', description: 'Main dashboard hub', color: 'from-blue-500 to-cyan-500', status: 'live' },
  { id: 'predictions', name: 'AI Predictions', icon: '🤖', route: '/predictions', description: 'ML-powered forecasts', color: 'from-purple-500 to-indigo-500', status: 'live' },
  { id: 'live', name: 'Live Tracking', icon: '⚡', route: '/matches', description: 'Real-time scores', color: 'from-green-500 to-emerald-500', status: 'live' },
  { id: 'social', name: 'Social Hub', icon: '👥', route: '/social/feed', description: 'Community & friends', color: 'from-pink-500 to-rose-500', status: 'live' },
  { id: 'kids', name: 'Kids Mode', icon: '🎮', route: '/kids', description: 'Safe learning', color: 'from-orange-500 to-amber-500', status: 'live' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', route: '/rewards/achievements', description: 'Earn & achieve', color: 'from-yellow-500 to-orange-500', status: 'live' },
  { id: 'analytics', name: 'Analytics', icon: '📊', route: '/analytics', description: 'Performance insights', color: 'from-blue-500 to-purple-500', status: 'live' },
  { id: 'news', name: 'News', icon: '📰', route: '/news', description: 'Sports updates', color: 'from-teal-500 to-cyan-500', status: 'live' },
  { id: 'empire', name: 'Empire Builder', icon: '👑', route: '/empire', description: 'Build your legacy', color: 'from-red-500 to-pink-500', status: 'beta' },
];

export default function HomePage() {
  const [showDocs, setShowDocs] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('common');

  if (showDocs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
        {/* Google-Style Navigation */}
        <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
                <button onClick={() => setShowDocs(false)} className="flex items-center gap-2">
                  <span className="text-2xl">⚽</span>
                  <span className="text-xl font-bold text-white">Sports Central</span>
                </button>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => setShowDocs(false)} className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button onClick={() => setShowDocs(true)} className="text-white hover:text-white transition-colors flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  <span>Docs</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Side Menu */}
        {menuOpen && (
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 z-40 overflow-y-auto">
            <div className="p-6 space-y-2">
              <a href="#overview" className="block px-4 py-2 rounded-lg hover:bg-white/20 text-white transition-colors">
                Overview
              </a>
              <a href="#features" className="block px-4 py-2 rounded-lg hover:bg-white/20 text-white transition-colors">
                Feature Apps
              </a>
              <a href="#architecture" className="block px-4 py-2 rounded-lg hover:bg-white/20 text-white transition-colors">
                Architecture
              </a>
              <a href="#api" className="block px-4 py-2 rounded-lg hover:bg-white/20 text-white transition-colors">
                API Reference
              </a>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all ${menuOpen ? 'ml-64' : ''}`}>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Sports Central Documentation
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Feature-Based Architecture • Scalable • Modern
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDocs(false)} className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Overview Section */}
          <section id="overview" className="mb-16 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Sports Central is organized into feature-based apps within a monorepo structure. 
              Each feature app is independent but shares common infrastructure, enabling better 
              code organization, easier maintenance, and improved performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Feature Independence</h3>
                <p className="text-white/70 text-sm">Each app operates independently with shared auth & state</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
                <p className="text-white/70 text-sm">Route-based code splitting & lazy loading</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">Security</h3>
                <p className="text-white/70 text-sm">Kids mode enforcement & role-based access</p>
              </div>
            </div>
          </section>

          {/* Feature Apps Section */}
          <section id="features" className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Feature Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureApps.map(app => (
                <div key={app.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-r ${app.color} rounded-2xl flex items-center justify-center text-4xl mb-4`}>
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                  <p className="text-white/70 mb-4">{app.description}</p>
                  <div className="flex items-center justify-between">
                    <Link href={app.route} className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1">
                      Visit <Zap className="w-4 h-4" />
                    </Link>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      app.status === 'live' ? 'bg-green-500/20 text-green-300' :
                      app.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture Section */}
          <section id="architecture" className="mb-16 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">Architecture</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Frontend Structure</h3>
                <pre className="bg-black/30 rounded-xl p-4 overflow-x-auto">
                  <code className="text-green-300 text-sm">{`apps/frontend/src/app/[locale]/
├── (portal)/           # Main dashboard
├── (predictions)/      # AI Predictions
├── (live)/            # Live tracking
├── (social)/          # Social features
├── (kids)/            # Kids mode
├── (rewards)/         # Achievements
└── (docs)/            # Documentation`}</code>
                </pre>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Backend Modules</h3>
                <pre className="bg-black/30 rounded-xl p-4 overflow-x-auto">
                  <code className="text-blue-300 text-sm">{`apps/backend/src/modules/
├── predictions/       # Prediction service
├── matches/          # Live match service
├── social/           # Social features
├── rewards/          # Rewards system
└── kids/             # Kids mode enforcement`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="mb-16 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Code className="w-8 h-8" />
              API Reference
            </h2>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <h4 className="text-white font-bold mb-2">GET /api/predictions</h4>
                <p className="text-white/70 text-sm mb-2">Retrieve ML-powered match predictions</p>
                <code className="text-cyan-300 text-sm">Response: {`{ predictions: [...], confidence: 87% }`}</code>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <h4 className="text-white font-bold mb-2">GET /api/matches/live</h4>
                <p className="text-white/70 text-sm mb-2">Get real-time live match data</p>
                <code className="text-cyan-300 text-sm">Response: {`{ matches: [...], status: 'live' }`}</code>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <h4 className="text-white font-bold mb-2">GET /api/news/latest</h4>
                <p className="text-white/70 text-sm mb-2">Fetch latest sports news</p>
                <code className="text-cyan-300 text-sm">Response: {`{ news: [...], total: 25 }`}</code>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-white/60 py-8 border-t border-white/20">
            <p>Sports Central v2.0.0 • Last updated: {new Date().toLocaleDateString()}</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowDocs(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Book className="w-4 h-4" />
          <span>View Docs</span>
        </button>
      </div>
      <OptimizedDashboard />
      <MagajiCoAppLauncher />
      <MagajiCoCommandCenter />
    </div>
  );
}

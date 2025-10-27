
"use client";

import React, { useState, useEffect } from 'react';
import { LiveCarousel } from '../components/LiveCarousel';
import { NewsCarousel } from '../components/NewsCarousel';
import { AppDrawer } from '../components/AppDrawer';
import { FeatureGrid } from '../components/FeatureGrid';
import { ArchitectureOverview } from '../components/ArchitectureOverview';
import { ImplementationStatus } from '../components/ImplementationStatus';

export default function DocsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* Google-style Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1">
                <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
                <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
                <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
              </div>
            </button>
            <h1 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
              🏗️ Sports Central
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
              🔍
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
              ❓
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg">
              ⚙️
            </button>
            <button 
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="4" cy="4" r="2"/>
                <circle cx="12" cy="4" r="2"/>
                <circle cx="20" cy="4" r="2"/>
                <circle cx="4" cy="12" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="20" cy="12" r="2"/>
                <circle cx="4" cy="20" r="2"/>
                <circle cx="12" cy="20" r="2"/>
                <circle cx="20" cy="20" r="2"/>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
              SC
            </div>
          </div>
        </div>
      </nav>

      {/* App Drawer */}
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center text-white mb-12 animate-fadeInDown">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            🏗️ Sports Central
          </h1>
          <p className="text-xl opacity-95">Feature-Based Architecture Documentation</p>
        </header>

        {/* Live Matches Carousel */}
        <LiveCarousel />

        {/* News Carousel */}
        <NewsCarousel />

        {/* Overview */}
        <ArchitectureOverview />

        {/* Feature Apps Grid */}
        <FeatureGrid />

        {/* Benefits Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeInUp">
          <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
            🚀 Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '✅ Better Organization',
              '✅ Easier Maintenance', 
              '✅ Improved Performance',
              '✅ Team Scalability',
              '✅ Independent Testing',
              '✅ Flexible Deployment'
            ].map((benefit, i) => (
              <div 
                key={i}
                className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl font-semibold text-gray-800 hover:scale-105 transition-transform"
              >
                {benefit}
              </div>
            ))}
          </div>
        </section>

        {/* Data Flow */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-6">🔄 Data Flow Architecture</h2>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm">
            <pre>{`Frontend Apps → Backend Modules → Database
                     ↓
                ML Service → Predictions`}</pre>
          </div>
          <p className="mt-4 text-gray-600">
            Clean separation of concerns with each layer handling specific responsibilities.
            The ML service operates independently, providing predictions to the backend modules.
          </p>
        </section>

        {/* Implementation Status */}
        <ImplementationStatus />

        {/* Footer */}
        <footer className="text-center text-white py-8 mt-12 opacity-90">
          <p className="font-bold mb-2">Sports Central Architecture v2.0.0</p>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
}


"use client";

import React from 'react';
import { GoogleNavBar } from '@/app/components/layout/GoogleNavBar';
import { LiveCarousel } from '@/app/components/carousels/LiveCarousel';
import { NewsCarousel } from '@/app/components/carousels/NewsCarousel';
import { ArchitectureOverview } from '@/app/components/sections/ArchitectureOverview';
import { FrontendApps } from '@/app/components/sections/FrontendApps';
import { KeyBenefits } from '@/app/components/sections/KeyBenefits';
import { DataFlow } from '@/app/components/sections/DataFlow';
import { ImplementationStatus } from '@/app/components/sections/ImplementationStatus';
import { NextSteps } from '@/app/components/sections/NextSteps';

export default function EmpireHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <GoogleNavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center py-12 animate-fade-in relative">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            👑 Empire Hub
          </h1>
          <p className="text-xl text-white/90">
            Your Command Center for Sports Prediction Empire
          </p>
          
          {/* Settings Icons */}
          <div className="absolute top-4 right-4 flex gap-3">
            <a
              href="/settings"
              className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
              title="User Settings"
            >
              <span className="text-2xl">⚙️</span>
            </a>
            <a
              href="/management"
              className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg"
              title="Management Dashboard"
            >
              <span className="text-2xl">🎛️</span>
            </a>
          </div>
        </header>

        {/* Live Matches Carousel */}
        <LiveCarousel />

        {/* News Carousel */}
        <NewsCarousel />

        {/* Overview Section */}
        <ArchitectureOverview />

        {/* Frontend Apps Structure */}
        <FrontendApps />

        {/* Key Benefits */}
        <KeyBenefits />

        {/* Data Flow */}
        <DataFlow />

        {/* Implementation Status */}
        <ImplementationStatus />

        {/* Next Steps */}
        <NextSteps />

        {/* Footer */}
        <footer className="text-center text-white/90 py-8 text-sm">
          <p className="font-semibold">MagajiCo Empire Hub v2.0.0</p>
          <p>Last Updated: January 2025</p>
        </footer>
      </div>
    </div>
  );
}

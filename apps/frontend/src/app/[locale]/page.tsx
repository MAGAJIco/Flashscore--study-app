
"use client";

import React from 'react';
import { GoogleNavBar } from '@components/layout/AppDrawer';
import { LiveCarousel } from '@components/carousels/LiveCarousel';
import { NewsCarousel } from '@components/carousels/NewsCarousel';
import { ArchitectureOverview } from '@components/sections/ArchitectureOverview';
import { FrontendApps } from '@components/sections/FrontendApps';
import { KeyBenefits } from '@components/sections/KeyBenefits';
import { DataFlow } from '@components/sections/DataFlow';
import { ImplementationStatus } from '@components/sections/ImplementationStatus';
import { NextSteps } from '@components/sections/NextSteps';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <GoogleNavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center py-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🏗️ Sports Central
          </h1>
          <p className="text-xl text-white/90">
            Feature-Based Architecture Documentation
          </p>
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
          <p className="font-semibold">Sports Central Architecture v2.0.0</p>
          <p>Last Updated: January 2025</p>
        </footer>
      </div>
    </div>
  );
}

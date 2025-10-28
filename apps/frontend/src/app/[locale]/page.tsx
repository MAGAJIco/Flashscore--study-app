'use client';

import { GoogleNavBar } from '../components/layout/GoogleNavBar';
import { LiveCarousel } from '../components/carousels/LiveCarousel';
import { NewsCarousel } from '../components/carousels/NewsCarousel';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700">
      <GoogleNavBar />
      
      <div className="container mx-auto px-5 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-5xl">🏗️</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Sports Central
            </h1>
          </div>
          <p className="text-lg text-blue-100">
            Feature-Based Architecture Documentation
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <LiveCarousel />
          <NewsCarousel />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">📋 Overview</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Sports Central is organized into feature-based apps within a monorepo structure. Each feature app is independent but shares common infrastructure, enabling better organization, easier maintenance, and improved performance.
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">📱 Frontend Apps Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-100">
              <div>
                <div className="font-semibold text-white mb-2">🏠 Portal</div>
                <div className="text-sm">Main dashboard & navigation hub</div>
                <div className="text-xs text-blue-200 mt-1">page.tsx - Landing with feature cards</div>
                <div className="text-xs text-blue-200">layout.tsx - Portal-specific layout</div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">🤖 Predictions</div>
                <div className="text-sm">AI Predictions & ML Features</div>
                <div className="text-xs text-blue-200 mt-1">ai-predictions/ - ML interface</div>
                <div className="text-xs text-blue-200">coach/ - AI coach assistant</div>
                <div className="text-xs text-blue-200">analytics/ - Prediction analytics</div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">⚡ Live Tracking</div>
                <div className="text-sm">Real-time sports updates</div>
                <div className="text-xs text-blue-200 mt-1">matches/ - Live match tracker</div>
                <div className="text-xs text-blue-200">scores/ - Live scores display</div>
                <div className="text-xs text-blue-200">odds/ - Live odds updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


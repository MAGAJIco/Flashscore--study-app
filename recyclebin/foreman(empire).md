// ============================================
// FILE: app/(empire)/page.tsx
// PATH: apps/frontend/src/app/(portal)/page.tsx
// ============================================

"use client";

import React from 'react';
import { GoogleNavBar } from '@/components/layout/GoogleNavBar';
import { LiveCarousel } from '@/components/carousels/LiveCarousel';
import { NewsCarousel } from '@/components/carousels/NewsCarousel';
import { ArchitectureOverview } from '@/components/sections/ArchitectureOverview';
import { FrontendApps } from '@/components/sections/FrontendApps';
import { KeyBenefits } from '@/components/sections/KeyBenefits';
import { DataFlow } from '@/components/sections/DataFlow';
import { ImplementationStatus } from '@/components/sections/ImplementationStatus';
import { NextSteps } from '@/components/sections/NextSteps';

export default function PortalPage() {
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
          <p>Last Updated: October 26, 2025</p>
        </footer>
      </div>
    </div>
  );
}


// ============================================
// FILE: components/layout/GoogleNavBar.tsx
// PATH: apps/frontend/src/components/layout/GoogleNavBar.tsx
// ============================================

"use client";

import React, { useState } from 'react';
import { AppDrawer } from './AppDrawer';

export function GoogleNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 px-5 h-16 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-5">
          <button 
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            onClick={() => alert('Menu clicked')}
          >
            <div className="flex flex-col gap-1">
              <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
              <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
              <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
            </div>
          </button>
          <div className="text-2xl font-semibold text-indigo-600 flex items-center gap-2">
            🏗️ Sports Central
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl">
            🔍
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl">
            ❓
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl">
            ⚙️
          </button>
          <button 
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
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
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            SC
          </div>
        </div>
      </nav>

      <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}


// ============================================
// FILE: components/layout/AppDrawer.tsx
// PATH: apps/frontend/src/components/layout/AppDrawer.tsx
// ============================================

"use client";

import React from 'react';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const apps = [
  { icon: '🏠', name: 'Portal' },
  { icon: '🤖', name: 'Predictions' },
  { icon: '⚡', name: 'Live' },
  { icon: '👥', name: 'Social' },
  { icon: '🎮', name: 'Kids Mode' },
  { icon: '🏆', name: 'Rewards' },
  { icon: '📊', name: 'Analytics' },
  { icon: '💬', name: 'Chat' },
  { icon: '🎯', name: 'Challenges' },
];

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 max-h-[480px] overflow-y-auto z-50 transition-all ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-200">
          Sports Central Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {apps.map((app, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-2 text-white">
                {app.icon}
              </div>
              <div className="text-sm font-medium text-gray-700 text-center">
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}


// ============================================
// FILE: components/carousels/LiveCarousel.tsx
// PATH: apps/frontend/src/components/carousels/LiveCarousel.tsx
// ============================================

"use client";

import React, { useRef } from 'react';

const liveMatches = [
  {
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    viewers: '73K watching'
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: 'Q3 5:23',
    score: '98-95',
    viewers: '120K watching'
  },
  {
    icon: '🏈',
    title: 'Patriots vs Chiefs',
    description: 'NFL - Championship game intensity',
    time: 'Q2 8:14',
    score: '14-21',
    viewers: '250K watching'
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'Wimbledon Final - Epic rally battle',
    time: 'Set 2',
    score: '6-4, 3-4',
    viewers: '89K watching'
  },
  {
    icon: '🏏',
    title: 'India vs Australia',
    description: 'Test Cricket - Day 4 decisive moments',
    time: '45.2 overs',
    score: '234/5',
    viewers: '156K watching'
  },
];

export function LiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
          ⚡ Live Matches
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            ←
          </button>
          <button 
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {liveMatches.map((match, index) => (
          <div 
            key={index}
            className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative"
          >
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              🔴 LIVE
            </span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
              {match.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {match.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {match.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">⏱️ {match.time}</span>
              <span className="flex items-center gap-1">📊 {match.score}</span>
              <span className="flex items-center gap-1">👥 {match.viewers}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: components/carousels/NewsCarousel.tsx
// PATH: apps/frontend/src/components/carousels/NewsCarousel.tsx
// ============================================

"use client";

import React, { useRef } from 'react';

const newsItems = [
  {
    icon: '⚽',
    title: 'Mbappe Signs Historic Deal',
    description: 'Real Madrid announces record-breaking transfer for French superstar',
    time: '2 hours ago',
    comments: '1.2K comments',
    badge: 'BREAKING'
  },
  {
    icon: '🏀',
    title: 'LeBron Reaches 40K Points',
    description: 'King James makes history with unprecedented milestone achievement',
    time: '5 hours ago',
    comments: '892 comments',
    badge: 'NEWS'
  },
  {
    icon: '🎾',
    title: 'Serena Returns to Court',
    description: 'Tennis legend announces comeback tournament in Miami next month',
    time: '8 hours ago',
    comments: '645 comments',
    badge: 'NEWS'
  },
  {
    icon: '⚾',
    title: 'Yankees Win World Series',
    description: 'First championship in 15 years with dramatic Game 7 victory',
    time: '1 day ago',
    comments: '2.1K comments',
    badge: 'NEWS'
  },
  {
    icon: '🏁',
    title: 'Hamilton Breaks Records',
    description: 'Formula 1 legend secures 8th world championship in Abu Dhabi',
    time: '2 days ago',
    comments: '1.5K comments',
    badge: 'NEWS'
  },
];

export function NewsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
          📰 Latest News
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            ←
          </button>
          <button 
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {newsItems.map((news, index) => (
          <div 
            key={index}
            className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative"
          >
            <span className={`absolute top-4 right-4 ${news.badge === 'BREAKING' ? 'bg-blue-500' : 'bg-blue-400'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
              {news.badge === 'BREAKING' ? '🔥' : '📰'} {news.badge}
            </span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
              {news.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {news.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {news.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">🕐 {news.time}</span>
              <span className="flex items-center gap-1">💬 {news.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// Continue in next message for remaining components...
// ============================================


// ============================================
// FILE: components/sections/ArchitectureOverview.tsx
// PATH: apps/frontend/src/components/sections/ArchitectureOverview.tsx
// ============================================

export function ArchitectureOverview() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-5">📋 Overview</h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        Sports Central is organized into feature-based apps within a monorepo structure. 
        Each feature app is independent but shares common infrastructure, enabling better 
        organization, easier maintenance, and improved performance.
      </p>
    </div>
  );
}


// ============================================
// FILE: components/sections/FrontendApps.tsx
// PATH: apps/frontend/src/components/sections/FrontendApps.tsx
// ============================================

const apps = [
  {
    icon: '🏠',
    title: 'Portal',
    description: 'Main dashboard & navigation hub',
    items: ['page.tsx - Landing with feature cards', 'layout.tsx - Portal-specific layout']
  },
  {
    icon: '🤖',
    title: 'Predictions',
    description: 'AI Predictions & ML Features',
    items: ['ai-predictions/ - ML interface', 'coach/ - AI coach assistant', 'analytics/ - Prediction analytics']
  },
  {
    icon: '⚡',
    title: 'Live Tracking',
    description: 'Real-time sports updates',
    items: ['matches/ - Live match tracker', 'scores/ - Live scores display', 'odds/ - Live odds updates']
  },
  {
    icon: '👥',
    title: 'Social',
    description: 'Community & engagement',
    items: ['feed/ - Social feed', 'challenges/ - Friend challenges', 'chat/ - Live match chat', 'forum/ - Community discussions']
  },
  {
    icon: '🎮',
    title: 'Kids Mode',
    description: 'Safe environment for children',
    items: ['dashboard/ - Kids dashboard', 'quizzes/ - Educational quizzes', 'learning/ - Learning paths']
  },
  {
    icon: '🏆',
    title: 'Rewards',
    description: 'Achievements & gamification',
    items: ['achievements/ - Achievement system', 'leaderboard/ - Global rankings', 'coins/ - Pi Coin management']
  },
];

export function FrontendApps() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">📱 Frontend Apps Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {apps.map((app, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
              <span className="text-3xl">{app.icon}</span>
              {app.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{app.description}</p>
            <ul className="space-y-2">
              {app.items.map((item, i) => (
                <li 
                  key={i}
                  className="text-sm text-gray-700 py-2 border-b border-gray-300 last:border-0 transition-all hover:pl-2 hover:text-indigo-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: components/sections/KeyBenefits.tsx
// PATH: apps/frontend/src/components/sections/KeyBenefits.tsx
// ============================================

const benefits = [
  '✅ Better Organization',
  '✅ Easier Maintenance',
  '✅ Improved Performance',
  '✅ Team Scalability',
  '✅ Independent Testing',
  '✅ Flexible Deployment',
];

export function KeyBenefits() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🚀 Key Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-orange-100 to-pink-200 p-5 rounded-xl font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: components/sections/DataFlow.tsx
// PATH: apps/frontend/src/components/sections/DataFlow.tsx
// ============================================

export function DataFlow() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🔄 Data Flow Architecture</h2>
      <div className="bg-gray-900 text-gray-300 p-6 rounded-lg font-mono text-sm overflow-x-auto">
        <pre>{`Frontend Apps → Backend Modules → Database
                     ↓
                ML Service → Predictions`}</pre>
      </div>
      <p className="mt-4 text-gray-700">
        Clean separation of concerns with each layer handling specific responsibilities.
        The ML service operates independently, providing predictions to the backend modules.
      </p>
    </div>
  );
}


// ============================================
// FILE: components/sections/ImplementationStatus.tsx
// PATH: apps/frontend/src/components/sections/ImplementationStatus.tsx
// ============================================

const timeline = [
  {
    title: 'Frontend Route Groups',
    status: 'complete',
    description: 'All feature route groups created with proper layouts and navigation updated'
  },
  {
    title: 'Backend Modules',
    status: 'complete',
    description: 'Module structure created and routes reorganized with feature grouping'
  },
  {
    title: 'Service Layer',
    status: 'progress',
    description: 'Currently refactoring service layers for each module'
  },
  {
    title: 'Testing & Deployment',
    status: 'pending',
    description: 'Feature-specific testing and deployment pipeline setup'
  },
];

export function ImplementationStatus() {
  const getStatusBadge = (status: string) => {
    const styles = {
      complete: 'bg-green-500 text-white',
      progress: 'bg-orange-500 text-white',
      pending: 'bg-gray-500 text-white',
    };
    const labels = {
      complete: '✅ Complete',
      progress: '🔄 In Progress',
      pending: '⏳ Pending',
    };
    return (
      <span className={`${styles[status as keyof typeof styles]} px-4 py-1 rounded-full text-sm font-semibold ml-3`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">📊 Implementation Status</h2>
      <div className="relative pl-10 space-y-5">
        <div className="absolute left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600"></div>
        {timeline.map((item, index) => (
          <div key={index} className="relative bg-white rounded-lg p-5 shadow-md">
            <div className="absolute -left-7 top-6 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              {item.title}
              {getStatusBadge(item.status)}
            </h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: components/sections/NextSteps.tsx
// PATH: apps/frontend/src/components/sections/NextSteps.tsx
// ============================================

const steps = [
  '1. Move remaining components into feature directories',
  '2. Create service layers for each module',
  '3. Add module-specific middleware',
  '4. Implement feature-specific testing',
];

export function NextSteps() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🎯 Next Steps</h2>
      <div className="bg-gray-50 rounded-lg p-5 space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 transition-all hover:pl-6 hover:shadow-md cursor-pointer"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: app/globals.css (ADD THESE UTILITIES)
// PATH: apps/frontend/src/app/globals.css
// ============================================

/*
Add these to your Tailwind CSS file:

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease forwards;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
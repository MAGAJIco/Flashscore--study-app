// ============================================
// MISSING FEATURES ANALYSIS & IMPLEMENTATION
// ============================================

/*
🔍 WHAT'S MISSING FROM THE CURRENT IMPLEMENTATION:

1. ❌ Advanced Animations
   - Shimmer sweep effects on cards
   - Icon rotation on hover
   - Shadow ripple effects on badges
   - Breathing glow effects

2. ❌ Interactive Modals
   - News article detail modal
   - Match detail modal
   - Share functionality

3. ❌ Search Functionality
   - Search bar implementation
   - Search results display
   - Search filters

4. ❌ Help Center
   - Help documentation
   - FAQ section
   - Tutorial guides

5. ❌ Settings Panel
   - User preferences
   - Theme switching
   - Notification settings

6. ❌ User Profile
   - Profile dropdown
   - User stats
   - Quick actions

7. ❌ Auto-scroll with Pause on Hover
   - Carousels auto-advance
   - Pause when hovering
   - Resume on mouse leave

8. ❌ Enhanced Card Interactions
   - Click to expand details
   - Share button on cards
   - Favorite/bookmark functionality

9. ❌ Responsive Breakpoints
   - Mobile optimization
   - Tablet layouts
   - Desktop layouts

10. ❌ Loading States
    - Skeleton loaders
    - Shimmer effects while loading
    - Error states
*/


// ============================================
// FILE: components/enhanced/EnhancedLiveCarousel.tsx
// PATH: apps/frontend/src/components/enhanced/EnhancedLiveCarousel.tsx
// ============================================

"use client";

import React, { useRef, useState, useEffect } from 'react';
import { MatchDetailModal } from './MatchDetailModal';

interface LiveMatch {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

const liveMatches: LiveMatch[] = [
  {
    id: '1',
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    viewers: '73K watching'
  },
  {
    id: '2',
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: 'Q3 5:23',
    score: '98-95',
    viewers: '120K watching'
  },
  {
    id: '3',
    icon: '🏈',
    title: 'Patriots vs Chiefs',
    description: 'NFL - Championship game intensity',
    time: 'Q2 8:14',
    score: '14-21',
    viewers: '250K watching'
  },
  {
    id: '4',
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'Wimbledon Final - Epic rally battle',
    time: 'Set 2',
    score: '6-4, 3-4',
    viewers: '89K watching'
  },
  {
    id: '5',
    icon: '🏏',
    title: 'India vs Australia',
    description: 'Test Cricket - Day 4 decisive moments',
    time: '45.2 overs',
    score: '234/5',
    viewers: '156K watching'
  },
];

export function EnhancedLiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering) return; // Pause on hover

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
            ⚡ Live Matches
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              ←
            </button>
            <button 
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              →
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {liveMatches.map((match) => (
            <div 
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="enhanced-live-card min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-red-500 relative overflow-hidden group"
            >
              {/* Shimmer Effect */}
              <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100"></div>

              {/* Pulsing Badge with Ripple */}
              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE
              </span>

              {/* Icon with rotation */}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 transform transition-all group-hover:rotate-12 group-hover:scale-110">
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

              {/* Share Button (appears on hover) */}
              <button className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-indigo-700 transform translate-y-2 group-hover:translate-y-0">
                Share 📤
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </>
  );
}


// ============================================
// FILE: components/enhanced/MatchDetailModal.tsx
// PATH: apps/frontend/src/components/enhanced/MatchDetailModal.tsx
// ============================================

"use client";

import React from 'react';

interface Match {
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

interface MatchDetailModalProps {
  match: Match;
  onClose: () => void;
}

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto transform transition-all animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl">
                {match.icon}
              </div>
              <div>
                <span className="inline-flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE
                </span>
                <h2 className="text-2xl font-bold">{match.title}</h2>
                <p className="text-white/80 text-sm mt-1">{match.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-indigo-600">{match.score}</div>
              <div className="text-gray-600 mt-2">{match.time}</div>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>{match.viewers}</span>
              </div>
            </div>
          </div>

          {/* Match Stats (Mock Data) */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Match Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Possession</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: '55%' }}></div>
                </div>
                <span className="font-semibold">55%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shots on Target</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: '70%' }}></div>
                </div>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pass Accuracy</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
                </div>
                <span className="font-semibold">85%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Watch Live 📺
            </button>
            <button className="flex-1 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-colors">
              Share 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================
// FILE: components/enhanced/SearchBar.tsx
// PATH: apps/frontend/src/components/enhanced/SearchBar.tsx
// ============================================

"use client";

import React, { useState } from 'react';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl"
      >
        🔍
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search matches, teams, players..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            {query && (
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-3">Search Results</div>
                <div className="space-y-2">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="font-semibold">Man United vs Arsenal</div>
                    <div className="text-sm text-gray-500">Live Match</div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="font-semibold">Lakers vs Warriors</div>
                    <div className="text-sm text-gray-500">Live Match</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


// ============================================
// FILE: app/globals.css (ADD THESE STYLES)
// PATH: apps/frontend/src/app/globals.css
// ============================================

/*
Add these enhanced animations to your globals.css:

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.shimmer-effect {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
  pointer-events: none;
}

@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-scale-in {
  animation: scale-in 0.3s ease forwards;
}

.enhanced-live-card {
  position: relative;
}

.enhanced-live-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(45deg, #ff0000, #ff69b4, #ff0000);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.enhanced-live-card:hover::before {
  opacity: 1;
}
*/
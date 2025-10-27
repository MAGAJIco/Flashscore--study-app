
"use client";

import React from 'react';
import Link from 'next/link';

interface GoogleStyleNavProps {
  menuOpen: boolean;
  appDrawerOpen: boolean;
  onMenuToggle: () => void;
  onAppDrawerToggle: () => void;
}

export function GoogleStyleNav({
  menuOpen,
  appDrawerOpen,
  onMenuToggle,
  onAppDrawerToggle,
}: GoogleStyleNavProps) {
  return (
    <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="w-5 h-0.5 bg-white rounded-sm"></span>
                <span className="w-5 h-0.5 bg-white rounded-sm"></span>
                <span className="w-5 h-0.5 bg-white rounded-sm"></span>
              </div>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏗️</span>
              <span className="text-xl font-bold text-white">Sports Central</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
              🔍
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
              ❓
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
              ⚙️
            </button>
            <button
              onClick={onAppDrawerToggle}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
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
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
              SC
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


"use client";

import React, { useState } from 'react';
import { AppDrawer } from '@/app/[locale]/(docs)/components/AppDrawer';

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

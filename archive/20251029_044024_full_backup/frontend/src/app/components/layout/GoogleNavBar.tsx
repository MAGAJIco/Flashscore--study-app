"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppDrawer } from "./AppDrawer";

export function GoogleNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50 px-5 h-16 flex items-center justify-between">
        {/* Left Side - Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
            <div className="flex flex-col gap-1">
              <span className="w-5 h-0.5 bg-white rounded-full" />
              <span className="w-5 h-0.5 bg-white rounded-full" />
              <span className="w-5 h-0.5 bg-white rounded-full" />
            </div>
          </button>
          <div className="text-xl font-semibold text-white flex items-center gap-2">
            🏆 Sports Central
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white text-xl">
            🔍
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white text-xl">
            ❓
          </button>
          <Link href="/en/settings" className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white text-xl">
            ⚙️
          </Link>
          <button
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="4" cy="4" r="2" />
              <circle cx="12" cy="4" r="2" />
              <circle cx="20" cy="4" r="2" />
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="20" cy="12" r="2" />
              <circle cx="4" cy="20" r="2" />
              <circle cx="12" cy="20" r="2" />
              <circle cx="20" cy="20" r="2" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-sm border-2 border-white/20">
            SC
          </div>
        </div>
      </nav>

      <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
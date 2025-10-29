
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface NavApp {
  id: string;
  name: string;
  icon: string;
  route: string;
}

interface GoogleStyleNavProps {
  apps?: NavApp[];
}

export function GoogleStyleNav({ apps = [] }: GoogleStyleNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="w-5 h-0.5 bg-white rounded-sm" />
                  <span className="w-5 h-0.5 bg-white rounded-sm" />
                  <span className="w-5 h-0.5 bg-white rounded-sm" />
                </div>
              </button>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">⚽</span>
                <span className="text-xl font-bold text-white">Sports Central</span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                ❓
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                ⚙️
              </button>
              <button
                onClick={() => setAppDrawerOpen(!appDrawerOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
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
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                SC
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* App Drawer */}
      {appDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setAppDrawerOpen(false)}
          />
          <div className="fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 max-h-96 overflow-y-auto z-50">
            <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-200">
              Apps
            </div>
            <div className="grid grid-cols-3 gap-4">
              {apps.map((app) => (
                <Link
                  key={app.id}
                  href={app.route}
                  onClick={() => setAppDrawerOpen(false)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-2 text-white">
                    {app.icon}
                  </div>
                  <div className="text-sm text-center font-medium text-gray-700">{app.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

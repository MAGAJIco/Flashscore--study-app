"use client";

import React, { useState } from 'react';
import { AppDrawer } from './AppDrawer';
import Link from 'next/link';

export function GoogleNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 px-5 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-5">
          <button 
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <div className="flex flex-col gap-1">
              <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded"></span>
              <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded"></span>
              <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded"></span>
            </div>
          </button>
          <Link href="/en" className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 hover:opacity-80 transition-opacity">
            👑 Sports Central
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-xl"
          >
            🔍
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-xl">
            ❓
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-xl">
            ⚙️
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold cursor-pointer hover:opacity-90 transition-opacity">
            SC
          </div>
        </div>
      </nav>

      <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
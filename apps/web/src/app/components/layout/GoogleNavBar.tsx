"use client";

import React, { useState } from 'react';
import { AppDrawer } from './AppDrawer';
import { SearchBar } from '../enhanced/SearchBar';
import { HelpCenter } from '../modals/HelpCenter';
import { SettingsPanel } from '../modals/SettingsPanel';
import { UserProfileDropdown } from '../dropdowns/UserProfileDropdown';
import Link from 'next/link';

export function GoogleNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 px-5 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-5">
          <button 
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <div className="flex flex-col gap-1">
              <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded transition-all"></span>
              <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded transition-all"></span>
              <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded transition-all"></span>
            </div>
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            🏗️ Sports Central
          </button>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />

          <button 
            onClick={() => setIsHelpOpen(true)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-xl relative group"
          >
            ❓
            <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Help
            </span>
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-xl relative group"
          >
            ⚙️
            <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Settings
            </span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold hover:shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              SC
            </button>
            {isProfileOpen && <UserProfileDropdown onClose={() => setIsProfileOpen(false)} />}
          </div>
        </div>
      </nav>

      <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <HelpCenter isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

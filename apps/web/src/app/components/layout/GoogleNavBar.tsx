
"use client";

import React, { useState, useEffect } from 'react';
import { AppDrawer } from './AppDrawer';
import { SearchBar } from '../enhanced/SearchBar';
import { HelpCenter } from '../modals/HelpCenter';
import { SettingsPanel } from '../modals/SettingsPanel';
import { UserProfileDropdown } from '../dropdowns/UserProfileDropdown';
import { AuthModal } from '../modals/AuthModal';
import Link from 'next/link';

export function GoogleNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_data');
    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const checkNewPredictions = async () => {
      try {
        const response = await fetch('http://0.0.0.0:3001/api/predictions');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const highConfidencePredictions = data.data.filter((pred: any) => {
            const predDate = new Date(pred.createdAt);
            return pred.confidence >= 80 && predDate > lastChecked;
          });
          
          if (highConfidencePredictions.length > 0) {
            setNotificationCount(prev => prev + highConfidencePredictions.length);
          }
        }
      } catch (error) {
        console.error('Failed to check predictions:', error);
      }
    };

    const interval = setInterval(checkNewPredictions, 30000); // Check every 30 seconds
    checkNewPredictions(); // Initial check
    
    return () => clearInterval(interval);
  }, [lastChecked]);

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setLastChecked(new Date());
    window.location.href = '/en/predictions';
  };

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
          <Link
            href="/en"
            className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            🎯 Magajico
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />

          <button 
            onClick={handleNotificationClick}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-xl relative group"
          >
            🔔
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
            <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {notificationCount > 0 ? `${notificationCount} New Predictions` : 'Notifications'}
            </span>
          </button>

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

          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold hover:shadow-lg transition-all hover:scale-110 active:scale-95 ring-2 ring-indigo-400 ring-offset-2"
                title="Your Profile"
              >
                {userData?.username?.substring(0, 2).toUpperCase() || 'MJ'}
              </button>
              {isProfileOpen && (
                <UserProfileDropdown 
                  onClose={() => setIsProfileOpen(false)} 
                  userData={userData}
                  onLogout={() => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    setIsLoggedIn(false);
                    setUserData(null);
                    setIsProfileOpen(false);
                  }}
                />
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <HelpCenter isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setIsLoggedIn(true);
          setUserData(user);
        }}
      />
    </>
  );
}

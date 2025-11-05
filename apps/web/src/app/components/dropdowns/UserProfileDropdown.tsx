"use client";

import React from 'react';

interface UserProfileDropdownProps {
  onClose: () => void;
  userData?: any;
  onLogout?: () => void;
}

export function UserProfileDropdown({ onClose, userData, onLogout }: UserProfileDropdownProps) {
  const displayName = userData?.username || 'User';
  const displayEmail = userData?.email || 'user@email.com';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute top-14 right-0 bg-white rounded-xl shadow-2xl w-80 z-50 animate-scale-in overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
            <div>
              <div className="font-bold text-lg">{displayName}</div>
              <div className="text-sm text-white/80">{displayEmail}</div>
            </div>
          </div>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 rounded-lg transition-colors">
            View Profile
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4 border-b">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">127</div>
            <div className="text-xs text-gray-500">Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">1.2K</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">45</div>
            <div className="text-xs text-gray-500">Badges</div>
          </div>
        </div>

        <div className="p-2">
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
            <span className="text-xl">📊</span>
            <span className="font-medium">My Statistics</span>
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <span className="font-medium">Achievements</span>
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 border-t mt-2"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium text-red-600">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

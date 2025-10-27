
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
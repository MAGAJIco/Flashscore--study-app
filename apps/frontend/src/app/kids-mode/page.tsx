'use client';

import React from 'react';
import KidsModeDashboard from '../components/KidsModeDashboard';
import { useKidsModeContext } from '../../context/KidsModeContext';

export default function KidsModePage() {
  const { kidsMode, setKidsMode } = useKidsModeContext();

  return (
    <div className="min-h-screen">
      {kidsMode ? (
        <KidsModeDashboard />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md text-center border border-white/20">
            <div className="text-6xl mb-4">🛡️</div>
            <h1 className="text-3xl font-bold text-white mb-4">Kids Mode Required</h1>
            <p className="text-white/80 mb-6">
              This page is designed for young sports fans. Enable Kids Mode to access safe, educational content!
            </p>
            <button
              onClick={() => setKidsMode(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Enable Kids Mode 🌈
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

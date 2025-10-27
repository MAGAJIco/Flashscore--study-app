
'use client';

import React from 'react';
import { useKidsModeContext } from '../../../context/KidsModeContext';

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { kidsMode } = useKidsModeContext();

  if (!kidsMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md text-center border border-white/20">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-3xl font-bold text-white mb-4">Kids Mode Required</h1>
          <p className="text-white/80 mb-6">
            This section is designed for young sports fans. Please enable Kids Mode to access safe, educational content!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="kids-app bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen">
      <div className="kids-header bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 mb-4">
        <h2 className="text-xl font-bold">🌈 Kids Zone</h2>
        <p className="text-sm opacity-90">Safe & Fun Sports Learning</p>
      </div>
      <div className="kids-content p-4">
        {children}
      </div>
    </div>
  );
}

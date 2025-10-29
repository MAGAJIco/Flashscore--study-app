
'use client';

import React from 'react';

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="predictions-app">
      <div className="predictions-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 mb-4">
        <h2 className="text-xl font-bold">🤖 AI Predictions & ML Features</h2>
        <p className="text-sm opacity-90">Machine Learning Powered Predictions</p>
      </div>
      <div className="predictions-content">
        {children}
      </div>
    </div>
  );
}

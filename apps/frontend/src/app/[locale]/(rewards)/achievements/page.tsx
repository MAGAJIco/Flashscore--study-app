
'use client';

import React from 'react';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

export default function AchievementsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Rewards" }, { label: "Achievements" }]} />
      
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-4">🏆 Your Achievements</h1>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-8 text-center">
          <p className="text-yellow-400 text-lg mb-2">🎯 Start Predicting!</p>
          <p className="text-gray-400">Make predictions to unlock achievements and earn rewards!</p>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import { AchievementDisplay } from '../components/AchievementDisplay';

export default function AchievementsPage() {
  return (
    <div className="achievements-page">
      <AchievementDisplay />
    </div>
  );
}

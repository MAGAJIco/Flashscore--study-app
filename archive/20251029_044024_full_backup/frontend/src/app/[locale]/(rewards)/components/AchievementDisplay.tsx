
"use client";

import React from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export function AchievementDisplay() {
  const achievements: Achievement[] = [
    { id: '1', title: 'First Prediction', description: 'Made your first prediction', icon: '🎯', unlocked: true },
    { id: '2', title: 'Streak Master', description: '5 correct predictions in a row', icon: '🔥', unlocked: false },
    { id: '3', title: 'Expert Analyst', description: 'Reached 80% accuracy', icon: '🏆', unlocked: false },
  ];

  return (
    <div className="achievement-display">
      <h2 className="text-2xl font-bold mb-4">🏆 Your Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`p-4 rounded-lg ${achievement.unlocked ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500' : 'bg-white/5 opacity-50'}`}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h3 className="font-bold text-lg">{achievement.title}</h3>
            <p className="text-sm text-gray-400">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

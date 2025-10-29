
"use client";

import React, { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: string;
}

interface AchievementsFeatureProps {
  userId: string;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function AchievementsFeature({ userId, onNotification }: AchievementsFeatureProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_prediction',
      title: 'First Step',
      description: 'Make your first prediction',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: '10 coins',
    },
    {
      id: 'prediction_streak_5',
      title: 'Hot Streak',
      description: 'Win 5 predictions in a row',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      reward: '50 coins',
    },
    {
      id: 'win_rate_70',
      title: 'Elite Analyst',
      description: 'Achieve 70% win rate with 50+ predictions',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      reward: '100 coins',
    },
    {
      id: 'community_leader',
      title: 'Community Leader',
      description: 'Help 10 users with predictions',
      icon: '👥',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      reward: '75 coins',
    },
    {
      id: 'prediction_master',
      title: 'Prediction Master',
      description: 'Make 100 successful predictions',
      icon: '💎',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      reward: '200 coins',
    },
  ]);

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  const loadAchievements = () => {
    try {
      const saved = localStorage.getItem(`achievements-${userId}`);
      if (saved) {
        setAchievements(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">🎯 Your Achievements</h3>
        <div className="text-lg text-gray-300">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl p-6 border transition-all ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/30'
                : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                achievement.unlocked ? 'bg-green-500/20' : 'bg-gray-700/50'
              }`}>
                {achievement.unlocked ? '✅' : achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                <div className="text-xs text-yellow-400">Reward: {achievement.reward}</div>
              </div>
            </div>

            {!achievement.unlocked && (
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{achievement.progress} / {achievement.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

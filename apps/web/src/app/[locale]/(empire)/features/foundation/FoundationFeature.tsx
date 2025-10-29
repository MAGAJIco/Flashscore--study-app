
"use client";

import React, { useState, useEffect } from 'react';

interface FoundationFeatureProps {
  userId: string;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface FoundationLevel {
  level: number;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export default function FoundationFeature({ userId, onNotification }: FoundationFeatureProps) {
  const [levels, setLevels] = useState<FoundationLevel[]>([
    { level: 1, name: 'Foundation Builder', description: 'Start your journey', unlocked: true, progress: 100 },
    { level: 2, name: 'Rising Analyst', description: 'Make 10 predictions with 50% accuracy', unlocked: false, progress: 0 },
    { level: 3, name: 'Expert Predictor', description: 'Achieve 60% win rate with 25+ predictions', unlocked: false, progress: 0 },
    { level: 4, name: 'Master Strategist', description: 'Reach 70% win rate with 50+ predictions', unlocked: false, progress: 0 },
    { level: 5, name: 'Empire Legend', description: 'Maintain 75% win rate with 100+ predictions', unlocked: false, progress: 0 },
    { level: 6, name: 'Legendary Rooftop', description: 'Achieve 80% win rate with 200+ predictions', unlocked: false, progress: 0 },
  ]);

  const [userStats, setUserStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    winRate: 0,
    currentLevel: 1,
  });

  useEffect(() => {
    loadUserProgress();
  }, [userId]);

  const loadUserProgress = async () => {
    try {
      const savedStats = localStorage.getItem(`foundation-${userId}`);
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        setUserStats(stats);
        updateLevelProgress(stats);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const updateLevelProgress = (stats: typeof userStats) => {
    const updatedLevels = [...levels];
    
    updatedLevels.forEach((level, index) => {
      if (index === 0) {
        level.unlocked = true;
        level.progress = 100;
      } else if (index === 1) {
        level.unlocked = stats.totalPredictions >= 10 && stats.winRate >= 0.5;
        level.progress = Math.min((stats.totalPredictions / 10) * 100, 100);
      } else if (index === 2) {
        level.unlocked = stats.totalPredictions >= 25 && stats.winRate >= 0.6;
        level.progress = Math.min((stats.totalPredictions / 25) * 100, 100);
      } else if (index === 3) {
        level.unlocked = stats.totalPredictions >= 50 && stats.winRate >= 0.7;
        level.progress = Math.min((stats.totalPredictions / 50) * 100, 100);
      } else if (index === 4) {
        level.unlocked = stats.totalPredictions >= 100 && stats.winRate >= 0.75;
        level.progress = Math.min((stats.totalPredictions / 100) * 100, 100);
      } else if (index === 5) {
        level.unlocked = stats.totalPredictions >= 200 && stats.winRate >= 0.8;
        level.progress = Math.min((stats.totalPredictions / 200) * 100, 100);
      }
    });

    setLevels(updatedLevels);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold text-white mb-4">Your Empire Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400">{userStats.totalPredictions}</div>
            <div className="text-sm text-gray-300">Total Predictions</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400">{userStats.correctPredictions}</div>
            <div className="text-sm text-gray-300">Correct</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400">{(userStats.winRate * 100).toFixed(1)}%</div>
            <div className="text-sm text-gray-300">Win Rate</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-400">Lvl {userStats.currentLevel}</div>
            <div className="text-sm text-gray-300">Current Level</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Foundation Levels</h3>
        {levels.map((level, index) => (
          <div
            key={level.level}
            className={`bg-gradient-to-r ${
              level.unlocked
                ? 'from-green-900/50 to-teal-900/50 border-green-500/30'
                : 'from-gray-800/50 to-gray-900/50 border-gray-700/30'
            } rounded-xl p-6 border transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  level.unlocked ? 'bg-green-500' : 'bg-gray-700'
                }`}>
                  {level.unlocked ? '✅' : '🔒'}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{level.name}</h4>
                  <p className="text-sm text-gray-300">{level.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">Level {level.level}</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  level.unlocked ? 'bg-gradient-to-r from-green-400 to-teal-400' : 'bg-gray-600'
                }`}
                style={{ width: `${level.progress}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-2">{level.progress.toFixed(0)}% Complete</div>
          </div>
        ))}
      </div>
    </div>
  );
}


"use client";

import { useState } from 'react';
import { Trophy, Award, Star, Target, Zap, Crown, Medal, Gift } from 'lucide-react';

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const achievements = [
    {
      id: 1,
      title: 'First Prediction',
      description: 'Make your first sports prediction',
      icon: Target,
      progress: 100,
      unlocked: true,
      category: 'beginner',
      reward: 10
    },
    {
      id: 2,
      title: 'Perfect Week',
      description: 'Get 7 predictions correct in a row',
      icon: Star,
      progress: 60,
      unlocked: false,
      category: 'streak',
      reward: 50
    },
    {
      id: 3,
      title: 'Century Club',
      description: 'Make 100 predictions',
      icon: Crown,
      progress: 75,
      unlocked: false,
      category: 'milestone',
      reward: 100
    },
    {
      id: 4,
      title: 'Speed Demon',
      description: 'Make 10 predictions in one day',
      icon: Zap,
      progress: 100,
      unlocked: true,
      category: 'special',
      reward: 25
    }
  ];

  const categories = [
    { id: 'all', label: 'All Achievements' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'streak', label: 'Streaks' },
    { id: 'milestone', label: 'Milestones' },
    { id: 'special', label: 'Special' }
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Achievements
          </h1>
          <p className="text-gray-400">Track your progress and unlock rewards</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-6 rounded-2xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-12 h-12 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
                  {achievement.unlocked && (
                    <Medal className="w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        achievement.unlocked ? 'bg-yellow-400' : 'bg-purple-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">{achievement.reward} Pi Coins</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

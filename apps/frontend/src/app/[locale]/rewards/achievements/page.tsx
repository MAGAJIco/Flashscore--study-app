"use client";

import React from 'react';
import { Trophy, Star, Coins, TrendingUp, Award, Target, Zap } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-12 h-12 text-amber-400" />
          <div>
            <h1 className="text-4xl font-bold text-white">Rewards & Achievements</h1>
            <p className="text-gray-300">Earn badges, collect coins, and track your progress</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-600/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border border-amber-500/30">
          <Coins className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Pi Coins</h3>
          <p className="text-3xl font-bold text-amber-400">1,250</p>
          <p className="text-gray-400 text-sm">Your balance</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
          <Star className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Achievements</h3>
          <p className="text-3xl font-bold text-blue-400">15/50</p>
          <p className="text-gray-400 text-sm">Unlocked</p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
          <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Streak</h3>
          <p className="text-3xl font-bold text-green-400">7 days</p>
          <p className="text-gray-400 text-sm">Current streak</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
          <Trophy className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Level</h3>
          <p className="text-3xl font-bold text-purple-400">12</p>
          <p className="text-gray-400 text-sm">Pro Predictor</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Your Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Award, name: "First Prediction", desc: "Made your first prediction", unlocked: true, color: "blue" },
            { icon: Target, name: "Accuracy Master", desc: "Reached 75% accuracy", unlocked: true, color: "green" },
            { icon: Zap, name: "Speed Demon", desc: "Made 10 predictions in one day", unlocked: true, color: "purple" },
            { icon: Trophy, name: "Weekly Warrior", desc: "Predict every day for a week", unlocked: false, color: "gray" },
            { icon: Star, name: "Social Star", desc: "Get 100 followers", unlocked: false, color: "gray" },
            { icon: Coins, name: "Coin Collector", desc: "Earn 1000 Pi Coins", unlocked: false, color: "gray" },
          ].map((achievement, index) => (
            <div key={index} className={`p-4 rounded-xl border-2 ${
              achievement.unlocked 
                ? `bg-${achievement.color}-600/20 border-${achievement.color}-500/30` 
                : 'bg-gray-700/20 border-gray-600/30 opacity-60'
            }`}>
              <achievement.icon className={`w-8 h-8 mb-2 ${
                achievement.unlocked ? `text-${achievement.color}-400` : 'text-gray-500'
              }`} />
              <h3 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {achievement.name}
              </h3>
              <p className="text-sm text-gray-400">{achievement.desc}</p>
              {achievement.unlocked && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <span>✓</span>
                  <span>Unlocked</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">How to Earn Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-400">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Make Predictions</h3>
              <p className="text-gray-400 text-sm">Earn coins for every prediction you make</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Complete Achievements</h3>
              <p className="text-gray-400 text-sm">Unlock badges and bonus rewards</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-400">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Daily Streak</h3>
              <p className="text-gray-400 text-sm">Login daily to maintain your streak</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Learn & Improve</h3>
              <p className="text-gray-400 text-sm">Complete educational quizzes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

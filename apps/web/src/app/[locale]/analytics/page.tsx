
"use client";

import { useState } from 'react';
import { BarChart3, TrendingUp, Target, Award, Calendar, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = {
    totalPredictions: 248,
    accuracy: 87,
    winStreak: 12,
    topSport: 'Football',
    coinsEarned: 1250,
    rank: 156
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">Track your prediction performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Predictions', value: stats.totalPredictions, icon: Target, color: 'blue' },
            { label: 'Accuracy', value: `${stats.accuracy}%`, icon: TrendingUp, color: 'green' },
            { label: 'Win Streak', value: stats.winStreak, icon: Activity, color: 'purple' },
            { label: 'Top Sport', value: stats.topSport, icon: Award, color: 'yellow' },
            { label: 'Coins Earned', value: stats.coinsEarned, icon: Calendar, color: 'orange' },
            { label: 'Global Rank', value: `#${stats.rank}`, icon: TrendingUp, color: 'cyan' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <Icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Performance Chart Placeholder */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Weekly Performance</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 78, 82, 90, 75, 88, 92].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

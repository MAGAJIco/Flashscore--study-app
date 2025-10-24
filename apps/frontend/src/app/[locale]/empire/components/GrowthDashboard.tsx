"use client";
import React, { useState, useEffect } from 'react';
import { sportsIntegration, GrowthScore, EMPIRE_LEVELS } from '@magajico/shared/services';
import { aiSuggestions, AISuggestion } from '@magajico/shared/services';

interface GrowthDashboardProps {
  userId: string;
  totalPower: number;
  phases: any[];
}

export default function GrowthDashboard({ userId, totalPower, phases }: GrowthDashboardProps) {
  const [growthScore, setGrowthScore] = useState<GrowthScore | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrowthData();
  }, [userId]);

  const loadGrowthData = async () => {
    try {
      setLoading(true);
      const score = await sportsIntegration.getUserGrowthScore(userId);
      setGrowthScore(score);
      
      const aiSuggs = aiSuggestions.generateNextMoves(score, phases, totalPower);
      setSuggestions(aiSuggs);
    } catch (error) {
      console.error('Failed to load growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-gray-700/50 rounded-2xl"></div>
        <div className="h-64 bg-gray-700/50 rounded-2xl"></div>
      </div>
    );
  }

  if (!growthScore) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <p className="text-gray-400">No growth data available yet. Start making predictions!</p>
      </div>
    );
  }

  const currentLevel = EMPIRE_LEVELS.find(l => l.level === growthScore.growthLevel);
  const nextLevel = EMPIRE_LEVELS.find(l => l.level === growthScore.growthLevel + 1);
  const powerBonus = sportsIntegration.calculatePowerBonus(growthScore);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">📊 Growth Score</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Empire Rank</div>
              <div className="text-3xl font-bold text-yellow-400">{currentLevel?.name}</div>
              <div className="text-sm text-gray-300 mt-2">Level {growthScore.growthLevel}</div>
            </div>

            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Win Rate</div>
              <div className="text-3xl font-bold text-green-400">
                {(growthScore.winRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300 mt-2">
                {growthScore.correctPredictions} / {growthScore.totalPredictions} predictions
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Current Streak</div>
              <div className="text-3xl font-bold text-orange-400">
                {growthScore.streak > 0 ? '🔥 ' : ''}{growthScore.streak}
              </div>
              <div className="text-sm text-gray-300 mt-2">
                {growthScore.streak > 0 ? 'consecutive wins' : 'no active streak'}
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Power Bonus</div>
              <div className="text-3xl font-bold text-purple-400">
                ⚡ {powerBonus}
              </div>
              <div className="text-sm text-gray-300 mt-2">
                {currentLevel?.powerMultiplier}x multiplier
              </div>
            </div>
          </div>
        </div>

        {nextLevel && (
          <div className="mt-6 bg-black/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-2">Next Rank: {nextLevel.name}</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Win Rate Required</span>
                <span className="text-white font-semibold">{(nextLevel.minWinRate * 100)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Predictions Required</span>
                <span className="text-white font-semibold">{nextLevel.minPredictions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Power Multiplier</span>
                <span className="text-yellow-400 font-semibold">{nextLevel.powerMultiplier}x</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">🤖 AI Next Move Suggestions</h2>
        
        {suggestions.length === 0 ? (
          <p className="text-gray-400">No suggestions available at this time.</p>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const priorityColors = {
                high: 'border-red-500/50 bg-red-900/20',
                medium: 'border-yellow-500/50 bg-yellow-900/20',
                low: 'border-blue-500/50 bg-blue-900/20',
              };

              const typeIcons = {
                prediction: '🎯',
                phase: '🏗️',
                strategy: '🧠',
                improvement: '📈',
              };

              return (
                <div
                  key={index}
                  className={`border rounded-xl p-4 ${priorityColors[suggestion.priority]}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeIcons[suggestion.type]}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{suggestion.title}</h3>
                      <p className="text-sm text-gray-300 mb-2">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Expected: {suggestion.expectedImpact}
                        </span>
                        {suggestion.actionable && (
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

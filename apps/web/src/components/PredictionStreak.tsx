
"use client";

import React, { useState, useEffect } from 'react';

interface PredictionStreakProps {
  userId: string;
}

export function PredictionStreak({ userId }: PredictionStreakProps) {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await fetch(`/api/predictions?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const predictions = data.data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          let currentStreak = 0;
          let maxStreak = 0;
          let tempStreak = 0;
          
          for (const pred of predictions) {
            if (pred.isCorrect === true) {
              tempStreak++;
              if (tempStreak > maxStreak) maxStreak = tempStreak;
            } else if (pred.isCorrect === false) {
              if (currentStreak === 0 && tempStreak > 0) {
                currentStreak = 0;
              }
              tempStreak = 0;
            }
          }
          
          setStreak(tempStreak);
          setBestStreak(maxStreak);
        }
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-orange-200 dark:bg-orange-700 rounded w-32 mb-2"></div>
        <div className="h-8 bg-orange-200 dark:bg-orange-700 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 flex items-center gap-2">
          🔥 Prediction Streak
        </h3>
        {streak >= 5 && (
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
            ON FIRE!
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-red-600 dark:text-red-400">{bestStreak}</div>
          <div className="text-sm text-red-700 dark:text-red-300">Best Streak</div>
        </div>
      </div>
      
      {streak > 0 && (
        <div className="mt-4 text-center text-sm text-orange-600 dark:text-orange-400">
          Keep it up! 🎯
        </div>
      )}
    </div>
  );
}

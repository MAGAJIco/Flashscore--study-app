
"use client";

import React, { useState, useEffect } from 'react';

interface DailyPredictionLimitProps {
  userId: string;
  dailyLimit?: number;
}

export function DailyPredictionLimit({ userId, dailyLimit = 10 }: DailyPredictionLimitProps) {
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayPredictions = async () => {
      try {
        const response = await fetch(`/api/predictions?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const todayPredictions = data.data.filter((pred: any) => {
            const predDate = new Date(pred.createdAt);
            predDate.setHours(0, 0, 0, 0);
            return predDate.getTime() === today.getTime();
          });
          
          setTodayCount(todayPredictions.length);
        }
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayPredictions();
  }, [userId]);

  const percentage = (todayCount / dailyLimit) * 100;
  const remaining = Math.max(0, dailyLimit - todayCount);
  const isNearLimit = percentage >= 80;
  const isAtLimit = todayCount >= dailyLimit;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-blue-200 dark:bg-blue-700 rounded w-40 mb-2"></div>
        <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
          📊 Daily Predictions
        </h3>
        {isAtLimit && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            LIMIT REACHED
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700 dark:text-blue-300">Today's Count</span>
          <span className={`text-2xl font-bold ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-blue-600'} dark:text-blue-400`}>
            {todayCount}/{dailyLimit}
          </span>
        </div>
        
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {isAtLimit 
            ? "Daily limit reached! Focus on quality analysis 🎯" 
            : `${remaining} predictions remaining today`
          }
        </p>
      </div>
    </div>
  );
}

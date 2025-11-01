
"use client";

import React, { useState, useEffect } from 'react';

interface ConfidenceCalibrationProps {
  userId: string;
}

interface CalibrationData {
  range: string;
  predicted: number;
  actual: number;
  count: number;
}

export function ConfidenceCalibration({ userId }: ConfidenceCalibrationProps) {
  const [calibrationData, setCalibrationData] = useState<CalibrationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalibration = async () => {
      try {
        const response = await fetch(`/api/predictions?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const predictions = data.data.filter((p: any) => p.isCorrect !== undefined);
          
          const ranges = [
            { min: 50, max: 60, label: '50-60%' },
            { min: 60, max: 70, label: '60-70%' },
            { min: 70, max: 80, label: '70-80%' },
            { min: 80, max: 90, label: '80-90%' },
            { min: 90, max: 100, label: '90-100%' }
          ];
          
          const calibration = ranges.map(range => {
            const inRange = predictions.filter((p: any) => 
              p.confidence >= range.min && p.confidence < range.max
            );
            
            const correct = inRange.filter((p: any) => p.isCorrect === true).length;
            const actual = inRange.length > 0 ? (correct / inRange.length) * 100 : 0;
            const predicted = (range.min + range.max) / 2;
            
            return {
              range: range.label,
              predicted,
              actual,
              count: inRange.length
            };
          });
          
          setCalibrationData(calibration);
        }
      } catch (error) {
        console.error('Failed to fetch calibration:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalibration();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-purple-200 dark:bg-purple-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
      <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
        📈 Confidence Calibration
      </h3>
      
      <div className="space-y-3">
        {calibrationData.map((item, index) => {
          const diff = item.actual - item.predicted;
          const isOverconfident = diff < -5;
          const isUnderconfident = diff > 5;
          
          return (
            <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  {item.range}
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  {item.count} predictions
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Expected</div>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    {item.predicted.toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Actual</div>
                  <div className={`text-lg font-bold ${
                    isOverconfident ? 'text-red-600' : isUnderconfident ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {item.actual.toFixed(0)}%
                  </div>
                </div>
              </div>
              
              {item.count > 0 && (
                <div className="text-xs">
                  {isOverconfident && (
                    <span className="text-red-600 dark:text-red-400">⚠️ Overconfident</span>
                  )}
                  {isUnderconfident && (
                    <span className="text-blue-600 dark:text-blue-400">💡 Underconfident</span>
                  )}
                  {!isOverconfident && !isUnderconfident && (
                    <span className="text-green-600 dark:text-green-400">✅ Well calibrated</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

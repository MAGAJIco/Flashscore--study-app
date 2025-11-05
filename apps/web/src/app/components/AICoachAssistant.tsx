
"use client";

import React, { useState, useEffect } from 'react';

interface PredictionHistory {
  id: string;
  matchName: string;
  userPrediction: string;
  actualResult: string;
  confidence: number;
  sport: string;
  timestamp: Date;
  isCorrect: boolean;
  factors: {
    homeForm: number;
    awayForm: number;
    headToHead: number;
    injuries: string[];
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  lessons: string[];
}

interface CoachInsight {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actionable: string;
}

export function AICoachAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'learning' | 'insights'>('analysis');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistory | null>(null);
  const [userStats, setUserStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    accuracy: 0,
    strongestSport: '',
    weakestSport: '',
    averageConfidence: 0
  });

  const [recentPredictions, setRecentPredictions] = useState<PredictionHistory[]>([
    {
      id: '1',
      matchName: 'Man City vs Arsenal',
      userPrediction: 'Home Win',
      actualResult: 'Draw',
      confidence: 75,
      sport: 'Football',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isCorrect: false,
      factors: {
        homeForm: 85,
        awayForm: 80,
        headToHead: 60,
        injuries: ['Haaland (doubt)']
      }
    }
  ]);

  const [learningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Football Form Analysis',
      description: 'Master the art of analyzing team form and momentum',
      progress: 35,
      icon: 'F',
      lessons: ['Recent results impact', 'Home vs Away performance', 'Momentum tracking']
    }
  ]);

  const [coachInsights] = useState<CoachInsight[]>([
    {
      type: 'warning',
      title: 'Overconfidence Pattern Detected',
      message: 'Your predictions with 80%+ confidence have only 65% accuracy',
      actionable: 'Consider lowering confidence when multiple key factors are uncertain'
    }
  ]);

  useEffect(() => {
    const total = recentPredictions.length;
    const correct = recentPredictions.filter(p => p.isCorrect).length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    setUserStats({
      totalPredictions: total,
      correctPredictions: correct,
      accuracy: Math.round(accuracy),
      strongestSport: 'Basketball',
      weakestSport: 'Football',
      averageConfidence: 78
    });
  }, [recentPredictions]);

  const analyzeWrongPrediction = (prediction: PredictionHistory) => {
    const reasons: string[] = [];

    if (prediction.confidence > 80) {
      reasons.push('Your confidence was very high, but key factors were overlooked');
    }

    if (prediction.factors.injuries.length > 0) {
      reasons.push(`Key injuries: ${prediction.factors.injuries.join(', ')} significantly impacted the result`);
    }

    return reasons;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all z-50 flex items-center justify-center text-base font-semibold"
        title="AI Coach Assistant"
      >
        AI
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[450px] max-h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col z-40">
          <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold">AI Coach</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-2xl">&times;</button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.accuracy}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.totalPredictions}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Predictions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.averageConfidence}%</div>
                <div className="text-xs text-gray-400">Avg Confidence</div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-white/10">
            {(['analysis', 'learning', 'insights'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab 
                    ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'analysis' && 'Analysis'}
                {tab === 'learning' && 'Learning'}
                {tab === 'insights' && 'Insights'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'insights' && (
              <div className="space-y-3">
                {coachInsights.map((insight, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-gray-900 dark:text-gray-100 font-bold mb-2">{insight.title}</div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm mb-2">{insight.message}</div>
                    <div className="text-gray-900 dark:text-gray-100 text-sm">{insight.actionable}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

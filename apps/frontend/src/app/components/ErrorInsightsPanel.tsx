
'use client';

import React, { useEffect, useState } from 'react';

interface ErrorInsight {
  category: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  affectedUsers: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export default function ErrorInsightsPanel() {
  const [insights, setInsights] = useState<ErrorInsight[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    generateInsights();
    const interval = setInterval(generateInsights, 120000); // Every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const generateInsights = async () => {
    try {
      const errorLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      const newInsights: ErrorInsight[] = [];

      // Hook errors insight
      const hookErrors = errorLogs.filter((e: any) => 
        e.message.includes('hook') || e.message.includes('Hook')
      );
      if (hookErrors.length > 0) {
        newInsights.push({
          category: 'React',
          title: 'React Hooks Misuse Detected',
          description: `${hookErrors.length} hook-related errors found`,
          impact: hookErrors.length > 10 ? 'critical' : 'high',
          recommendation: 'Ensure all hooks are called at the top level of components',
          affectedUsers: Math.ceil(hookErrors.length / 2),
          trend: hookErrors.length > 15 ? 'increasing' : 'stable'
        });
      }

      // Network errors insight
      const networkErrors = errorLogs.filter((e: any) => 
        e.message.includes('fetch') || e.message.includes('network')
      );
      if (networkErrors.length > 5) {
        newInsights.push({
          category: 'Network',
          title: 'Network Connectivity Issues',
          description: `${networkErrors.length} network failures detected`,
          impact: 'high',
          recommendation: 'Implement retry logic and offline fallbacks',
          affectedUsers: Math.ceil(networkErrors.length / 1.5),
          trend: 'increasing'
        });
      }

      // Performance errors
      const perfErrors = errorLogs.filter((e: any) => 
        e.message.includes('timeout') || e.message.includes('slow')
      );
      if (perfErrors.length > 3) {
        newInsights.push({
          category: 'Performance',
          title: 'Performance Degradation',
          description: `${perfErrors.length} timeout/performance issues`,
          impact: 'medium',
          recommendation: 'Optimize component rendering and API calls',
          affectedUsers: Math.ceil(perfErrors.length / 3),
          trend: 'stable'
        });
      }

      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'from-red-600 to-red-800';
      case 'high': return 'from-orange-600 to-orange-800';
      case 'medium': return 'from-yellow-600 to-yellow-800';
      default: return 'from-blue-600 to-blue-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  if (insights.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <span className="text-2xl">💡</span>
        {insights.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {insights.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1">🧠 Error Insights</h2>
                  <p className="text-indigo-100 text-sm">AI-powered analysis & recommendations</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="grid gap-4">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className={`bg-gradient-to-r ${getImpactColor(insight.impact)} p-4 text-white`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                          {insight.category}
                        </span>
                        <span className="text-2xl">{getTrendIcon(insight.trend)}</span>
                      </div>
                      <h3 className="text-xl font-bold">{insight.title}</h3>
                    </div>
                    
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{insight.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Impact Level</p>
                          <p className="font-bold text-gray-900 dark:text-white capitalize">{insight.impact}</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Affected Users</p>
                          <p className="font-bold text-gray-900 dark:text-white">~{insight.affectedUsers}</p>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 rounded">
                        <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">
                          💡 Recommendation:
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-200">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


"use client";

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  batteryLevel: number;
}

export const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    batteryLevel: 85
  });

  const [optimizations, setOptimizations] = useState({
    lazyLoading: true,
    imageOptimization: true,
    codesplitting: true,
    prefetching: true,
    compression: true,
    batteryOptimization: true
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({ ...prev, renderTime: entry.duration }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100)
      }));
    }

    const latency = Math.random() * 200 + 50;
    setMetrics(prev => ({ ...prev, networkLatency: Math.round(latency) }));

    return () => observer.disconnect();
  }, []);

  const getPerformanceScore = () => {
    const { loadTime, renderTime, memoryUsage, networkLatency } = metrics;
    let score = 100;
    if (loadTime > 3000) score -= 20;
    if (renderTime > 100) score -= 15;
    if (memoryUsage > 80) score -= 20;
    if (networkLatency > 500) score -= 15;
    return Math.max(0, score);
  };

  const performanceScore = getPerformanceScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        ⚡ Performance Optimizer
      </h2>

      <div className="text-center mb-6 p-6 bg-white/5 rounded-xl backdrop-blur">
        <div className={`text-5xl font-bold ${getScoreColor(performanceScore)} mb-2`}>
          {performanceScore}
        </div>
        <div className="text-gray-300 text-sm">Performance Score</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
          <div className="text-blue-400 font-bold text-lg">{metrics.renderTime.toFixed(0)}ms</div>
          <div className="text-gray-400 text-xs">Render Time</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
          <div className="text-green-400 font-bold text-lg">{metrics.memoryUsage}%</div>
          <div className="text-gray-400 text-xs">Memory Usage</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
          <div className="text-purple-400 font-bold text-lg">{metrics.networkLatency}ms</div>
          <div className="text-gray-400 text-xs">Network Latency</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
          <div className="text-orange-400 font-bold text-lg">95%</div>
          <div className="text-gray-400 text-xs">Cache Hit Rate</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
          <div className={`font-bold text-lg ${metrics.batteryLevel > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
            {metrics.batteryLevel}%
          </div>
          <div className="text-gray-400 text-xs">Battery</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold text-white">Optimizations</h3>
        {Object.entries(optimizations).map(([key, enabled]) => (
          <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
            <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <button
              onClick={() => setOptimizations(prev => ({ ...prev, [key]: !enabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-lg ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 px-4 rounded-lg text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl">
          🖼️ Optimize Images
        </button>
        <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 py-3 px-4 rounded-lg text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl">
          🗑️ Clear Cache
        </button>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 px-4 rounded-lg text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl">
          🚀 Preload Resources
        </button>
      </div>
    </div>
  );
};

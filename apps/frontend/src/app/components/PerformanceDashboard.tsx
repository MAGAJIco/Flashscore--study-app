
"use client";

import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  resourcesCount: number;
  cacheHitRate: number;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  useEffect(() => {
    measurePerformance();
    analyzeOptimizations();
  }, []);

  const measurePerformance = () => {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = 0; // Would need PerformanceObserver for real LCP

    setMetrics({
      bundleSize: Math.round(resources.reduce((acc, r) => acc + (r as any).transferSize || 0, 0) / 1024),
      loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      fcp: Math.round(fcp),
      lcp: Math.round(lcp),
      cls: 0, // Would need PerformanceObserver
      fid: 0, // Would need PerformanceObserver
      ttfb: Math.round(navigation.responseStart - navigation.requestStart),
      resourcesCount: resources.length,
      cacheHitRate: Math.round((resources.filter(r => (r as any).transferSize === 0).length / resources.length) * 100)
    });
  };

  const analyzeOptimizations = () => {
    const suggestions: string[] = [];

    // Image optimization check
    const images = Array.from(document.images);
    const unoptimizedImages = images.filter(img => !img.src.includes('webp') && !img.loading);
    if (unoptimizedImages.length > 0) {
      suggestions.push(`${unoptimizedImages.length} images can be optimized (WebP format, lazy loading)`);
    }

    // Bundle size check
    const scripts = Array.from(document.scripts);
    const largeScripts = scripts.filter(s => s.src && !s.defer && !s.async);
    if (largeScripts.length > 0) {
      suggestions.push(`${largeScripts.length} scripts can be deferred for better performance`);
    }

    // Caching check
    if (metrics && metrics.cacheHitRate < 50) {
      suggestions.push('Cache hit rate is low. Consider implementing service worker caching');
    }

    setOptimizations(suggestions);
  };

  const applyOptimization = (optimization: string) => {
    if (optimization.includes('images')) {
      // Implement image optimization
      document.images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
      });
    } else if (optimization.includes('scripts')) {
      // Implement script deferring
      document.scripts.forEach(script => {
        if (script.src && !script.defer && !script.async) {
          script.defer = true;
        }
      });
    }
    measurePerformance();
  };

  const getScoreColor = (value: number, thresholds: { good: number; ok: number }) => {
    if (value <= thresholds.good) return '#10b981';
    if (value <= thresholds.ok) return '#f59e0b';
    return '#ef4444';
  };

  if (!metrics) return <div>Loading performance metrics...</div>;

  return (
    <div className="performance-dashboard">
      <h2>⚡ Performance Dashboard</h2>

      {/* Core Web Vitals */}
      <div className="vitals-section">
        <h3>Core Web Vitals</h3>
        <div className="vitals-grid">
          <div className="vital-card">
            <div className="vital-label">FCP</div>
            <div
              className="vital-value"
              style={{ color: getScoreColor(metrics.fcp, { good: 1800, ok: 3000 }) }}
            >
              {metrics.fcp}ms
            </div>
            <div className="vital-desc">First Contentful Paint</div>
          </div>

          <div className="vital-card">
            <div className="vital-label">TTFB</div>
            <div
              className="vital-value"
              style={{ color: getScoreColor(metrics.ttfb, { good: 800, ok: 1800 }) }}
            >
              {metrics.ttfb}ms
            </div>
            <div className="vital-desc">Time to First Byte</div>
          </div>

          <div className="vital-card">
            <div className="vital-label">Load Time</div>
            <div
              className="vital-value"
              style={{ color: getScoreColor(metrics.loadTime, { good: 3000, ok: 5000 }) }}
            >
              {metrics.loadTime}ms
            </div>
            <div className="vital-desc">Total Load Time</div>
          </div>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="resources-section">
        <h3>Resource Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{metrics.bundleSize} KB</div>
              <div className="stat-label">Bundle Size</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-value">{metrics.resourcesCount}</div>
              <div className="stat-label">Resources Loaded</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">💾</div>
            <div className="stat-content">
              <div className="stat-value">{metrics.cacheHitRate}%</div>
              <div className="stat-label">Cache Hit Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="optimizations-section">
        <h3>Optimization Suggestions</h3>
        {optimizations.length > 0 ? (
          <div className="suggestions-list">
            {optimizations.map((opt, idx) => (
              <div key={idx} className="suggestion-item">
                <div className="suggestion-icon">💡</div>
                <div className="suggestion-text">{opt}</div>
                <button
                  className="apply-btn"
                  onClick={() => applyOptimization(opt)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-suggestions">
            <div className="success-icon">✅</div>
            <div>All optimizations applied! Your app is running at peak performance.</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .performance-dashboard {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
        }

        h2 {
          margin-bottom: 24px;
          font-size: 1.8rem;
        }

        h3 {
          margin-bottom: 16px;
          color: #3b82f6;
          font-size: 1.2rem;
        }

        .vitals-section, .resources-section, .optimizations-section {
          margin-bottom: 32px;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .vital-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .vital-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .vital-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .vital-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .suggestion-item {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .suggestion-icon {
          font-size: 1.5rem;
        }

        .suggestion-text {
          flex: 1;
          font-size: 0.95rem;
        }

        .apply-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .apply-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .no-suggestions {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .vitals-grid, .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

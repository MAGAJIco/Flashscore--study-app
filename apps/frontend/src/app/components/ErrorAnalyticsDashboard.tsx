
'use client';

import React, { useState, useEffect } from 'react';

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByEndpoint: Record<string, number>;
  recentErrors: Array<{
    timestamp: string;
    message: string;
    endpoint: string;
    statusCode: number;
  }>;
  errorTrends: Array<{
    hour: string;
    count: number;
  }>;
}

export default function ErrorAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<ErrorMetrics>({
    totalErrors: 0,
    errorsByType: {},
    errorsByEndpoint: {},
    recentErrors: [],
    errorTrends: []
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadErrorMetrics();
    const interval = setInterval(loadErrorMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadErrorMetrics = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      
      const errorsByType: Record<string, number> = {};
      const errorsByEndpoint: Record<string, number> = {};
      const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
      
      const recentErrors = logs
        .filter((log: any) => new Date(log.timestamp).getTime() > last24Hours)
        .slice(0, 20);

      recentErrors.forEach((error: any) => {
        const type = error.message.includes('404') ? '404' : 
                    error.message.includes('500') ? '500' : 'Other';
        errorsByType[type] = (errorsByType[type] || 0) + 1;

        const endpoint = error.url || 'Unknown';
        errorsByEndpoint[endpoint] = (errorsByEndpoint[endpoint] || 0) + 1;
      });

      setMetrics({
        totalErrors: recentErrors.length,
        errorsByType,
        errorsByEndpoint,
        recentErrors: recentErrors.slice(0, 10),
        errorTrends: calculateTrends(recentErrors)
      });
    } catch (e) {
      console.warn('Failed to load error metrics:', e);
    }
  };

  const calculateTrends = (errors: any[]) => {
    const hourlyCount: Record<string, number> = {};
    errors.forEach(error => {
      const hour = new Date(error.timestamp).getHours();
      hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
    });
    return Object.entries(hourlyCount).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count
    }));
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50"
        title="Error Analytics"
      >
        📊 {metrics.totalErrors}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <h2 className="text-2xl font-bold">Error Analytics Dashboard</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
          >
            Close
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Total Errors (24h)</h3>
              <p className="text-3xl font-bold text-red-600">{metrics.totalErrors}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800">Affected Endpoints</h3>
              <p className="text-3xl font-bold text-orange-600">
                {Object.keys(metrics.errorsByEndpoint).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Error Types</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {Object.keys(metrics.errorsByType).length}
              </p>
            </div>
          </div>

          {/* Errors by Type */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Errors by Type</h3>
            <div className="space-y-2">
              {Object.entries(metrics.errorsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <span className="font-medium">{type}</span>
                  <span className="text-2xl font-bold text-red-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Errors */}
          <div>
            <h3 className="text-lg font-bold mb-3">Recent Errors</h3>
            <div className="space-y-2">
              {metrics.recentErrors.map((error, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{error.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {error.endpoint} - Status: {error.statusCode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

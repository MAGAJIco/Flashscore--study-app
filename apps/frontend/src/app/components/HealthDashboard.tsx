
"use client";

import React, { useState, useEffect } from 'react';

interface HealthMetrics {
  uptime: number;
  timestamp: string;
  database: {
    connected: boolean;
    host: string;
    readyState: number;
  };
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
  process: {
    pid: number;
    nodeVersion: string;
    platform: string;
    arch: string;
  };
}

export default function HealthDashboard() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/backend/health/metrics');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data = await res.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-bold text-red-800 mb-2">Error Loading Metrics</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchMetrics}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">System Health Metrics</h2>
        <button 
          onClick={fetchMetrics}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Uptime */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Uptime</h3>
          <p className="text-2xl font-bold text-green-600">{formatUptime(metrics.uptime)}</p>
        </div>

        {/* Database */}
        <div className={`p-4 rounded-lg ${metrics.database.connected ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Database</h3>
          <p className={`text-2xl font-bold ${metrics.database.connected ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.database.connected ? 'Connected' : 'Disconnected'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{metrics.database.host}</p>
        </div>

        {/* Memory Usage */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Memory (Heap)</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.memory.heapUsed}</p>
          <p className="text-xs text-gray-500 mt-1">of {metrics.memory.heapTotal}</p>
        </div>

        {/* RSS Memory */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">RSS Memory</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.memory.rss}</p>
        </div>

        {/* Node Version */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Node.js</h3>
          <p className="text-2xl font-bold text-gray-600">{metrics.process.nodeVersion}</p>
        </div>

        {/* Platform */}
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Platform</h3>
          <p className="text-2xl font-bold text-indigo-600">{metrics.process.platform}</p>
          <p className="text-xs text-gray-500 mt-1">{metrics.process.arch}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date(metrics.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

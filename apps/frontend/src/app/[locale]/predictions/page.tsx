"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HorizontalCarousel } from '@components/HorizontalCarousel';
import PWAInstaller from '@components/PWAInstaller';
import { AdvancedPullToRefreshWrapper, useRefreshListener } from '@components/AdvancedPullToRefreshWrapper';
import { Breadcrumbs } from '@components/Breadcrumbs';
import PredictionDashboard from '@components/PredictionDashboard';

interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"optimized" | "standard">("optimized");
  const [isMounted, setIsMounted] = useState(false);

  // Load viewMode from localStorage after component mounts
  useEffect(() => {
    setIsMounted(true);
    const savedViewMode = localStorage.getItem("viewMode") as "optimized" | "standard";
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
  const refreshInterval = isMobile ? 30000 : 60000;

  const fetchPredictions = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/predictions?limit=10", {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) {
        // If API fails, show empty state instead of error
        setPredictions([]);
        setLoading(false);
        return;
      }
      const data = await res.json();

      // Ensure data is an array
      if (data.success && Array.isArray(data.predictions)) {
        setPredictions(data.predictions);
      } else {
        console.error("API did not return an array:", data);
        setPredictions([]);
      }
    } catch (err: any) {
      console.error("Error fetching predictions:", err);
      setError("Unable to load predictions. Please try again later.");
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen to refresh events
  useRefreshListener((detail) => {
    console.log('Data refreshed:', detail);
    fetchPredictions();
  });

  useEffect(() => {
    if (isMounted) {
      fetchPredictions();
      const interval = setInterval(fetchPredictions, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isMounted, refreshInterval]);

  const toggleView = () => {
    const next = viewMode === "optimized" ? "standard" : "optimized";
    setViewMode(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem("viewMode", next);
    }
  };

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <AdvancedPullToRefreshWrapper
      enableAutoRefresh={true}
      autoRefreshInterval={30000}
      onDataRefresh={fetchPredictions}
      refreshEndpoints={['/api/predictions']}
    >
      <div className="p-4 max-w-4xl mx-auto">
        <Breadcrumbs 
          items={[
            { label: "Predictions" }
          ]}
        />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Live Predictions</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Home
            </Link>
            <button
              onClick={fetchPredictions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Now
            </button>
            <button
              onClick={toggleView}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              {viewMode === "optimized" ? "Switch to Standard" : "Switch to Optimized"}
            </button>
          </div>
        </div>

        {/* Quick Actions Carousel */}
        <div className="my-6">
          <HorizontalCarousel />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-500">Loading predictions...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-500">⚠ {error}</p>
          </div>
        )}

        <ul className="space-y-3">
          {predictions.map((p) => (
            <li key={p.id} className="p-4 bg-white shadow rounded-lg">
              <p className="font-semibold">
                {p.homeTeam} vs {p.awayTeam}
              </p>
              <p>
                Prediction: <span className="font-medium">{p.prediction}</span>
              </p>
              <p className="text-sm text-gray-500">Confidence: {p.confidence}%</p>
            </li>
          ))}
        </ul>

        {viewMode === "standard" && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-bold mb-2">System Health</h2>
            <p className="text-gray-600">✅ All systems operational</p>
            {/* Replace with live system health component */}
          </div>
        )}
      </div>
    </AdvancedPullToRefreshWrapper>
  );
}


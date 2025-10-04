"use client";
import React, { useEffect, useState } from "react";
import HorizontalCarousel from "../components/HorizontalCarousel";
import PWAInstaller from "../components/PWAInstaller";

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
  const [viewMode, setViewMode] = useState<"optimized" | "standard">(
    () => (localStorage.getItem("viewMode") as "optimized" | "standard") || "optimized"
  );

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const refreshInterval = isMobile ? 30000 : 60000;

  const fetchPredictions = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/predictions");
      if (!res.ok) throw new Error("Failed to fetch predictions");
      const data = await res.json();
      setPredictions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const toggleView = () => {
    const next = viewMode === "optimized" ? "standard" : "optimized";
    setViewMode(next);
    localStorage.setItem("viewMode", next);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Live Predictions</h1>
        <div className="flex gap-2">
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

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">⚠ {error}</p>}

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
  );
}
"use client";

import { useEffect, useState } from "react";

interface HealthStatus {
  api: string;
  db: string;
  ml: string;
  uptime: number;
  timestamp: string;
}

export default function SystemHealth() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false); // for dot flash effect

  const fetchStatus = () => {
    setLoading(true);
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setFlash(true); // trigger flash
        setTimeout(() => setFlash(false), 500); // stop after 0.5s
      })
      .catch(() => setStatus(null))
      .finally(() => setTimeout(() => setLoading(false), 500));
  };

  useEffect(() => {
    fetchStatus();

    // Auto-refresh for mobile every 30s
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const interval = setInterval(fetchStatus, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const getColor = (state: string) => {
    if (state === "ok") return "bg-green-500";
    return "bg-red-500";
  };

  if (!status) return <div className="p-4">Loading system health…</div>;

  return (
    <div className="p-4 bg-white shadow rounded-2xl relative">
      <h2 className="text-lg font-semibold mb-2 flex items-center">
        System Health
        {loading && (
          <span className="ml-2 w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
        )}
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <span
            className={`w-3 h-3 rounded-full ${getColor(status.api)} ${
              flash ? "animate-ping-once" : ""
            }`}
          />
          <span>API</span>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`w-3 h-3 rounded-full ${getColor(status.db)} ${
              flash ? "animate-ping-once" : ""
            }`}
          />
          <span>Database</span>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`w-3 h-3 rounded-full ${getColor(status.ml)} ${
              flash ? "animate-ping-once" : ""
            }`}
          />
          <span>ML Service</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Uptime: {Math.round(status.uptime / 60)} min — Last check:{" "}
        {new Date(status.timestamp).toLocaleTimeString()}
      </p>

      <button
        onClick={fetchStatus}
        className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Refresh Now
      </button>
    </div>
  );
}

/* Add this custom animation to globals.css or tailwind.config.css */
@keyframes ping-once {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-ping-once {
  animation: ping-once 0.5s ease-in-out;
}
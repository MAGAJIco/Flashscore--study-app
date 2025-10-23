"use client";

import React, { useState, useEffect } from "react";

// Types
interface Metric {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "online" | "offline" | "maintenance" | "warning";
  metrics?: Metric[];
}

// Live match type from API
interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
  confidence?: string; // Added confidence property
}

// Loading skeleton component
const ModulesGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-48" />
    ))}
  </div>
);

// Error component
const ModulesGridError = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="p-6 text-center">
    <p className="text-red-500 mb-4">{error}</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Retry
    </button>
  </div>
);

// Local storage key
const LOCAL_STORAGE_KEY = "cachedModules";

export default function ModulesGrid() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Load cached modules on mount
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      setModules(JSON.parse(cached));
      setLoading(false);
    }
  }, []);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch matches from API
  const fetchMatches = async (controller?: AbortController) => {
    try {
      setLoading(true);
      setError(null);

      const signal = controller?.signal;
      const res = await fetch("/api/sports-proxy", { signal, headers: { "Cache-Control": "no-cache" } });

      if (!res.ok) throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      const data: Match[] = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format received from server");

      const mappedModules: Module[] = data.map((match) => ({
        id: String(match.id),
        title: `${match.home} vs ${match.away}`,
        description: match.prediction || "Prediction analysis in progress...",
        icon: "⚽",
        status: "online",
        metrics: [
          { label: "Home Team", value: match.home },
          { label: "Away Team", value: match.away },
          { label: "Prediction", value: match.prediction || "TBD" },
          { label: "Confidence", value: match.confidence || "N/A" }
        ],
      }));

      setModules(mappedModules);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mappedModules));
      setRetryCount(0); // Reset retry count on successful fetch
    } catch (err: any) {
      console.error("Failed to fetch matches:", err);
      setError(err.message || "An unknown error occurred");
      setRetryCount((prev) => prev + 1); // Increment retry count on error
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch matches when the component mounts or when offline status changes
  useEffect(() => {
    // Fetch only if online or if we have cached data (loading is false)
    if (isOnline || modules.length > 0) {
      const controller = new AbortController();
      fetchMatches(controller);

      // Cleanup function to abort fetch if component unmounts or dependencies change
      return () => controller.abort();
    } else {
      // If offline and no cached data, set loading to false and show error
      setLoading(false);
      setError("You are offline and no data is available.");
    }
  }, [isOnline, modules.length]); // Re-fetch when online status changes or modules are loaded

  // Effect to retry fetching if there's an error and the network is back online
  useEffect(() => {
    if (error && isOnline && retryCount < 3) { // Limit retries to 3
      const controller = new AbortController();
      const retryTimeout = setTimeout(() => {
        fetchMatches(controller);
      }, 5000); // Retry after 5 seconds

      return () => {
        controller.abort();
        clearTimeout(retryTimeout);
      };
    } else if (error && retryCount >= 3) {
      setError("Failed to load data after multiple retries. Please try again later.");
    }
  }, [error, isOnline, retryCount]);

  // Handle module click
  const handleModuleClick = (id: string) => {
    setSelectedModule(selectedModule === id ? null : id);
  };

  if (loading) return <ModulesGridSkeleton />;
  if (error) return <ModulesGridError error={error} onRetry={() => fetchMatches(new AbortController())} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {modules.map((module) => (
        <div
          key={module.id}
          className={`relative bg-white rounded-lg shadow-md p-5 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
            module.status === "online"
              ? "hover:shadow-lg"
              : module.status === "maintenance"
              ? "opacity-70 grayscale"
              : "opacity-50 grayscale"
          }`}
          onClick={() => handleModuleClick(module.id)}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">{module.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
            <span
              className={`ml-auto text-sm font-medium px-3 py-1 rounded-full ${
                module.status === "online"
                  ? "bg-green-100 text-green-800"
                  : module.status === "maintenance"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {module.status.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{module.description}</p>
          {selectedModule === module.id && module.metrics && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Metrics:</h4>
              <ul className="space-y-2">
                {module.metrics.map((metric, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700">
                    <span>{metric.label}:</span>
                    <span className="font-medium">
                      {metric.value}
                      {metric.trend && (
                        <span
                          className={`ml-2 ${
                            metric.trend === "up"
                              ? "text-green-500"
                              : metric.trend === "down"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {metric.trend === "up" && "▲"}
                          {metric.trend === "down" && "▼"}
                          {metric.trend === "stable" && "▬"}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
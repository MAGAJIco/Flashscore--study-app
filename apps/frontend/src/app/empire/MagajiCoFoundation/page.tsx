"use client";
import React, { useState, useEffect } from "react";
import PhaseCard from "./PhaseCard";
import PowerDisplay from "./PowerDisplay";
import Notification from "./Notification";
import Leaderboard from "./Leaderboard";
import { foundationApi, type Phase } from "@repo/shared";

export default function MagajiCoFoundation() {
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('magajico-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('magajico-user-id', id);
      }
      return id;
    }
    return 'guest';
  });

  const [totalPower, setTotalPower] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>("foundation");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  // Load foundation progress from backend
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const data = await foundationApi.getProgress(userId);
        setPhases(data.phases);
        setTotalPower(data.totalPower);
      } catch (err) {
        console.error('Failed to load foundation progress:', err);
        showNotification('Failed to load progress. Using offline mode.', 'error');
        const buildingPhases = await import('./phasesData');
        setPhases(buildingPhases.default);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  // Simulate building progress
  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        setBuildingProgress((prev) => {
          if (prev >= 100) {
            setIsBuilding(false);
            completeCurrentPhase();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isBuilding]);

  // Check for newly unlocked phases
  useEffect(() => {
    phases.forEach((phase) => {
      if (totalPower >= phase.requiredPower && !phase.unlocked && !phase.completed) {
        setNewlyUnlocked(phase.id);
        showNotification(`🎉 ${phase.name} unlocked!`, 'success');
        setTimeout(() => setNewlyUnlocked(null), 1500);
      }
    });
  }, [totalPower, phases]);

  const startBuilding = async (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    try {
      setCurrentPhase(phaseId);
      setIsBuilding(true);
      setBuildingProgress(0);

      // Optimistic update
      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, building: true } : p))
      );

      // Update backend
      const data = await foundationApi.startBuilding(userId, phaseId);
      setPhases(data.phases);
      setTotalPower(data.totalPower);
      showNotification(`Building ${phase.name}...`, 'info');
    } catch (err) {
      console.error('Failed to start building:', err);
      showNotification('Failed to start building. Retrying...', 'error');
      setIsBuilding(false);
      
      // Revert optimistic update
      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, building: false } : p))
      );
    }
  };

  const completeCurrentPhase = async () => {
    const phase = phases.find(p => p.id === currentPhase);
    
    try {
      const { data, powerBoost } = await foundationApi.completePhase(userId, currentPhase);
      setPhases(data.phases);
      setTotalPower(data.totalPower);
      showNotification(`✨ ${phase?.name} completed! +${powerBoost} power!`, 'success');
    } catch (err) {
      console.error('Failed to complete phase:', err);
      showNotification('Failed to save progress. Please check your connection.', 'error');
      
      // Fallback to local state
      setPhases((prev) =>
        prev.map((p) => {
          if (p.id === currentPhase) {
            const installedComponents = p.components.map((c) => ({
              ...c,
              installed: true,
            }));
            const phaseBoost = installedComponents.reduce(
              (sum, c) => sum + c.powerBoost,
              0
            );
            setTotalPower((prev) => prev + phaseBoost);
            return {
              ...p,
              building: false,
              completed: true,
              components: installedComponents,
            };
          }
          return p;
        })
      );
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      return;
    }

    try {
      const data = await foundationApi.reset(userId);
      setPhases(data.phases);
      setTotalPower(data.totalPower);
      showNotification('Progress reset successfully', 'info');
    } catch (err) {
      console.error('Failed to reset:', err);
      showNotification('Failed to reset progress', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading your empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white transition-all duration-300">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            🏗️ MagajiCo Empire Builder
          </h1>
          <p className="text-xl text-gray-300">
            Building from Foundation to Legendary Rooftop
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors flex items-center gap-2"
          >
            🏆 {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PowerDisplay totalPower={totalPower} />

          {isBuilding && (
            <div className="w-full bg-gray-700 rounded-full h-4 mt-6 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-pink-500 h-4 transition-all duration-100"
                style={{ width: `${buildingProgress}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mt-6">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className={`transition-all duration-700 ${
                  newlyUnlocked === phase.id ? "animate-pulse ring-4 ring-yellow-400 rounded-2xl" : ""
                }`}
              >
                <PhaseCard
                  phase={phase}
                  currentPhase={currentPhase}
                  isBuilding={isBuilding}
                  startBuilding={startBuilding}
                />
              </div>
            ))}
          </div>
        </div>

        {showLeaderboard && (
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
}

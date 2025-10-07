"use client";
import React, { useState, useEffect } from "react";
import PhaseCard from "./PhaseCard";
import PowerDisplay from "./PowerDisplay";
import { foundationApi, type Phase } from "@/lib/api/foundation";

export default function MagajiCoFoundation() {
  const [userId] = useState(() => {
    // Get or create user ID from localStorage
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
  const [error, setError] = useState<string | null>(null);

  // Load foundation progress from backend
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const data = await foundationApi.getProgress(userId);
        setPhases(data.phases);
        setTotalPower(data.totalPower);
        setError(null);
      } catch (err) {
        console.error('Failed to load foundation progress:', err);
        setError('Failed to load progress. Using offline mode.');
        // Fallback to local state if API fails
        const buildingPhases = await import('./phasesData');
        setPhases(buildingPhases.default);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  // ⏳ Simulate building progress
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

  // ⚡ Check for newly unlocked phases
  useEffect(() => {
    phases.forEach((phase) => {
      if (totalPower >= phase.requiredPower && !phase.unlocked && !phase.completed) {
        setNewlyUnlocked(phase.id);
        setTimeout(() => setNewlyUnlocked(null), 1500);
      }
    });
  }, [totalPower, phases]);

  const startBuilding = async (phaseId: string) => {
    try {
      setCurrentPhase(phaseId);
      setIsBuilding(true);
      setBuildingProgress(0);

      // Update backend
      const data = await foundationApi.startBuilding(userId, phaseId);
      setPhases(data.phases);
      setTotalPower(data.totalPower);
    } catch (err) {
      console.error('Failed to start building:', err);
      setError('Failed to start building. Please try again.');
      setIsBuilding(false);
      
      // Fallback to local state
      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, building: true } : p))
      );
    }
  };

  const completeCurrentPhase = async () => {
    try {
      // Complete phase on backend
      const { data, powerBoost } = await foundationApi.completePhase(userId, currentPhase);
      setPhases(data.phases);
      setTotalPower(data.totalPower);
      setError(null);
    } catch (err) {
      console.error('Failed to complete phase:', err);
      setError('Failed to complete phase. Please try again.');
      
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
      <h1 className="text-center text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
        🏗️ MagajiCo Empire Builder
      </h1>
      <p className="text-center text-xl text-gray-300 mb-6">
        Building from Foundation to Legendary Rooftop
      </p>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 text-yellow-200">
          ⚠️ {error}
        </div>
      )}

      <PowerDisplay totalPower={totalPower} />

      {isBuilding && (
        <div className="w-full max-w-lg mx-auto bg-gray-700 rounded-full h-4 mt-6 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-pink-500 h-4 transition-all duration-100"
            style={{ width: `${buildingProgress}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
  );
}

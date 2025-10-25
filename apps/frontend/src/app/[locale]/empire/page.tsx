"use client";
import React, { useState, useEffect } from "react";
import PhaseCard from "./MagajiCoFoundation/PhaseCard";
import PowerDisplay from "./MagajiCoFoundation/PowerDisplay";
import Notification from "./MagajiCoFoundation/Notification";
import Leaderboard from "./MagajiCoFoundation/Leaderboard";
import { foundationApi, type Phase } from "@/lib/api/foundation";
import { Breadcrumbs } from '@components/Breadcrumbs';

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
        const response = await fetch(`/api/backend/foundation/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch foundation data');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
        } else {
          // Use default phases
          const defaultPhases = [
            {
              id: "foundation",
              name: "Foundation Stage",
              description: "Laying the groundwork of the MagajiCo Empire.",
              requiredPower: 0,
              unlocked: true,
              building: false,
              completed: false,
              components: [
                { name: "Vision Blueprint", type: "ai" as const, powerBoost: 10, installed: false },
                { name: "Faith Reinforcement", type: "community" as const, powerBoost: 5, installed: false },
              ],
            },
            {
              id: "structure",
              name: "Structural Stage",
              description: "Building the pillars of leadership and strength.",
              requiredPower: 15,
              unlocked: false,
              building: false,
              completed: false,
              components: [
                { name: "Discipline Beam", type: "security" as const, powerBoost: 10, installed: false },
                { name: "Growth Column", type: "prediction" as const, powerBoost: 10, installed: false },
              ],
            },
            {
              id: "finishing",
              name: "Finishing Touch",
              description: "Refining excellence for visibility and influence.",
              requiredPower: 30,
              unlocked: false,
              building: false,
              completed: false,
              components: [
                { name: "Brand Polish", type: "crypto" as const, powerBoost: 15, installed: false },
                { name: "Strategic Reach", type: "ai" as const, powerBoost: 20, installed: false },
              ],
            },
            {
              id: "rooftop",
              name: "Legendary Rooftop",
              description: "Your empire now shines across generations.",
              requiredPower: 60,
              unlocked: false,
              building: false,
              completed: false,
              components: [
                { name: "Legacy Seal", type: "community" as const, powerBoost: 25, installed: false },
                { name: "Cultural Impact", type: "security" as const, powerBoost: 30, installed: false },
              ],
            },
          ];
          setPhases(defaultPhases as any);
        }
      } catch (err) {
        console.error('Failed to load foundation progress:', err);
        showNotification('Failed to load progress. Using offline mode.', 'error');
        // Use default phases on error
        const defaultPhases = [
          {
            id: "foundation",
            name: "Foundation Stage",
            description: "Laying the groundwork of the MagajiCo Empire.",
            requiredPower: 0,
            unlocked: true,
            building: false,
            completed: false,
            components: [
              { name: "Vision Blueprint", type: "ai" as const, powerBoost: 10, installed: false },
              { name: "Faith Reinforcement", type: "community" as const, powerBoost: 5, installed: false },
            ],
          },
          {
            id: "structure",
            name: "Structural Stage",
            description: "Building the pillars of leadership and strength.",
            requiredPower: 15,
            unlocked: false,
            building: false,
            completed: false,
            components: [
              { name: "Discipline Beam", type: "security" as const, powerBoost: 10, installed: false },
              { name: "Growth Column", type: "prediction" as const, powerBoost: 10, installed: false },
            ],
          },
          {
            id: "finishing",
            name: "Finishing Touch",
            description: "Refining excellence for visibility and influence.",
            requiredPower: 30,
            unlocked: false,
            building: false,
            completed: false,
            components: [
              { name: "Brand Polish", type: "crypto" as const, powerBoost: 15, installed: false },
              { name: "Strategic Reach", type: "ai" as const, powerBoost: 20, installed: false },
            ],
          },
          {
            id: "rooftop",
            name: "Legendary Rooftop",
            description: "Your empire now shines across generations.",
            requiredPower: 60,
            unlocked: false,
            building: false,
            completed: false,
            components: [
              { name: "Legacy Seal", type: "community" as const, powerBoost: 25, installed: false },
              { name: "Cultural Impact", type: "security" as const, powerBoost: 30, installed: false },
            ],
          },
        ];
        setPhases(defaultPhases as any);
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

  // Check for newly unlocked phases - FIXED LINE 198
  useEffect(() => {
    phases.forEach((phase) => {
      if (phase.requiredPower !== undefined && totalPower >= phase.requiredPower && !phase.unlocked && !phase.completed) {
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
      const response = await fetch(`/api/backend/foundation/${userId}/start-building`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
        }
      }

      showNotification(`Building ${phase.name}...`, 'info');
    } catch (err) {
      console.error('Failed to start building:', err);
      showNotification('Building in offline mode...', 'info');
    }
  };

  const completeCurrentPhase = async () => {
    const phase = phases.find(p => p.id === currentPhase);

    try {
      const response = await fetch(`/api/backend/foundation/${userId}/complete-phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId: currentPhase })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
          showNotification(`✨ ${phase?.name} completed! +${result.powerBoost} power!`, 'success');
          return;
        }
      }

      throw new Error('Failed to complete phase');
    } catch (err) {
      console.error('Failed to complete phase:', err);

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
            showNotification(`✨ ${phase?.name} completed! +${phaseBoost} power!`, 'success');
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
      const response = await fetch(`/api/backend/foundation/${userId}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
          showNotification('Progress reset successfully', 'info');
        }
      } else {
        throw new Error('Failed to reset');
      }
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
      <Breadcrumbs 
        items={[
          { label: "Empire", href: "/empire" },
          { label: "Foundation" }
        ]}
      />

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
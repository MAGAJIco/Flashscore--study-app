
"use client";

import React, { useState, useEffect } from "react";
import { PhaseCard } from "../../components/PhaseCard";
import { PowerDisplay } from "../../components/PowerDisplay";
import { foundationApi, type Phase } from "@/lib/api/foundation";

interface FoundationFeatureProps {
  userId: string;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function FoundationFeature({ userId, onNotification }: FoundationFeatureProps) {
  const [totalPower, setTotalPower] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>("foundation");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [userId]);

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

  useEffect(() => {
    phases.forEach((phase) => {
      if (phase.requiredPower !== undefined && totalPower >= phase.requiredPower && !phase.unlocked && !phase.completed) {
        setNewlyUnlocked(phase.id);
        onNotification(`🎉 ${phase.name} unlocked!`, 'success');
        setTimeout(() => setNewlyUnlocked(null), 1500);
      }
    });
  }, [totalPower, phases]);

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
        setPhases(getDefaultPhases());
      }
    } catch (err) {
      console.error('Failed to load foundation progress:', err);
      onNotification('Failed to load progress. Using offline mode.', 'error');
      setPhases(getDefaultPhases());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPhases = (): Phase[] => {
    return [
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
  };

  const startBuilding = async (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    try {
      setCurrentPhase(phaseId);
      setIsBuilding(true);
      setBuildingProgress(0);

      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, building: true } : p))
      );

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

      onNotification(`Building ${phase.name}...`, 'info');
    } catch (err) {
      console.error('Failed to start building:', err);
      onNotification('Building in offline mode...', 'info');
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
          onNotification(`✨ ${phase?.name} completed! +${result.powerBoost} power!`, 'success');
          return;
        }
      }

      throw new Error('Failed to complete phase');
    } catch (err) {
      console.error('Failed to complete phase:', err);

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
            onNotification(`✨ ${phase?.name} completed! +${phaseBoost} power!`, 'success');
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading your empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
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
  );
}

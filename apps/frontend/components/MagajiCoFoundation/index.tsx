"use client";
import React, { useState, useEffect } from "react";
import PhaseCard from "./PhaseCard";
import PowerDisplay from "./PowerDisplay";
import buildingPhases from "./phasesData";

interface Component {
  name: string;
  type: "ai" | "prediction" | "community" | "crypto" | "security";
  powerBoost: number;
  installed: boolean;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  requiredPower: number;
  unlocked: boolean;
  building: boolean;
  completed: boolean;
  components: Component[];
}

export default function MagajiCoFoundation() {
  const [totalPower, setTotalPower] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>("foundation");
  const [phases, setPhases] = useState<Phase[]>(buildingPhases);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

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

  // ⚡ Unlock new phases based on total power
  useEffect(() => {
    setPhases((prev) =>
      prev.map((phase) => {
        const unlocked = totalPower >= phase.requiredPower;
        if (unlocked && !phase.unlocked && !phase.completed) {
          setNewlyUnlocked(phase.id);
          setTimeout(() => setNewlyUnlocked(null), 1500);
        }
        return { ...phase, unlocked };
      })
    );
  }, [totalPower]);

  const startBuilding = (phaseId: string) => {
    setCurrentPhase(phaseId);
    setIsBuilding(true);
    setBuildingProgress(0);
    setPhases((prev) =>
      prev.map((p) => (p.id === phaseId ? { ...p, building: true } : p))
    );
  };

  const completeCurrentPhase = () => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white transition-all duration-300">
      <h1 className="text-center text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
        🏗️ MagajiCo Empire Builder
      </h1>
      <p className="text-center text-xl text-gray-300 mb-6">
        Building from Foundation to Legendary Rooftop
      </p>

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
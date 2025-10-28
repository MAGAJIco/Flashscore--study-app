
import React from 'react';
import { Phase } from '@/lib/api/foundation';

interface PhaseCardProps {
  phase: Phase;
  currentPhase: string;
  isBuilding: boolean;
  startBuilding: (phaseId: string) => void;
}

export function PhaseCard({ phase, currentPhase, isBuilding, startBuilding }: PhaseCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${
      phase.unlocked ? 'border-yellow-400/50' : 'border-white/20'
    }`}>
      <h3 className="text-2xl font-bold text-white mb-2">{phase.name}</h3>
      <p className="text-gray-300 mb-4">{phase.description}</p>
      
      {!phase.unlocked && (
        <div className="text-yellow-400 text-sm mb-4">
          Requires {phase.requiredPower} Power to unlock
        </div>
      )}

      {phase.unlocked && !phase.completed && (
        <button
          onClick={() => startBuilding(phase.id)}
          disabled={isBuilding && currentPhase !== phase.id}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isBuilding && currentPhase === phase.id
              ? 'bg-yellow-500 text-gray-900'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isBuilding && currentPhase === phase.id ? 'Building...' : 'Start Building'}
        </button>
      )}

      {phase.completed && (
        <div className="text-green-400 text-center py-3 font-semibold">
          ✅ Completed
        </div>
      )}
    </div>
  );
}

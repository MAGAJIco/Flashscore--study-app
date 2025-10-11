import React from "react";
import ComponentTile from "./ComponentTile";

interface Component {
  name: string;
  type: 'ai' | 'prediction' | 'community' | 'crypto' | 'security';
  powerBoost: number;
  installed: boolean;
}

interface PhaseCardProps {
  phase: {
    id: string;
    name: string;
    description: string;
    requiredPower: number;
    unlocked: boolean;
    building: boolean;
    completed: boolean;
    components: Component[];
  };
  currentPhase: string;
  isBuilding: boolean;
  startBuilding: (phaseId: string) => void;
}

export default function PhaseCard({ phase, currentPhase, isBuilding, startBuilding }: PhaseCardProps) {
  return (
    <div className={`
      relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-300
      ${phase.completed ? 'border-green-500 bg-green-900/20' : 
        phase.unlocked ? 'border-blue-500 hover:border-yellow-500' : 
        'border-gray-600 opacity-50'}
    `}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold">{phase.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{phase.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Required Power</div>
          <div className="text-lg font-bold text-yellow-400">{phase.requiredPower}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {phase.components.map((comp, idx) => (
          <ComponentTile key={idx} {...comp} />
        ))}
      </div>

      <div className="flex justify-center">
        {phase.completed ? (
          <div className="text-green-400 font-bold">✅ Phase Complete!</div>
        ) : phase.building ? (
          <div className="text-blue-400 font-bold">🚧 Building...</div>
        ) : phase.unlocked ? (
          <button
            onClick={() => startBuilding(phase.id)}
            disabled={isBuilding}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
          >
            🏗️ Start Building
          </button>
        ) : (
          <div className="text-gray-500 font-bold">🔒 Locked (Need {phase.requiredPower} Power)</div>
        )}
      </div>

      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
        {phase.id}
      </div>
    </div>
  );
}

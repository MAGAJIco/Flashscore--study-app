import React from "react";

interface PowerDisplayProps {
  totalPower: number;
  maxPower?: number;
}

export default function PowerDisplay({ totalPower, maxPower = 500 }: PowerDisplayProps) {
  const getPowerColor = (power: number) => {
    if (power < 100) return '#ef4444';
    if (power < 250) return '#f59e0b';
    if (power < 400) return '#10b981';
    return '#8b5cf6';
  };

  return (
    <div className="mt-6 flex justify-center">
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-500">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: getPowerColor(totalPower) }}>
            ⚡ {totalPower}
          </div>
          <div className="text-sm text-gray-400">Total Empire Power</div>
          <div className="mt-3 w-64 bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (totalPower / maxPower) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

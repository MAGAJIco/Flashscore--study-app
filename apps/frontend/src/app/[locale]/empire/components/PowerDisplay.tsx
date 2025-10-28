
import React from 'react';

interface PowerDisplayProps {
  totalPower: number;
}

export default function PowerDisplay({ totalPower }: PowerDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-300 mb-2">Total Empire Power</h2>
          <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ⚡ {totalPower}
          </div>
        </div>
        <div className="text-6xl">
          👑
        </div>
      </div>
    </div>
  );
}

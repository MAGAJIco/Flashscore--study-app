import React from "react";

interface ComponentTileProps {
  name: string;
  type: 'ai' | 'prediction' | 'community' | 'crypto' | 'security';
  powerBoost: number;
  installed: boolean;
}

const icons: Record<string, string> = {
  ai: '🤖',
  prediction: '🔮',
  community: '👥',
  crypto: '💰',
  security: '🛡️'
};

export default function ComponentTile({ name, type, powerBoost, installed }: ComponentTileProps) {
  return (
    <div className={`
      p-3 rounded-lg border transition-all duration-200
      ${installed ? 'bg-green-900/30 border-green-500' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}
    `}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icons[type]}</span>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-400">+{powerBoost} Power</div>
        </div>
      </div>
      {installed && <div className="text-green-400 text-xs mt-1">✅ Installed</div>}
    </div>
  );
}

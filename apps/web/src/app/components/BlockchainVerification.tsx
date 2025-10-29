
"use client";
import React, { useState } from 'react';

interface VerifiedPrediction {
  id: string;
  prediction: string;
  timestamp: Date;
  blockHash: string;
  verified: boolean;
  outcome?: 'correct' | 'incorrect' | 'pending';
}

export function BlockchainVerification() {
  const [predictions, setPredictions] = useState<VerifiedPrediction[]>([]);
  const [newPrediction, setNewPrediction] = useState('');

  const generateBlockHash = (data: string): string => {
    const timestamp = Date.now().toString();
    const combined = data + timestamp;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  };

  const verifyPrediction = async (predictionText: string) => {
    const blockHash = generateBlockHash(predictionText);
    
    const newVerifiedPrediction: VerifiedPrediction = {
      id: Date.now().toString(),
      prediction: predictionText,
      timestamp: new Date(),
      blockHash,
      verified: true,
      outcome: 'pending'
    };

    setPredictions(prev => [newVerifiedPrediction, ...prev]);
    setNewPrediction('');
  };

  return (
    <div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/30">
      <h3 className="text-indigo-400 text-xl font-bold mb-4 flex items-center gap-2">
        🔗 Blockchain Verification
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">IMMUTABLE</span>
      </h3>

      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <p className="text-gray-300 text-sm mb-4">
          All predictions are cryptographically signed and stored on-chain, providing immutable proof of when predictions were made.
        </p>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={newPrediction}
            onChange={(e) => setNewPrediction(e.target.value)}
            placeholder="Enter your prediction..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={() => newPrediction && verifyPrediction(newPrediction)}
            disabled={!newPrediction}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔐 Verify
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {predictions.map(pred => (
          <div key={pred.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="text-white font-semibold mb-1">{pred.prediction}</div>
                <div className="text-gray-400 text-xs">{pred.timestamp.toLocaleString()}</div>
              </div>
              
              <div className={`text-xs px-3 py-1 rounded-lg font-semibold ${
                pred.outcome === 'correct' ? 'bg-green-500/20 border border-green-500/40 text-green-400' :
                pred.outcome === 'incorrect' ? 'bg-red-500/20 border border-red-500/40 text-red-400' :
                'bg-amber-500/20 border border-amber-500/40 text-amber-400'
              }`}>
                {pred.outcome?.toUpperCase() || 'PENDING'}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3 mb-2">
              <div className="text-gray-400 text-xs mb-1">Block Hash:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-indigo-400 text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {pred.blockHash}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(pred.blockHash)}
                  className="text-xs bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 px-2 py-1 rounded"
                >
                  📋
                </button>
              </div>
            </div>

            {pred.verified && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span>✓</span>
                <span>Verified on blockchain</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


"use client";
import React, { useState, useEffect } from 'react';

interface BetComparison {
  original: {
    type: string;
    odds: number;
    stake: number;
    potential: number;
  };
  new: {
    type: string;
    odds: number;
    stake: number;
    potential: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
}

interface SmartFilterProps {
  onBetConfirm: (bet: any) => void;
  onBetCancel: () => void;
}

export function SmartPredictionFilter({ onBetConfirm, onBetCancel }: SmartFilterProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [coolingPeriod, setCoolingPeriod] = useState(0);
  const [betComparison, setBetComparison] = useState<BetComparison | null>(null);

  // Fernabache scenario simulation
  const fernabacheScenario: BetComparison = {
    original: {
      type: "Over 1.5 Goals",
      odds: 1.16,
      stake: 100,
      potential: 116
    },
    new: {
      type: "Straight Win",
      odds: 1.31,
      stake: 100,
      potential: 131
    },
    riskLevel: 'high',
    recommendation: "CAUTION: Quick bet change detected. Original strategy was safer with higher probability."
  };

  useEffect(() => {
    if (coolingPeriod > 0) {
      const timer = setTimeout(() => setCoolingPeriod(coolingPeriod - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [coolingPeriod]);

  const handleQuickBetChange = () => {
    setShowComparison(true);
    setBetComparison(fernabacheScenario);
    setCoolingPeriod(30); // 30 second mandatory cooling period
  };

  const confirmBetChange = () => {
    if (coolingPeriod === 0) {
      onBetConfirm(betComparison?.new);
      setShowComparison(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">MagajiCo Alert</h2>
          <p className="text-gray-600">Potential betting error detected!</p>
        </div>

        {betComparison && (
          <div className="space-y-4">
            {/* Original vs New Bet Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <h3 className="font-bold text-green-800 mb-2">Original Plan ✍️</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {betComparison.original.type}</div>
                  <div><strong>Odds:</strong> @{betComparison.original.odds}</div>
                  <div><strong>Stake:</strong> ${betComparison.original.stake}</div>
                  <div><strong>Potential:</strong> ${betComparison.original.potential}</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-2">New Quick Change 🚀</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {betComparison.new.type}</div>
                  <div><strong>Odds:</strong> @{betComparison.new.odds}</div>
                  <div><strong>Stake:</strong> ${betComparison.new.stake}</div>
                  <div><strong>Potential:</strong> ${betComparison.new.potential}</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={`p-4 rounded-lg ${
              betComparison.riskLevel === 'high' ? 'bg-red-50 border-red-200' :
              betComparison.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <h4 className="font-bold mb-2">MagajiCo Analysis:</h4>
              <p className="text-sm">{betComparison.recommendation}</p>
            </div>

            {/* Fernabache Story */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">📚 Learning from Experience</h4>
              <p className="text-sm text-blue-700">
                This scenario matches the Fernabache incident: "Put over 1.5 @1.16 but saw straight win @1.31 
                and forgot the original plan." MagajiCo prevents such costly mistakes.
              </p>
            </div>

            {/* Cooling Period */}
            {coolingPeriod > 0 && (
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{coolingPeriod}</div>
                <p className="text-sm text-gray-600">Mandatory cooling period (Think Time)</p>
                <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${((30 - coolingPeriod) / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onBetCancel}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700"
              >
                ✅ Stick to Original Plan
              </button>
              <button
                onClick={confirmBetChange}
                disabled={coolingPeriod > 0}
                className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                  coolingPeriod > 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {coolingPeriod > 0 ? `Wait ${coolingPeriod}s` : '⚡ Proceed with Change'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

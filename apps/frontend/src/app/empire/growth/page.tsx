"use client";
import React, { useState, useEffect } from 'react';
import GrowthDashboard from '../components/GrowthDashboard';
import EmpireLeaderboard from '../components/EmpireLeaderboard';
import { foundationApi } from '../../../../../../packages/shared/src/libs/utils/apifoundation';

export default function GrowthPage() {
  const [userId, setUserId] = useState<string>('');
  const [totalPower, setTotalPower] = useState(0);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('magajico-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('magajico-user-id', id);
      }
      setUserId(id);
      loadFoundationData(id);
    }
  }, []);

  const loadFoundationData = async (uid: string) => {
    try {
      setLoading(true);
      const data = await foundationApi.getProgress(uid);
      setPhases(data.phases);
      setTotalPower(data.totalPower);
    } catch (error) {
      console.error('Failed to load foundation data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-700 rounded w-1/3"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📈 Empire Growth</h1>
          <p className="text-gray-300">
            Track your prediction performance and grow your empire through sports intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GrowthDashboard 
              userId={userId}
              totalPower={totalPower}
              phases={phases}
            />
          </div>

          <div>
            <EmpireLeaderboard />
          </div>
        </div>

        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">About Empire Growth</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Your Empire Growth score measures your sports prediction performance and determines your rank in the MagajiCo Empire.
            </p>
            <p>
              <strong className="text-white">Win Rate:</strong> The percentage of correct predictions you've made. Higher win rates unlock better empire ranks.
            </p>
            <p>
              <strong className="text-white">Streak:</strong> Consecutive correct predictions give you bonus power and unlock special achievements.
            </p>
            <p>
              <strong className="text-white">Empire Ranks:</strong> Progress from Foundation Builder to Legendary Rooftop by improving your prediction accuracy and volume.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              💡 Tip: Use AI suggestions to guide your next moves and accelerate your empire growth!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

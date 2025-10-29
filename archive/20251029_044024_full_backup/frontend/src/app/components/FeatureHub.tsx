
"use client";
import React, { useState, useEffect } from "react";
import { useMobile } from '@/app/hooks/useMobile';

interface FeatureGroup {
  id: string;
  title: string;
  icon: string;
  color: string;
  features: Feature[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'beta';
  usage: number;
  performance: number;
}

const FeatureHub: React.FC = () => {
  const isMobile = useMobile();
  const [activeGroup, setActiveGroup] = useState<string>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>([]);

  useEffect(() => {
    loadFeatureData();
    loadSystemHealth();
  }, []);

  const loadFeatureData = () => {
    const groups: FeatureGroup[] = [
      {
        id: 'payments',
        title: 'Payment System',
        icon: '💳',
        color: 'from-green-500 to-emerald-600',
        features: [
          { id: 'pi-network', name: 'Pi Network Integration', description: 'Native Pi cryptocurrency payments', status: 'active', usage: 85, performance: 92 },
          { id: 'paypal', name: 'PayPal Gateway', description: 'Traditional payment processing', status: 'active', usage: 65, performance: 88 },
          { id: 'stripe', name: 'Stripe Integration', description: 'Card payments and subscriptions', status: 'beta', usage: 45, performance: 95 },
          { id: 'wallet', name: 'Pi Coin Wallet', description: 'Internal coin management system', status: 'active', usage: 90, performance: 89 }
        ]
      },
      {
        id: 'predictions',
        title: 'AI Predictions',
        icon: '🤖',
        color: 'from-purple-500 to-indigo-600',
        features: [
          { id: 'ml-model', name: 'ML Model', description: 'Advanced prediction algorithms', status: 'active', usage: 95, performance: 96 },
          { id: 'confidence', name: 'Confidence Scoring', description: 'Real-time confidence calculations', status: 'active', usage: 88, performance: 94 },
          { id: 'multi-source', name: 'Multi-Source Data', description: 'Aggregate predictions from multiple APIs', status: 'active', usage: 92, performance: 91 }
        ]
      },
      {
        id: 'social',
        title: 'Social Features',
        icon: '👥',
        color: 'from-pink-500 to-rose-600',
        features: [
          { id: 'feed', name: 'Social Feed', description: 'Community activity stream', status: 'active', usage: 78, performance: 89 },
          { id: 'challenges', name: 'Friend Challenges', description: 'Competitive predictions', status: 'active', usage: 82, performance: 91 },
          { id: 'chat', name: 'Live Chat', description: 'Real-time match discussions', status: 'beta', usage: 65, performance: 87 }
        ]
      },
      {
        id: 'analytics',
        title: 'Analytics Dashboard',
        icon: '📊',
        color: 'from-blue-500 to-cyan-600',
        features: [
          { id: 'performance', name: 'Performance Metrics', description: 'Track your prediction accuracy', status: 'active', usage: 75, performance: 93 },
          { id: 'insights', name: 'AI Insights', description: 'Personalized recommendations', status: 'active', usage: 68, performance: 90 }
        ]
      }
    ];

    setFeatureGroups(groups);
  };

  const loadSystemHealth = async () => {
    try {
      const health = { 
        status: 'healthy', 
        uptime: 99.9, 
        metrics: { loadTime: 245, cacheHitRate: 0.87 }
      };
      setSystemHealth(health);
    } catch (error) {
      console.error('Error loading system health:', error);
    }
  };

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white text-sm">{feature.name}</h4>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
          feature.status === 'active' ? 'bg-green-500/20 text-green-300' : 
          feature.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300' : 
          'bg-gray-500/20 text-gray-300'
        }`}>
          {feature.status.toUpperCase()}
        </div>
      </div>
      <p className="text-gray-300 text-xs mb-3">{feature.description}</p>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Usage</span>
            <span className="text-cyan-400 font-semibold">{feature.usage}%</span>
          </div>
          <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full" style={{ width: `${feature.usage}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Performance</span>
            <span className="text-green-400 font-semibold">{feature.performance}%</span>
          </div>
          <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full" style={{ width: `${feature.performance}%` }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            🎯 Feature Management Hub
          </h1>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
            <span className="absolute right-4 top-3.5 text-gray-400">🔍</span>
          </div>

          {systemHealth && (
            <div className="flex items-center gap-4 flex-wrap">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                systemHealth.status === 'healthy' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <span className="text-xs">{systemHealth.status === 'healthy' ? '✅' : '❌'}</span>
                <span className="text-xs font-semibold text-white">System {systemHealth.status}</span>
              </div>
              <span className="text-xs text-gray-400">
                Load: {systemHealth.metrics.loadTime}ms | Cache: {(systemHealth.metrics.cacheHitRate * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {featureGroups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeGroup === group.id
                  ? `bg-gradient-to-r ${group.color} text-white shadow-lg`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{group.icon}</span>
              {!isMobile && group.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureGroups
            .find(group => group.id === activeGroup)
            ?.features.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
        </div>
      </div>
    </div>
  );
};

export { FeatureHub };

'use client';

import React, { useState } from 'react';
import { 
  SecurePaymentHandler, 
  ConnectedNewsFeed, 
  EnhancedLiveTracker, 
  MLPredictionInterface, 
  PlatformShowcase 
} from '@/app/components';
import { PredictionHub } from '@/app/components/PredictionHub';


export default function TestFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'payment' | 'news' | 'live' | 'ml' | 'showcase' | 'prediction-hub'>('showcase');

  const tabs = [
    { id: 'showcase', label: 'Platform Showcase' },
    { id: 'payment', label: 'Secure Payments' },
    { id: 'news', label: 'News Feed' },
    { id: 'live', label: 'Live Tracker' },
    { id: 'ml', label: 'ML Predictions' },
    { id: 'prediction-hub', label: 'Prediction Hub' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Features Testing Hub</h1>
          <p className="text-gray-400">Test all platform features in one place</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature Display */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'showcase' && (
            <div className="fade-in">
              <PlatformShowcase />
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="max-w-2xl mx-auto">
              <SecurePaymentHandler 
                onSuccess={(id) => alert(`Payment successful! ID: ${id}`)}
                onError={(err) => alert(`Payment failed: ${err}`)}
              />
            </div>
          )}
          {activeTab === 'news' && <ConnectedNewsFeed />}
          {activeTab === 'live' && <EnhancedLiveTracker />}
          {activeTab === 'ml' && <MLPredictionInterface />}
          {activeTab === 'prediction-hub' && (
            <div className="fade-in">
              <PredictionHub 
                showMLInterface={true}
                showModelDashboard={true}
                showLivePredictions={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
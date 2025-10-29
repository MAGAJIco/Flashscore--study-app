'use client';

import React, { useState } from 'react';
import { Brain, Shield, TrendingUp, Users, Zap, Lock, Star, Trophy } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'ai' | 'security' | 'social' | 'premium';
  status: 'active' | 'beta' | 'coming-soon';
}

export const PlatformShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const features: Feature[] = [
    {
      id: '1',
      title: 'ML Prediction Engine',
      description: '87% accuracy AI-powered sports predictions using advanced machine learning models',
      icon: <Brain className="w-8 h-8" />,
      category: 'ai',
      status: 'active'
    },
    {
      id: '2',
      title: 'Secure Payments',
      description: 'PCI-compliant payment processing with age verification and fraud protection',
      icon: <Shield className="w-8 h-8" />,
      category: 'security',
      status: 'active'
    },
    {
      id: '3',
      title: 'Live Match Tracking',
      description: 'Real-time match updates with probability tracking and instant notifications',
      icon: <TrendingUp className="w-8 h-8" />,
      category: 'premium',
      status: 'active'
    },
    {
      id: '4',
      title: 'Community Predictions',
      description: 'Share predictions, challenge friends, and compete on global leaderboards',
      icon: <Users className="w-8 h-8" />,
      category: 'social',
      status: 'active'
    },
    {
      id: '5',
      title: 'Real-time Analysis',
      description: 'AI-powered match analysis with strategic insights and betting recommendations',
      icon: <Zap className="w-8 h-8" />,
      category: 'ai',
      status: 'beta'
    },
    {
      id: '6',
      title: 'COPPA Compliance',
      description: 'Child-safe environment with parental controls and age verification',
      icon: <Lock className="w-8 h-8" />,
      category: 'security',
      status: 'active'
    },
    {
      id: '7',
      title: 'Expert Network',
      description: 'Follow professional analysts and learn from top predictors',
      icon: <Star className="w-8 h-8" />,
      category: 'social',
      status: 'beta'
    },
    {
      id: '8',
      title: 'Achievement System',
      description: 'Earn rewards, unlock badges, and climb the prediction rankings',
      icon: <Trophy className="w-8 h-8" />,
      category: 'premium',
      status: 'active'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', color: 'blue' },
    { id: 'ai', label: 'AI & ML', color: 'purple' },
    { id: 'security', label: 'Security', color: 'green' },
    { id: 'social', label: 'Social', color: 'pink' },
    { id: 'premium', label: 'Premium', color: 'amber' }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Active</span>;
      case 'beta':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Beta</span>;
      case 'coming-soon':
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Platform Features
          </h1>
          <p className="text-xl text-gray-300">
            Comprehensive sports prediction platform with AI-powered insights
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                {getStatusBadge(feature.status)}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
            <p className="text-4xl font-bold text-blue-400 mb-2">87%</p>
            <p className="text-gray-300">ML Accuracy</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
            <p className="text-4xl font-bold text-green-400 mb-2">100%</p>
            <p className="text-gray-300">COPPA Compliant</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
            <p className="text-4xl font-bold text-purple-400 mb-2">24/7</p>
            <p className="text-gray-300">Live Updates</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
            <p className="text-4xl font-bold text-amber-400 mb-2">50+</p>
            <p className="text-gray-300">Leagues Covered</p>
          </div>
        </div>
      </div>
    </div>
  );
};
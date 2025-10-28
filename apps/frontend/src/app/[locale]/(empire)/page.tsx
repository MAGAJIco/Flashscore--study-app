"use client";
import React, { useState, useEffect } from "react";
import { LiveCarousel } from '@/app/components/carousels/LiveCarousel';
import { NewsCarousel } from '@/app/components/carousels/NewsCarousel';
import { GoogleStyleNav } from '@/app/components/GoogleStyleNav';
import { AppDrawer } from '@/app/components/layout/AppDrawer';
import FoundationFeature from "./features/foundation/FoundationFeature";
import LeaderboardFeature from "./features/leaderboard/LeaderboardFeature";
import AchievementsFeature from "./features/achievements/AchievementsFeature";
import { useEmpireVisibility } from '@/app/hooks';
import Link from 'next/link';

type TabType = 'foundation' | 'leaderboard' | 'achievements';

const navigationApps = [
  { id: 'portal', name: 'Portal', icon: '🏠', route: '/en/MagajiCoFoundation' },
  { id: 'empire', name: 'Empire', icon: '👑', route: '/en' },
  { id: 'predictions', name: 'Predictions', icon: '🤖', route: '/en/ai-predictions' },
  { id: 'live', name: 'Live', icon: '⚡', route: '/en/matches' },
  { id: 'social', name: 'Social', icon: '👥', route: '/en/feed' },
  { id: 'authors', name: 'Authors', icon: '✍️', route: '/en/author' },
  { id: 'news', name: 'News', icon: '📰', route: '/en/news' },
  { id: 'rewards', name: 'Rewards', icon: '🏆', route: '/en/achievements' },
  { id: 'analytics', name: 'Analytics', icon: '📊', route: '/en/analytics' },
];

const featureApps = [
  {
    id: 'portal',
    name: 'Portal',
    icon: '🏠',
    description: 'Central hub & navigation',
    routes: ['dashboard/', 'welcome/', 'quick-access/'],
  },
  {
    id: 'predictions',
    name: 'Predictions',
    icon: '🤖',
    description: 'AI-powered forecasting',
    routes: ['matches/', 'confidence/', 'history/'],
  },
  {
    id: 'live',
    name: 'Live',
    icon: '⚡',
    description: 'Real-time match tracking',
    routes: ['scorecard/', 'commentary/', 'highlights/'],
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    description: 'Community & engagement',
    routes: ['feed/', 'challenges/', 'chat/', 'forum/'],
  },
  {
    id: 'kids',
    name: 'Kids Mode',
    icon: '🎮',
    description: 'Safe environment for children',
    routes: ['dashboard/', 'quizzes/', 'learning/'],
  },
  {
    id: 'rewards',
    name: 'Rewards',
    icon: '🏆',
    description: 'Achievements & gamification',
    routes: ['achievements/', 'leaderboard/', 'coins/'],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'Performance insights',
    routes: ['stats/', 'trends/', 'reports/'],
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: '💬',
    description: 'Live discussions',
    routes: ['rooms/', 'messages/', 'notifications/'],
  },
  {
    id: 'challenges',
    name: 'Challenges',
    icon: '🎯',
    description: 'Competitive tasks',
    routes: ['daily/', 'tournaments/', 'prizes/'],
  },
];

const benefits = [
  'Better Organization',
  'Easier Maintenance',
  'Improved Performance',
  'Team Scalability',
  'Independent Testing',
  'Flexible Deployment',
];

const implementationStatus = [
  {
    title: 'Frontend Route Groups',
    status: 'complete',
    description: 'All feature route groups created with proper layouts and navigation updated',
  },
  {
    title: 'Backend Modules',
    status: 'complete',
    description: 'Module structure created and routes reorganized with feature grouping',
  },
  {
    title: 'Service Layer',
    status: 'progress',
    description: 'Currently refactoring service layers for each module',
  },
  {
    title: 'Testing & Deployment',
    status: 'pending',
    description: 'Feature-specific testing and deployment pipeline setup',
  },
];

const nextSteps = [
  'Move remaining components into feature directories',
  'Create service layers for each module',
  'Add module-specific middleware',
  'Implement feature-specific testing',
];

export default function EmpirePage() {
  const { isVisible } = useEmpireVisibility();
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('magajico-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('magajico-user-id', id);
      }
      return id;
    }
    return 'guest';
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('foundation');
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phases, setPhases] = useState<any[]>([]);
  const [totalPower, setTotalPower] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('current_user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleAchievementUnlocked = (achievement: any) => {
    showNotification(`🏆 Achievement Unlocked: ${achievement.title}`, 'success');
  };

  const tabs = [
    { id: 'foundation' as TabType, label: 'Foundation', icon: '🏗️' },
    { id: 'leaderboard' as TabType, label: 'Leaderboard', icon: '🏆' },
    { id: 'achievements' as TabType, label: 'Achievements', icon: '⭐' },
  ];

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/backend/foundation/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch foundation data');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
        } else {
          const defaultPhases = [
            {
              id: "foundation",
              name: "Foundation Stage",
              description: "Laying the groundwork of the MagajiCo Empire.",
              requiredPower: 0,
              unlocked: true,
              building: false,
              completed: false,
              components: [
                { name: "Vision Blueprint", type: "ai" as const, powerBoost: 10, installed: false },
                { name: "Faith Reinforcement", type: "community" as const, powerBoost: 5, installed: false },
              ],
            },
            {
              id: "structure",
              name: "Structural Stage",
              description: "Building the pillars of leadership and strength.",
              requiredPower: 15,
              unlocked: false,
              building: false,
              completed: false,
              components: [
                { name: "Discipline Beam", type: "security" as const, powerBoost: 10, installed: false },
                { name: "Growth Column", type: "prediction" as const, powerBoost: 10, installed: false },
              ],
            },
            {
              id: "finishing",
              name: "Finishing Touch",
              description: "Refining excellence for visibility and influence.",
              requiredPower: 30,
              unlocked: false,
              building: false,
              completed: false,
              components: [
                { name: "Brand Polish", type: "crypto" as const, powerBoost: 15, installed: false },
                { name: "Strategic Reach", type: "ai" as const, powerBoost: 20, installed: false },
              ],
            },
            {
              id: "rooftop",
              name: "Legendary Rooftop",
              description: "Your empire now shines across generations.",
              requiredPower: 60,
              unlocked: false,
              building: false,
              completed: false,
              components: [
                { name: "Legacy Seal", type: "community" as const, powerBoost: 25, installed: false },
                { name: "Cultural Impact", type: "security" as const, powerBoost: 30, installed: false },
              ],
            },
          ];
          setPhases(defaultPhases as any);
        }
      } catch (err) {
        console.error('Failed to load foundation progress:', err);
        showNotification('Failed to load progress. Using offline mode.', 'error');
        const defaultPhases = [
          {
            id: "foundation",
            name: "Foundation Stage",
            description: "Laying the groundwork of the MagajiCo Empire.",
            requiredPower: 0,
            unlocked: true,
            building: false,
            completed: false,
            components: [
              { name: "Vision Blueprint", type: "ai" as const, powerBoost: 10, installed: false },
              { name: "Faith Reinforcement", type: "community" as const, powerBoost: 5, installed: false },
            ],
          },
          {
            id: "structure",
            name: "Structural Stage",
            description: "Building the pillars of leadership and strength.",
            requiredPower: 15,
            unlocked: false,
            building: false,
            completed: false,
            components: [
              { name: "Discipline Beam", type: "security" as const, powerBoost: 10, installed: false },
              { name: "Growth Column", type: "prediction" as const, powerBoost: 10, installed: false },
            ],
          },
          {
            id: "finishing",
            name: "Finishing Touch",
            description: "Refining excellence for visibility and influence.",
            requiredPower: 30,
            unlocked: false,
            building: false,
            completed: false,
            components: [
              { name: "Brand Polish", type: "crypto" as const, powerBoost: 15, installed: false },
              { name: "Strategic Reach", type: "ai" as const, powerBoost: 20, installed: false },
            ],
          },
          {
            id: "rooftop",
            name: "Legendary Rooftop",
            description: "Your empire now shines across generations.",
            requiredPower: 60,
            unlocked: false,
            building: false,
            completed: false,
            components: [
              { name: "Legacy Seal", type: "community" as const, powerBoost: 25, installed: false },
              { name: "Cultural Impact", type: "security" as const, powerBoost: 30, installed: false },
            ],
          },
        ];
        setPhases(defaultPhases as any);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        setBuildingProgress((prev) => {
          if (prev >= 100) {
            setIsBuilding(false);
            completeCurrentPhase();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isBuilding]);

  useEffect(() => {
    phases.forEach((phase) => {
      if (phase.requiredPower !== undefined && totalPower >= phase.requiredPower && !phase.unlocked && !phase.completed) {
        setNewlyUnlocked(phase.id);
        showNotification(`🎉 ${phase.name} unlocked!`, 'success');
        setTimeout(() => setNewlyUnlocked(null), 1500);
      }
    });
  }, [totalPower, phases]);

  const startBuilding = async (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    try {
      setCurrentPhase(phaseId);
      setIsBuilding(true);
      setBuildingProgress(0);

      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, building: true } : p))
      );

      const response = await fetch(`/api/backend/foundation/${userId}/start-building`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
        }
      }

      showNotification(`Building ${phase.name}...`, 'info');
    } catch (err) {
      console.error('Failed to start building:', err);
      showNotification('Building in offline mode...', 'info');
    }
  };

  const completeCurrentPhase = async () => {
    const phase = phases.find(p => p.id === currentPhase);

    try {
      const response = await fetch(`/api/backend/foundation/${userId}/complete-phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId: currentPhase })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
          showNotification(`✨ ${phase?.name} completed! +${result.powerBoost} power!`, 'success');
          return;
        }
      }

      throw new Error('Failed to complete phase');
    } catch (err) {
      console.error('Failed to complete phase:', err);

      setPhases((prev) =>
        prev.map((p) => {
          if (p.id === currentPhase) {
            const installedComponents = p.components.map((c) => ({
              ...c,
              installed: true,
            }));
            const phaseBoost = installedComponents.reduce(
              (sum, c) => sum + c.powerBoost,
              0
            );
            setTotalPower((prev) => prev + phaseBoost);
            showNotification(`✨ ${phase?.name} completed! +${phaseBoost} power!`, 'success');
            return {
              ...p,
              building: false,
              completed: true,
              components: installedComponents,
            };
          }
          return p;
        })
      );
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/backend/foundation/${userId}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPhases(result.data.phases);
          setTotalPower(result.data.totalPower);
          showNotification('Progress reset successfully', 'info');
        }
      } else {
        throw new Error('Failed to reset');
      }
    } catch (err) {
      console.error('Failed to reset:', err);
      showNotification('Failed to reset progress', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading your empire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <GoogleStyleNav apps={navigationApps} />

      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slideInRight">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <p>{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <header className="text-center text-white mb-10 animate-fadeInDown">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">
            🏗️ Sports Central
          </h1>
          <p className="text-xl md:text-2xl opacity-95">
            Feature-Based Architecture Documentation
          </p>
        </header>

        <div className="mb-8 bg-white rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold text-indigo-600 mb-4 flex items-center gap-3">
            📖 Overview
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Sports Central is a production-ready monorepo sports prediction and community platform built with Next.js (Frontend), 
            Fastify (Backend), and FastAPI (ML Service). It features AI-powered predictions, live scores, interactive experiences, 
            and community rewards. The platform provides a comprehensive multi-sport experience inspired by FlashScore, incorporating 
            real-time data, personalized content, and engaging user interfaces.
          </p>
        </div>

        <div className="mb-8">
          <LiveCarousel />
        </div>

        <div className="mb-8">
          <NewsCarousel />
        </div>

        <div className="mb-8 bg-white rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
            🎯 Feature Apps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureApps.map((app, index) => (
              <div
                key={app.id}
                className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-400 cursor-pointer"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
                  <span className="text-3xl">{app.icon}</span>
                  {app.name}
                </h3>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <ul className="space-y-2">
                  {app.routes.map((route, idx) => (
                    <li
                      key={idx}
                      className="text-gray-500 text-sm py-2 border-b border-gray-200 last:border-0 hover:text-indigo-600 hover:pl-2 transition-all"
                    >
                      {route}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">
            🚀 Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-100 to-pink-100 p-5 rounded-xl font-semibold text-gray-800 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                ✅ {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">
            🔄 Data Flow Architecture
          </h2>
          <div className="bg-gray-900 text-gray-200 p-6 rounded-xl overflow-x-auto font-mono text-sm md:text-base">
            Frontend Apps → Backend Modules → Database<br />
            ↓<br />
            ML Service → Predictions
          </div>
          <p className="mt-4 text-gray-600">
            Clean separation of concerns with each layer handling specific responsibilities. 
            The ML service operates independently, providing predictions to the backend modules.
          </p>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">
            📊 Implementation Status
          </h2>
          <div className="space-y-6 pl-8 border-l-4 border-indigo-600">
            {implementationStatus.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="absolute -left-10 top-6 w-4 h-4 rounded-full bg-white border-4 border-indigo-600"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  {item.title}
                  <span
                    className={`text-sm px-4 py-1 rounded-full font-semibold ${
                      item.status === 'complete'
                        ? 'bg-green-500 text-white'
                        : item.status === 'progress'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}
                  >
                    {item.status === 'complete' ? '✅ Complete' : item.status === 'progress' ? '🔄 In Progress' : '⏳ Pending'}
                  </span>
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl p-8 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">
            🚀 Next Steps - 4 Upcoming Priorities
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-l-4 border-indigo-600 hover:pl-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium group-hover:text-indigo-600 transition-colors">
                      {step}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                  : 'bg-white/90 text-indigo-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={activeTab === 'foundation' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {activeTab === 'foundation' && (
              <FoundationFeature 
                userId={userId} 
                onNotification={showNotification}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsFeature 
                currentUser={currentUser}
                onAchievementUnlocked={handleAchievementUnlocked}
              />
            )}

            {activeTab === 'leaderboard' && (
              <LeaderboardFeature />
            )}
          </div>

          {activeTab === 'foundation' && (
            <div className="lg:col-span-1">
              <LeaderboardFeature />
            </div>
          )}
        </div>

        <footer className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-10 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">About Sports Central</h3>
              <p className="text-gray-300 text-sm">
                AI-powered sports prediction and community platform with real-time analytics.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/en/ai-predictions" className="text-gray-300 hover:text-white transition-colors">Predictions</Link></li>
                <li><Link href="/en/matches" className="text-gray-300 hover:text-white transition-colors">Live Matches</Link></li>
                <li><Link href="/en/news" className="text-gray-300 hover:text-white transition-colors">News</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/en/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/en/partnerships" className="text-gray-300 hover:text-white transition-colors">Partnerships</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/en/feed" className="text-gray-300 hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/en/author" className="text-gray-300 hover:text-white transition-colors">Authors</Link></li>
                <li><a href="mailto:support@sportscentral.com" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-300 text-sm">
                © 2025 Sports Central. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs">
                Sports Central Architecture v2.0.0 | Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease backwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease;
        }
      `}</style>
    </div>
  );
}

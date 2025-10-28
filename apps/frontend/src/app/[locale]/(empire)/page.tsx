"use client";
import React, { useState, useEffect } from "react";
import { LiveCarousel } from '@/app/components/carousels/LiveCarousel';
import { NewsCarousel } from '@/app/components/carousels/NewsCarousel';
import { AppDrawer } from '@/app/components/layout/AppDrawer';
import { FoundationFeature } from "./features/foundation/FoundationFeature";
import { LeaderboardFeature } from "./features/leaderboard/LeaderboardFeature";
import { AchievementsFeature } from "./features/achievements/AchievementsFeature";
import { useEmpireVisibility } from '@/app/hooks';

type TabType = 'foundation' | 'leaderboard' | 'achievements';

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
    // Load current user data
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

  // Load foundation progress from backend
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
          // Use default phases
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
        // Use default phases on error
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

  // Simulate building progress
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

  // Check for newly unlocked phases - FIXED LINE 198
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

      // Optimistic update
      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, building: true } : p))
      );

      // Update backend
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

      // Fallback to local state
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
    <div className="min-h-screen p-6 text-white transition-all duration-300">
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slideInRight">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            👑 MagajiCo Empire
          </h1>
          <p className="text-xl text-gray-300">
            Build Your Legacy from Foundation to Legendary Status
          </p>
        </div>
      </div>

      {/* App Drawer Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAppDrawerOpen(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all"
        >
          🏗️ Apps
        </button>
      </div>

      {/* Live Matches Carousel */}
      <div className="mb-6">
        <LiveCarousel />
      </div>

      {/* Latest News Carousel */}
      <div className="mb-6">
        <NewsCarousel />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* App Drawer */}
      <AppDrawer isOpen={appDrawerOpen} onClose={() => setAppDrawerOpen(false)} />

      {/* Feature Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
"use client";
import React, { Suspense, useState } from "react";
import ComprehensiveSportsHub from "@/components/ComprehensiveSportsHub";
import SocialHub from "./components/SocialHub";
import PredictionLeague from "./components/PredictionLeague";
import SocialPredictionStreams from "./components/SocialPredictionStreams";
import MicroPredictions from "./components/MicroPredictions";
import CrossPlatformSync from "./components/CrossPlatformSync";
import SmartLoadingState from "./components/SmartLoadingState";
import SmartErrorRecovery from "./components/SmartErrorRecovery";
import OfflineQueueManager from "./components/OfflineQueueManager";
import AuthorsLeaderboard from "./components/AuthorsLeaderboard";
import MagajiCoManager from "./components/MagajiCoManager";
import PredictionPreview from "./components/PredictionPreview";
import PredictiveConfidenceEvolution from "./components/PredictiveConfidenceEvolution";
import AICoachAssistant from "./components/AICoachAssistant";
import PredictiveAlertSystem from "./components/PredictiveAlertSystem";
import UserProfile from "./components/UserProfile";
import PullToRefresh from './components/PullToRefresh';
import BackendHealthMonitor from './components/BackendHealthMonitor';
import UserFavorites from './components/UserFavorites';
import SmartPersonalization from './components/SmartPersonalization';
import DraggableWidgets from './components/DraggableWidgets';
import SmartOnboarding from './components/SmartOnboarding';
import QuickAccessBar from './components/QuickAccessBar';
import { useHapticFeedback } from './components/HapticFeedback';
import EnhancedPersonalization from './components/EnhancedPersonalization';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useHapticFeedback();

  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes

    console.log('Refreshing...');
    setIsRefreshing(true);

    try {
      // Refresh data sources
      await Promise.all([
        fetch('/api/predictions?limit=100').catch(e => console.error('Predictions refresh failed:', e)),
        fetch('/api/authors?top=10').catch(e => console.error('Authors refresh failed:', e))
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsRefreshing(false);
    }
  };

  return (
    <SmartErrorRecovery>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e1e1e 100%)',
        display: 'flex',
        flexDirection: 'row'
      }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: sidebarOpen ? '280px' : '70px',
          background: 'linear-gradient(180deg, rgba(13, 17, 23, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          overflowY: 'auto',
          overflowX: 'hidden',
          left: 0,
          top: 0
        }}>
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '100%',
              padding: '20px',
              background: 'transparent',
              border: 'none',
              color: '#00ff88',
              cursor: 'pointer',
              fontSize: '1.5rem',
              textAlign: sidebarOpen ? 'right' : 'center'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>

          {/* Menu Items */}
          <div style={{ padding: sidebarOpen ? '20px' : '10px' }}>
            {[
              { id: 'home', icon: '🏠', label: 'Home' },
              { id: 'profile', icon: '👤', label: 'Profile' },
              { id: 'empire', icon: '🏗️', label: 'Empire Builder' },
              { id: 'predictions', icon: '📊', label: 'Predictions' },
              { id: 'authors', icon: '✍️', label: 'Authors' },
              { id: 'social', icon: '💬', label: 'Social' },
              { id: 'streams', icon: '📡', label: 'Live Streams' },
              { id: 'micro', icon: '⚡', label: 'Quick Bets' },
              { id: 'sync', icon: '🔄', label: 'Sync' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  padding: sidebarOpen ? '15px 20px' : '12px 10px',
                  marginBottom: '10px',
                  background: activeSection === item.id
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 162, 255, 0.2))'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: activeSection === item.id
                    ? '1px solid rgba(0, 255, 136, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: activeSection === item.id ? '#00ff88' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: sidebarOpen ? '1rem' : '0.9rem',
                  fontWeight: activeSection === item.id ? '600' : '400',
                  transition: 'all 0.3s ease',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <span style={{ fontSize: sidebarOpen ? '1.2rem' : '1rem' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          marginLeft: sidebarOpen ? '280px' : '70px',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          overflowY: 'auto',
          height: '100vh',
          width: `calc(100% - ${sidebarOpen ? '280px' : '70px'})`
        }}>
          {showOnboarding && (
            <SmartOnboarding onComplete={() => setShowOnboarding(false)} />
          )}

          <QuickAccessBar />

          <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
            {activeSection === 'home' && (
              <>
                <Suspense fallback={<SmartLoadingState type="dashboard" />}>
                  <ComprehensiveSportsHub />
                </Suspense>
                <Suspense fallback={<SmartLoadingState type="card" />}>
                  <PredictiveConfidenceEvolution />
                </Suspense>
              </>
            )}

            {activeSection === 'profile' && (
              <Suspense fallback={<SmartLoadingState type="card" count={3} />}>
                <UserProfile />
              </Suspense>
            )}

            {activeSection === 'empire' && (
              <Suspense fallback={<SmartLoadingState type="card" count={2} />}>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.1))',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}>
                    <h1 style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(to right, #ffd700, #ff8c00)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '20px'
                    }}>
                      🏗️ MagajiCo Empire Builder
                    </h1>
                    <p style={{ color: '#ccc', marginBottom: '20px' }}>
                      Build your empire from foundation to legendary rooftop. Chat with MagajiCo AI CEO for strategic predictions and insights.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <a
                        href="/empire/MagajiCoFoundation"
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                          color: '#000',
                          borderRadius: '10px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          display: 'inline-block'
                        }}
                      >
                        Start Building
                      </a>
                      <a
                        href="/empire/growth"
                        style={{
                          padding: '12px 24px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          border: '1px solid rgba(255, 215, 0, 0.5)',
                          borderRadius: '10px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          display: 'inline-block'
                        }}
                      >
                        View Growth
                      </a>
                    </div>
                  </div>
                  <MagajiCoManager isOpen={true} />
                </div>
              </Suspense>
            )}

            {activeSection === 'predictions' && (
              <Suspense fallback={<SmartLoadingState type="card" count={3} />}>
                <PredictionLeague />
              </Suspense>
            )}

            {activeSection === 'authors' && (
              <Suspense fallback={<SmartLoadingState type="card" count={5} />}>
                <div style={{ marginBottom: '30px' }}>
                  <AuthorsLeaderboard />
                </div>
              </Suspense>
            )}

            {activeSection === 'social' && (
              <Suspense fallback={<SmartLoadingState type="list" count={5} />}>
                <SocialHub />
              </Suspense>
            )}

            {activeSection === 'streams' && (
              <Suspense fallback={<SmartLoadingState type="chart" />}>
                <SocialPredictionStreams />
              </Suspense>
            )}

            {activeSection === 'micro' && (
              <Suspense fallback={<SmartLoadingState type="card" count={4} />}>
                <MicroPredictions />
              </Suspense>
            )}

            {activeSection === 'sync' && (
              <Suspense fallback={<SmartLoadingState type="card" />}>
                <CrossPlatformSync />
              </Suspense>
            )}

            <OfflineQueueManager />

            {/* Enhanced Personalization Section */}
            <EnhancedPersonalization />

            {/* Floating AI Features - Available on all sections */}
            <AICoachAssistant />
            <PredictiveAlertSystem />
          </PullToRefresh>
        </div>
      </div>
    </SmartErrorRecovery>
  );
}
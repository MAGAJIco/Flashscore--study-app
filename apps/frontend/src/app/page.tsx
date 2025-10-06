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

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SmartErrorRecovery>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e1e1e 100%)',
        display: 'flex'
      }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: sidebarOpen ? '280px' : '70px',
          background: 'linear-gradient(180deg, rgba(13, 17, 23, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          overflowY: 'auto',
          overflowX: 'hidden'
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
                  padding: sidebarOpen ? '15px 20px' : '15px 10px',
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
                  fontSize: sidebarOpen ? '1rem' : '1.2rem',
                  fontWeight: activeSection === item.id ? '600' : '400',
                  transition: 'all 0.3s ease',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <span>{item.icon}</span>
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
          overflowY: 'auto'
        }}>
          {activeSection === 'home' && (
            <>
              <Suspense fallback={<SmartLoadingState type="dashboard" />}>
                <ComprehensiveSportsHub />
              </Suspense>
            </>
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
        </div>
      </div>
    </SmartErrorRecovery>
  );
}
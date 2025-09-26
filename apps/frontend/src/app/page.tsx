"use client";

import { useState, useEffect } from "react";
import EnhancedCEOSportsDashboard from "./components/EnhancedCEOSportsDashboard";
import ComprehensiveSportsHub from "./components/ComprehensiveSportsHub";
import UnifiedSoccerHub from "./components/UnifiedSoccerHub";

export default function HomePage() {
  const [currentDashboard, setCurrentDashboard] = useState('ceo');
  const [backendStatus, setBackendStatus] = useState("checking...");

  useEffect(() => {
    // Test backend health endpoint with retry logic
    const checkBackend = async () => {
      try {
        const response = await fetch("/api/backend/health");
        if (response.ok) {
          setBackendStatus("✅ Connected");
        } else {
          throw new Error(`Backend returned ${response.status}`);
        }
      } catch (error) {
        console.warn("Backend connection failed:", error);
        setBackendStatus("❌ Disconnected");
        // Retry after 5 seconds
        setTimeout(checkBackend, 5000);
      }
    };

    checkBackend();
  }, []);

  const DashboardSelector = () => (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      padding: '8px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <button
        onClick={() => setCurrentDashboard('ceo')}
        style={{
          background: currentDashboard === 'ceo' ? 'linear-gradient(135deg, #00ff88, #00a2ff)' : 'transparent',
          color: currentDashboard === 'ceo' ? '#000' : '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        🏆 CEO
      </button>
      <button
        onClick={() => setCurrentDashboard('comprehensive')}
        style={{
          background: currentDashboard === 'comprehensive' ? 'linear-gradient(135deg, #00ff88, #00a2ff)' : 'transparent',
          color: currentDashboard === 'comprehensive' ? '#000' : '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        📊 Pro
      </button>
      <button
        onClick={() => setCurrentDashboard('soccer')}
        style={{
          background: currentDashboard === 'soccer' ? 'linear-gradient(135deg, #00ff88, #00a2ff)' : 'transparent',
          color: currentDashboard === 'soccer' ? '#000' : '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        ⚽ Soccer
      </button>
    </div>
  );

  const renderDashboard = () => {
    switch (currentDashboard) {
      case 'ceo':
        return <EnhancedCEOSportsDashboard />;
      case 'comprehensive':
        return <ComprehensiveSportsHub />;
      case 'soccer':
        return <UnifiedSoccerHub />;
      default:
        return <EnhancedCEOSportsDashboard />;
    }
  };

  return (
    <>
      <DashboardSelector />
      {renderDashboard()}

      {/* Status indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 1000
      }}>
        Backend: {backendStatus}
      </div>
    </>
  );
}
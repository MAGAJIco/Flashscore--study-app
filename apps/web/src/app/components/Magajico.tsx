
'use client';

import React from 'react';

export function Magajico() {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button className="nav-btn" onClick={() => window.location.href = '/en'}>
          <div className="nav-icon">🏠</div>
          <div className="nav-label">Home</div>
        </button>
        
        <button className="nav-btn" onClick={() => window.location.href = '/en/predictions'}>
          <div className="nav-icon">🎯</div>
          <div className="nav-label">Predictions</div>
        </button>
        
        <button className="nav-btn" onClick={() => window.location.href = '/en/matches'}>
          <div className="nav-icon">⚡</div>
          <div className="nav-label">Live</div>
        </button>
        
        <button className="nav-btn" onClick={() => window.location.href = '/en/social/feed'}>
          <div className="nav-icon">👥</div>
          <div className="nav-label">Social</div>
        </button>
        
        <button className="nav-btn" onClick={() => window.location.href = '/en/achievements'}>
          <div className="nav-icon">🏆</div>
          <div className="nav-label">Rewards</div>
        </button>
      </nav>

      <style jsx global>{`
        /* Mobile Bottom Navigation */
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          padding-bottom: max(8px, env(safe-area-inset-bottom));
          z-index: 100;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #666;
          position: relative;
        }

        .nav-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-3px);
        }

        .nav-btn:active {
          transform: translateY(0);
          background: rgba(102, 126, 234, 0.15);
        }

        .nav-icon {
          font-size: 26px;
          transition: all 0.3s ease;
          filter: grayscale(0.5);
        }

        .nav-btn:hover .nav-icon {
          transform: scale(1.15);
          filter: grayscale(0);
        }

        .nav-label {
          font-size: 11px;
          font-weight: 600;
          color: inherit;
          transition: color 0.3s ease;
        }

        .nav-btn:hover .nav-label {
          color: #667eea;
        }

        /* Hide mobile nav on desktop */
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

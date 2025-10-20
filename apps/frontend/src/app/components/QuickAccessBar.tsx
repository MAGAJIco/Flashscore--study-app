
"use client";

import React, { useState, useEffect } from 'react';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  badge?: number;
}

const QuickAccessBar: React.FC<{ actions?: QuickAction[] }> = ({ actions }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultActions: QuickAction[] = actions || [
    {
      id: 'favorites',
      icon: '⭐',
      label: 'Favorites',
      action: () => console.log('Favorites'),
      badge: 3
    },
    {
      id: 'predictions',
      icon: '🎯',
      label: 'Live Predictions',
      action: () => console.log('Predictions'),
      badge: 5
    },
    {
      id: 'rewards',
      icon: '🪙',
      label: 'Rewards',
      action: () => console.log('Rewards')
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Alerts',
      action: () => console.log('Notifications'),
      badge: 2
    }
  ];

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'flex-end'
    }}>
      {/* Quick Actions */}
      {isExpanded && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {defaultActions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.action}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s',
                animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-5px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
              <span style={{ 
                color: '#1f2937', 
                fontWeight: '600',
                fontSize: '0.9rem' 
              }}>
                {action.label}
              </span>
              {action.badge && action.badge > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '700'
                }}>
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
          transition: 'all 0.3s',
          fontSize: '1.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
        }}
      >
        {isExpanded ? '✕' : '⚡'}
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default QuickAccessBar;

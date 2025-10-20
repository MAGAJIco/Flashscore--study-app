
"use client";
import React, { useState } from 'react';

interface FloatingActionButtonsProps {
  currentUser: any;
  onAchievementsClick: () => void;
  onLiveChatClick: () => void;
  onChallengesClick: () => void;
  isMobile: boolean;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  currentUser,
  onAchievementsClick,
  onLiveChatClick,
  onChallengesClick,
  isMobile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const buttons = [
    {
      id: 'achievements',
      icon: '🏆',
      label: 'Achievements',
      color: '#f59e0b',
      onClick: onAchievementsClick
    },
    {
      id: 'chat',
      icon: '💬',
      label: 'Live Chat',
      color: '#22c55e',
      onClick: onLiveChatClick
    },
    {
      id: 'challenges',
      icon: '🎯',
      label: 'Challenges',
      color: '#6366f1',
      onClick: onChallengesClick
    }
  ];

  if (!currentUser || isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '30px',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      {/* Action Buttons */}
      {isExpanded && buttons.map((button, index) => (
        <div
          key={button.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.3s ease ${index * 0.1}s`
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {button.label}
          </div>
          
          <button
            onClick={button.onClick}
            aria-label={button.label}
            title={button.label}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${button.color}, ${button.color}dd)`,
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid white';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            <span aria-hidden="true">{button.icon}</span>
          </button>
        </div>
      ))}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isExpanded}
        title={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid white';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        <span aria-hidden="true">{isExpanded ? '✕' : '⚡'}</span>
      </button>
    </div>
  );
};

export default FloatingActionButtons;

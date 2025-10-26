
'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Bell, Zap, BarChart3, Star, Activity } from 'lucide-react';

interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  category: 'predictions' | 'stats' | 'social' | 'rewards';
}

export function PortalWidgetSystem() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [layout, setLayout] = useState<string[]>([]);

  useEffect(() => {
    // Load user's saved widget layout
    const savedLayout = localStorage.getItem('portal-widget-layout');
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(['quick-predict', 'live-matches', 'achievements']);
    }
  }, []);

  const availableWidgets: Widget[] = [
    {
      id: 'quick-predict',
      title: 'Quick Predictions',
      size: 'medium',
      category: 'predictions',
      component: <QuickPredictWidget />
    },
    {
      id: 'live-matches',
      title: 'Live Matches',
      size: 'large',
      category: 'predictions',
      component: <LiveMatchesWidget />
    },
    {
      id: 'achievements',
      title: 'Recent Achievements',
      size: 'small',
      category: 'rewards',
      component: <AchievementsWidget />
    },
    {
      id: 'accuracy-stats',
      title: 'Your Stats',
      size: 'medium',
      category: 'stats',
      component: <AccuracyStatsWidget />
    },
    {
      id: 'activity-feed',
      title: 'Activity Feed',
      size: 'large',
      category: 'social',
      component: <ActivityFeedWidget />
    }
  ];

  const saveLayout = (newLayout: string[]) => {
    setLayout(newLayout);
    localStorage.setItem('portal-widget-layout', JSON.stringify(newLayout));
  };

  return (
    <div className="portal-widget-system">
      <div className="widgets-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>
          🎯 Your Portal Dashboard
        </h2>
        <button
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ⚙️ Customize Layout
        </button>
      </div>

      <div className="widgets-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {layout.map(widgetId => {
          const widget = availableWidgets.find(w => w.id === widgetId);
          if (!widget) return null;

          return (
            <div
              key={widget.id}
              className={`widget widget-${widget.size}`}
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                gridColumn: widget.size === 'large' ? 'span 2' : 'span 1'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>
                  {widget.title}
                </h3>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer'
                }}>
                  ⋮
                </button>
              </div>
              {widget.component}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Widget Components
function QuickPredictWidget() {
  return (
    <div style={{ color: 'white' }}>
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '12px',
        transition: 'all 0.3s ease'
      }} className="hover-lift">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.9rem' }}>Lakers vs Warriors</span>
          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>🔴 LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="prediction-button" style={{
            flex: 1,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            fontWeight: '600'
          }}>
            Lakers Win
          </button>
          <button className="prediction-button-secondary" style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            fontWeight: '600'
          }}>
            Warriors Win
          </button>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
        ⚡ 3 more matches available for quick predictions
      </p>
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          background: rgba(16, 185, 129, 0.15) !important;
        }
        .prediction-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        .prediction-button-secondary:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

function LiveMatchesWidget() {
  const matches = [
    { team1: 'Man City', team2: 'Arsenal', score: '2-1', time: "67'" },
    { team1: 'Barcelona', team2: 'Real Madrid', score: '1-1', time: "45'" },
    { team1: 'Bayern', team2: 'PSG', score: '3-2', time: "82'" }
  ];

  return (
    <div style={{ color: 'white' }}>
      {matches.map((match, idx) => (
        <div key={idx} className="match-card" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid transparent'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '4px', fontWeight: '500' }}>
              {match.team1} vs {match.team2}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              🟢 {match.time}
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
            {match.score}
          </div>
        </div>
      ))}
      <style jsx>{`
        .match-card:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(4px);
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
}

function AchievementsWidget() {
  const achievements = [
    { icon: '🏆', name: 'Prediction Master', unlocked: true },
    { icon: '🎯', name: '10 Streak', unlocked: true },
    { icon: '⭐', name: 'Perfect Week', unlocked: false },
    { icon: '🔥', name: 'Hot Streak', unlocked: false }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {achievements.map((ach, idx) => (
        <div key={idx} style={{
          background: ach.unlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: ach.unlocked ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
          opacity: ach.unlocked ? 1 : 0.5
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{ach.icon}</div>
          <div style={{ fontSize: '0.75rem', color: 'white' }}>{ach.name}</div>
        </div>
      ))}
    </div>
  );
}

function AccuracyStatsWidget() {
  return (
    <div style={{ color: 'white' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>78%</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>Accuracy</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>124</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>Predictions</div>
        </div>
      </div>
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        padding: '12px',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>Current Streak</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
          🔥 7 Days
        </div>
      </div>
    </div>
  );
}

function ActivityFeedWidget() {
  const activities = [
    { icon: '✅', text: 'Predicted Lakers win correctly', time: '5m ago', color: '#10b981' },
    { icon: '⭐', text: 'Unlocked "Prediction Master" badge', time: '1h ago', color: '#f59e0b' },
    { icon: '📰', text: 'Read "NBA Playoff Preview"', time: '2h ago', color: '#3b82f6' },
    { icon: '👥', text: 'Started following @SportsAnalyst', time: '3h ago', color: '#8b5cf6' }
  ];

  return (
    <div style={{ color: 'white' }}>
      {activities.map((activity, idx) => (
        <div key={idx} style={{
          display: 'flex',
          gap: '12px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '8px',
          borderLeft: `3px solid ${activity.color}`
        }}>
          <div style={{ fontSize: '1.2rem' }}>{activity.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{activity.text}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              {activity.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

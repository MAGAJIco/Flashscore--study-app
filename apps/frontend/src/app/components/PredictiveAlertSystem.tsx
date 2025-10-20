"use client";

import React, { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'value' | 'injury' | 'weather' | 'odds' | 'lineup';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  matchName: string;
  sport: string;
  timestamp: Date;
  impact: number; // -100 to +100
  actionable: string;
  isRead: boolean;
}

export default function PredictiveAlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'value' | 'injury' | 'weather'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAlerts([
      {
        id: '1',
        type: 'value',
        priority: 'high',
        title: 'Value Opportunity Detected',
        message: 'Odds shifted favorably for Liverpool vs Chelsea',
        matchName: 'Liverpool vs Chelsea',
        sport: 'Football',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        impact: 25,
        actionable: 'Away Win odds increased from 2.8 to 3.2 (+14% value)',
        isRead: false
      },
      {
        id: '2',
        type: 'injury',
        priority: 'high',
        title: 'Critical Injury Update',
        message: 'Star player ruled out - prediction confidence adjusted',
        matchName: 'Lakers vs Celtics',
        sport: 'Basketball',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        impact: -35,
        actionable: 'LeBron James (OUT) - Lakers win probability dropped to 42%',
        isRead: false
      },
      {
        id: '3',
        type: 'weather',
        priority: 'medium',
        title: 'Weather Conditions Changed',
        message: 'Heavy rain expected - impacts outdoor match',
        matchName: 'Real Madrid vs Barcelona',
        sport: 'Football',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        impact: -15,
        actionable: 'Rain favors defensive play - Under 2.5 goals +18% likely',
        isRead: true
      },
      {
        id: '4',
        type: 'odds',
        priority: 'medium',
        title: 'Market Movement Alert',
        message: 'Sharp money detected on underdog',
        matchName: 'Warriors vs Nuggets',
        sport: 'Basketball',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        impact: 12,
        actionable: 'Warriors odds shortening rapidly - possible value before match',
        isRead: true
      }
    ]);
  }, []);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const highPriorityCount = alerts.filter(a => a.priority === 'high' && !a.isRead).length;

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'high') return alert.priority === 'high';
    if (filter === 'value') return alert.type === 'value';
    if (filter === 'injury') return alert.type === 'injury';
    if (filter === 'weather') return alert.type === 'weather';
    return true;
  });

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'value': return '💰';
      case 'injury': return '🏥';
      case 'weather': return '🌧️';
      case 'odds': return '📊';
      case 'lineup': return '👥';
      default: return '🔔';
    }
  };

  const getAlertColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 15) return '#10b981';
    if (impact > 0) return '#3b82f6';
    if (impact > -15) return '#f59e0b';
    return '#ef4444';
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Alert Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="notification-bell-button"
        style={{
          position: 'fixed',
          top: '100px',
          right: '30px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Predictive Alerts"
      >
        🔔
        {unreadCount > 0 && (
          <div className="notification-badge" style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #1f2937'
          }}>
            {unreadCount}
          </div>
        )}
      </button>
      
      <style jsx>{`
        .notification-bell-button {
          width: 60px;
          height: 60px;
          font-size: 1.5rem;
        }
        
        .notification-badge {
          width: 24px;
          height: 24px;
          font-size: 0.7rem;
        }
        
        /* Mobile devices */
        @media (max-width: 768px) {
          .notification-bell-button {
            width: 45px;
            height: 45px;
            font-size: 1.2rem;
            top: 80px;
            right: 20px;
          }
          
          .notification-badge {
            width: 20px;
            height: 20px;
            font-size: 0.65rem;
            top: -4px;
            right: -4px;
          }
        }
        
        /* Small mobile devices */
        @media (max-width: 480px) {
          .notification-bell-button {
            width: 42px;
            height: 42px;
            font-size: 1.1rem;
          }
          
          .notification-badge {
            width: 18px;
            height: 18px;
            font-size: 0.6rem;
          }
        }
      `}</style>

      {/* Alert Panel */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          top: '170px',
          right: '30px',
          width: '400px',
          maxHeight: '600px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.3rem', fontWeight: 'bold' }}>
                🔔 Smart Alerts
              </h2>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{
                flex: 1,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {highPriorityCount}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>High Priority</div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {unreadCount}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Unread</div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                  {alerts.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Total</div>
              </div>
            </div>

            {/* Advanced Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', 'unread', 'high', 'value', 'injury', 'weather'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  style={{
                    flex: '1 1 auto',
                    padding: '8px 12px',
                    background: filter === f ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${filter === f ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '8px',
                    color: filter === f ? '#3b82f6' : '#9ca3af',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: filter === f ? 'bold' : 'normal',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f === 'all' && '📋 All'}
                  {f === 'unread' && '🔔 Unread'}
                  {f === 'high' && '🔴 High'}
                  {f === 'value' && '💰 Value'}
                  {f === 'injury' && '🏥 Injury'}
                  {f === 'weather' && '🌧️ Weather'}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Alerts List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
            {filteredAlerts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9ca3af'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
                <div>No alerts to show</div>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    background: alert.isRead ? 'rgba(255, 255, 255, 0.03)' : 'rgba(59, 130, 246, 0.1)',
                    border: `1px solid ${alert.isRead ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.3)'}`,
                    borderLeft: `4px solid ${getAlertColor(alert.priority)}`,
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => markAsRead(alert.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = alert.isRead ? 'rgba(255, 255, 255, 0.03)' : 'rgba(59, 130, 246, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{getAlertIcon(alert.type)}</span>
                      <div>
                        <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.9rem' }}>
                          {alert.title}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                          {formatTimestamp(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAlert(alert.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '0 5px'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '8px' }}>
                    {alert.message}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {alert.matchName}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: getImpactColor(alert.impact),
                      fontWeight: 'bold'
                    }}>
                      {alert.impact > 0 ? '+' : ''}{alert.impact}% impact
                    </span>
                  </div>

                  <div style={{
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#d1d5db',
                    borderLeft: `3px solid ${getImpactColor(alert.impact)}`
                  }}>
                    💡 {alert.actionable}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
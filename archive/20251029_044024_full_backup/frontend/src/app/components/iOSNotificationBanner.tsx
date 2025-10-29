
'use client';

import { useState, useEffect } from 'react';
import { haptic } from './HapticFeedback';
import { Bell, Trophy, TrendingUp, X } from 'lucide-react';

export interface NotificationData {
  id: string;
  type: 'match_update' | 'prediction_result' | 'achievement' | 'alert';
  title: string;
  message: string;
  matchId?: string;
  timestamp: Date;
  duration?: number;
}

export function iOSNotificationBanner() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [activeNotification, setActiveNotification] = useState<NotificationData | null>(null);

  const showNotification = (notification: NotificationData) => {
    setNotifications(prev => [...prev, notification]);
    haptic.notification();
  };

  useEffect(() => {
    if (notifications.length > 0 && !activeNotification) {
      const next = notifications[0];
      setActiveNotification(next);
      
      const duration = next.duration || 4000;
      const timer = setTimeout(() => {
        dismissNotification(next.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notifications, activeNotification]);

  const dismissNotification = (id: string) => {
    setActiveNotification(null);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'match_update':
        return <Trophy className="w-5 h-5" />;
      case 'prediction_result':
        return <TrendingUp className="w-5 h-5" />;
      case 'achievement':
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  if (!activeNotification) return null;

  return (
    <>
      <div 
        className="ios-notification-banner"
        onClick={() => haptic.impact('light')}
      >
        <div className="notification-content">
          <div className="notification-icon">
            {getIcon(activeNotification.type)}
          </div>
          <div className="notification-text">
            <div className="notification-title">{activeNotification.title}</div>
            <div className="notification-message">{activeNotification.message}</div>
          </div>
          <button 
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(activeNotification.id);
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="notification-progress">
          <div className="progress-bar" />
        </div>
      </div>

      <style jsx>{`
        .ios-notification-banner {
          position: fixed;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 400px;
          background: rgba(28, 28, 30, 0.95);
          backdrop-filter: blur(20px) saturate(1.8);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          z-index: 10000;
          animation: slideDown 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          background: var(--ios-blue);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .notification-text {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          font-size: 15px;
          font-weight: 600;
          color: white;
          margin-bottom: 2px;
        }

        .notification-message {
          font-size: 14px;
          color: rgba(235, 235, 245, 0.6);
          line-height: 1.4;
        }

        .notification-close {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .notification-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0 0 16px 16px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: var(--ios-blue);
          animation: progressBar 4s linear forwards;
        }

        @keyframes progressBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
}

// Global notification manager
class NotificationManager {
  private listeners: ((notification: NotificationData) => void)[] = [];

  subscribe(callback: (notification: NotificationData) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify(notification: Omit<NotificationData, 'id' | 'timestamp'>) {
    const fullNotification: NotificationData = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
    
    this.listeners.forEach(listener => listener(fullNotification));
  }
}

export const notificationManager = new NotificationManager();

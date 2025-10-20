
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

interface EchoSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  autoHideDuration?: number;
}

const EchoSystem: React.FC<EchoSystemProps> = ({
  position = 'top-right',
  maxNotifications = 5,
  autoHideDuration = 5000
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    // Auto-hide after duration
    const timeoutId = setTimeout(() => {
      removeNotification(newNotification.id);
    }, autoHideDuration);

    timeoutsRef.current.set(newNotification.id, timeoutId);
  }, [maxNotifications, autoHideDuration]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setNotifications([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  // Expose methods globally for use across app
  useEffect(() => {
    (window as any).echoSystem = {
      notify: addNotification,
      success: (title: string, message: string) => addNotification({ type: 'success', title, message }),
      info: (title: string, message: string) => addNotification({ type: 'info', title, message }),
      warning: (title: string, message: string) => addNotification({ type: 'warning', title, message }),
      error: (title: string, message: string) => addNotification({ type: 'error', title, message })
    };
  }, [addNotification]);

  const getPositionClasses = (): string => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      default: return 'top-4 right-4';
    }
  };

  const getTypeStyles = (type: Notification['type']): string => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'info': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getTypeIcon = (type: Notification['type']): string => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999] w-96 max-w-[calc(100vw-2rem)]`}>
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-t-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔔</span>
          <span className="text-white font-semibold">Echo System</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▼' : '▲'}
          </button>
          <button
            onClick={clearAll}
            className="text-gray-400 hover:text-red-400 transition-colors p-1"
            aria-label="Clear all"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Notifications */}
      {!isMinimized && (
        <div className="bg-gray-900/95 backdrop-blur-sm border-x border-b border-gray-700/50 rounded-b-xl max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-700/30 last:border-b-0 ${
                notification.read ? 'opacity-60' : ''
              } transition-all duration-300 hover:bg-white/5`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTypeStyles(notification.type)} border`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm truncate">
                      {notification.title}
                    </h4>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-500 hover:text-white transition-colors text-xs flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-300 text-xs mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 text-xs">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    {notification.action && (
                      <button
                        onClick={() => {
                          notification.action?.callback();
                          markAsRead(notification.id);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                      >
                        {notification.action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EchoSystem;

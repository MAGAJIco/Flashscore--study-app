"use client";

import React, { useState, useEffect } from 'react';

interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

let alertTrigger: ((alert: AlertMessage) => void) | null = null;

export function triggerFloatingAlert(alert: AlertMessage) {
  if (alertTrigger) {
    alertTrigger(alert);
  }
}

export function FloatingAlert() {
  const [alerts, setAlerts] = useState<(AlertMessage & { id: number })[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    alertTrigger = (alert: AlertMessage) => {
      const id = nextId;
      setNextId(id + 1);
      setAlerts(prev => [...prev, { ...alert, id }]);

      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }, alert.duration || 3000);
    };

    return () => {
      alertTrigger = null;
    };
  }, [nextId]);

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`${getBackgroundColor(alert.type)} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in-right max-w-sm`}
        >
          <div className="font-bold">{alert.title}</div>
          <div className="text-sm">{alert.message}</div>
        </div>
      ))}
    </div>
  );
}

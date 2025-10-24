"use client";
import React, { useEffect, useState } from 'react';

interface OfflineManagerProps {
  children: React.ReactNode;
}

interface PendingAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const savePendingActions = (actions: PendingAction[]) => {
    localStorage.setItem('pendingActions', JSON.stringify(actions));
    setPendingActions(actions);
  };

  const syncPendingActions = async () => {
    const stored = localStorage.getItem('pendingActions');
    if (!stored) return;

    try {
      const actions: PendingAction[] = JSON.parse(stored);
      const remaining: PendingAction[] = [];

      for (const action of actions) {
        try {
          // Process each action
          console.log(`Processing offline action: ${action.type}`);
          // Add actual sync logic here
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          remaining.push(action);
        }
      }

      savePendingActions(remaining);

      if (remaining.length === 0) {
        console.log("✅ Offline actions merged successfully");
      }
    } catch (error) {
      console.error("❌ Error syncing offline data:", error);
    }
  };

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-white p-2 text-center z-50">
          You're offline. Changes will sync when connection is restored.
        </div>
      )}
      {children}
    </>
  );
};

export { OfflineManager };
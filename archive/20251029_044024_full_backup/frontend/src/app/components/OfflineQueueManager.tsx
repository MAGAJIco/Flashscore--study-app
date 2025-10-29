"use client";

import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';
import { useOfflineStatus } from '@hooks/useOfflineStatus';

interface QueuedAction {
  id: string;
  type: 'prediction' | 'quiz' | 'vote' | 'comment';
  data: any;
  timestamp: number;
  retries: number;
}

const OfflineQueueManager: React.FC = () => {
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [syncing, setSyncing] = useState(false);
  const isOnline = useOfflineStatus(); // Replaced state with hook

  useEffect(() => {
    const savedQueue = ClientStorage.getItem('offline_queue', []);
    setQueue(Array.isArray(savedQueue) ? savedQueue : []);

    // Removed redundant online/offline event listeners as useOfflineStatus hook handles this
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline]); // Sync when online status changes

  const syncQueue = async () => {
    const queueLength = queue?.length ?? 0;
    if (queueLength === 0 || syncing) return;

    setSyncing(true);
    const remainingQueue: QueuedAction[] = [];

    for (const action of queue) {
      try {
        await processAction(action);
      } catch (error) {
        if (action.retries < 3) {
          remainingQueue.push({ ...action, retries: action.retries + 1 });
        }
      }
    }

    setQueue(remainingQueue);
    ClientStorage.setItem('offline_queue', remainingQueue);
    setSyncing(false);
  };

  const processAction = async (action: QueuedAction): Promise<void> => {
    const endpoint = getEndpointForAction(action.type);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.data)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync ${action.type}`);
    }
  };

  const getEndpointForAction = (type: string): string => {
    const endpoints: Record<string, string> = {
      prediction: '/api/predictions',
      quiz: '/api/quiz/submit',
      vote: '/api/votes',
      comment: '/api/comments'
    };
    return endpoints[type] || '/api/actions';
  };

  if (!queue || !Array.isArray(queue) || queue.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="glass-card p-4 border-l-4 border-orange-500">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Offline Queue</span>
          </div>
          <span className="text-gray-300 text-sm">{queue.length} items</span>
        </div>

        <p className="text-gray-400 text-sm mb-3">
          {isOnline
            ? syncing
              ? 'Syncing your actions...'
              : 'Actions will sync automatically'
            : 'Actions will sync when online'}
        </p>

        {isOnline && !syncing && (
          <button
            onClick={syncQueue}
            className="ios-button bg-gradient-to-r from-orange-600 to-orange-700 w-full text-sm py-2"
          >
            Sync Now
          </button>
        )}

        {syncing && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            <span className="text-orange-400 text-sm">Syncing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { OfflineQueueManager };